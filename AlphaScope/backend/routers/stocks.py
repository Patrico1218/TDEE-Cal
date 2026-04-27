from fastapi import APIRouter, HTTPException, Query
from typing import Literal
import yfinance as yf
import pandas as pd
import pandas_ta as ta

router = APIRouter()

INTERVALS = {"1d", "1wk", "1mo"}
PERIODS = {"1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "max"}


def fetch_ohlcv(symbol: str, period: str, interval: str) -> pd.DataFrame:
    ticker = yf.Ticker(symbol)
    df = ticker.history(period=period, interval=interval, auto_adjust=True)
    if df.empty:
        raise HTTPException(status_code=404, detail=f"No data found for symbol: {symbol}")
    df.index = df.index.tz_localize(None)
    return df


def add_indicators(df: pd.DataFrame) -> pd.DataFrame:
    df["ma5"] = ta.sma(df["Close"], length=5)
    df["ma20"] = ta.sma(df["Close"], length=20)
    df["ma60"] = ta.sma(df["Close"], length=60)

    bb = ta.bbands(df["Close"], length=20, std=2)
    if bb is not None:
        df["bb_upper"] = bb["BBU_20_2.0"]
        df["bb_middle"] = bb["BBM_20_2.0"]
        df["bb_lower"] = bb["BBL_20_2.0"]

    macd = ta.macd(df["Close"])
    if macd is not None:
        df["macd"] = macd["MACD_12_26_9"]
        df["macd_signal"] = macd["MACDs_12_26_9"]
        df["macd_hist"] = macd["MACDh_12_26_9"]

    df["rsi"] = ta.rsi(df["Close"], length=14)

    stoch = ta.stoch(df["High"], df["Low"], df["Close"])
    if stoch is not None:
        df["stoch_k"] = stoch["STOCHk_14_3_3"]
        df["stoch_d"] = stoch["STOCHd_14_3_3"]

    return df


@router.get("/{symbol}")
def get_stock_data(
    symbol: str,
    period: str = Query("1y", description="1mo 3mo 6mo 1y 2y 5y 10y max"),
    interval: str = Query("1d", description="1d 1wk 1mo"),
):
    symbol = symbol.upper()
    if period not in PERIODS:
        raise HTTPException(status_code=400, detail=f"Invalid period. Choose from: {PERIODS}")
    if interval not in INTERVALS:
        raise HTTPException(status_code=400, detail=f"Invalid interval. Choose from: {INTERVALS}")

    df = fetch_ohlcv(symbol, period, interval)
    df = add_indicators(df)
    df = df.reset_index().rename(columns={"Date": "date", "Datetime": "date"})
    df["date"] = df["date"].astype(str).str[:10]

    records = df.rename(columns={
        "Open": "open", "High": "high", "Low": "low",
        "Close": "close", "Volume": "volume"
    }).where(pd.notna(df), None).to_dict(orient="records")

    info = yf.Ticker(symbol).fast_info
    return {
        "symbol": symbol,
        "period": period,
        "interval": interval,
        "name": getattr(info, "display_name", symbol),
        "currency": getattr(info, "currency", "USD"),
        "data": records,
    }


@router.get("/{symbol}/info")
def get_stock_info(symbol: str):
    symbol = symbol.upper()
    ticker = yf.Ticker(symbol)
    info = ticker.fast_info
    if not info:
        raise HTTPException(status_code=404, detail=f"Symbol not found: {symbol}")
    return {
        "symbol": symbol,
        "name": getattr(info, "display_name", symbol),
        "currency": getattr(info, "currency", "USD"),
        "last_price": getattr(info, "last_price", None),
        "market_cap": getattr(info, "market_cap", None),
        "fifty_two_week_high": getattr(info, "year_high", None),
        "fifty_two_week_low": getattr(info, "year_low", None),
    }
