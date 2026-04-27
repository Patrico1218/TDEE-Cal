from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal
import yfinance as yf
import pandas as pd
import pandas_ta as ta

router = APIRouter()


class BacktestRequest(BaseModel):
    symbol: str
    period: str = "2y"
    interval: str = "1d"
    entry_indicator: Literal["ma_cross", "rsi_oversold", "macd_cross"]
    exit_indicator: Literal["ma_cross", "rsi_overbought", "macd_cross"]
    initial_capital: float = 10000.0


class Trade(BaseModel):
    entry_date: str
    exit_date: str
    entry_price: float
    exit_price: float
    pnl: float
    pnl_pct: float


def compute_indicators(df: pd.DataFrame) -> pd.DataFrame:
    df["ma5"] = ta.sma(df["Close"], length=5)
    df["ma20"] = ta.sma(df["Close"], length=20)
    df["rsi"] = ta.rsi(df["Close"], length=14)
    macd = ta.macd(df["Close"])
    if macd is not None:
        df["macd"] = macd["MACD_12_26_9"]
        df["macd_signal"] = macd["MACDs_12_26_9"]
    return df


def generate_signals(df: pd.DataFrame, entry: str, exit_: str) -> pd.DataFrame:
    df["entry_signal"] = False
    df["exit_signal"] = False

    if entry == "ma_cross":
        df["entry_signal"] = (df["ma5"] > df["ma20"]) & (df["ma5"].shift(1) <= df["ma20"].shift(1))
    elif entry == "rsi_oversold":
        df["entry_signal"] = (df["rsi"] < 30) & (df["rsi"].shift(1) >= 30)
    elif entry == "macd_cross":
        df["entry_signal"] = (df["macd"] > df["macd_signal"]) & (df["macd"].shift(1) <= df["macd_signal"].shift(1))

    if exit_ == "ma_cross":
        df["exit_signal"] = (df["ma5"] < df["ma20"]) & (df["ma5"].shift(1) >= df["ma20"].shift(1))
    elif exit_ == "rsi_overbought":
        df["exit_signal"] = (df["rsi"] > 70) & (df["rsi"].shift(1) <= 70)
    elif exit_ == "macd_cross":
        df["exit_signal"] = (df["macd"] < df["macd_signal"]) & (df["macd"].shift(1) >= df["macd_signal"].shift(1))

    return df


def run_backtest(df: pd.DataFrame, initial_capital: float) -> dict:
    trades: list[Trade] = []
    capital = initial_capital
    in_position = False
    entry_price = 0.0
    entry_date = ""

    for i, row in df.iterrows():
        if not in_position and row["entry_signal"]:
            in_position = True
            entry_price = row["Close"]
            entry_date = str(row["date"])
        elif in_position and row["exit_signal"]:
            exit_price = row["Close"]
            pnl_pct = (exit_price - entry_price) / entry_price
            pnl = capital * pnl_pct
            capital += pnl
            trades.append(Trade(
                entry_date=entry_date,
                exit_date=str(row["date"]),
                entry_price=round(entry_price, 4),
                exit_price=round(exit_price, 4),
                pnl=round(pnl, 2),
                pnl_pct=round(pnl_pct * 100, 2),
            ))
            in_position = False

    total_trades = len(trades)
    winning_trades = [t for t in trades if t.pnl > 0]
    win_rate = len(winning_trades) / total_trades if total_trades > 0 else 0
    total_return = (capital - initial_capital) / initial_capital * 100
    max_drawdown = 0.0

    running_capital = initial_capital
    peak = initial_capital
    for t in trades:
        running_capital += t.pnl
        if running_capital > peak:
            peak = running_capital
        drawdown = (peak - running_capital) / peak * 100
        if drawdown > max_drawdown:
            max_drawdown = drawdown

    return {
        "total_trades": total_trades,
        "win_rate": round(win_rate * 100, 2),
        "total_return_pct": round(total_return, 2),
        "final_capital": round(capital, 2),
        "max_drawdown_pct": round(max_drawdown, 2),
        "trades": [t.model_dump() for t in trades],
    }


@router.post("")
def backtest(req: BacktestRequest):
    symbol = req.symbol.upper()
    ticker = yf.Ticker(symbol)
    df = ticker.history(period=req.period, interval=req.interval, auto_adjust=True)
    if df.empty:
        raise HTTPException(status_code=404, detail=f"No data for {symbol}")
    df.index = df.index.tz_localize(None)
    df = df.reset_index().rename(columns={"Date": "date", "Datetime": "date"})
    df["date"] = df["date"].astype(str).str[:10]
    df = compute_indicators(df)
    df = generate_signals(df, req.entry_indicator, req.exit_indicator)
    result = run_backtest(df, req.initial_capital)
    result["symbol"] = symbol
    result["period"] = req.period
    result["entry_indicator"] = req.entry_indicator
    result["exit_indicator"] = req.exit_indicator
    return result
