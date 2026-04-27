from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os

router = APIRouter()

WATCHLIST_FILE = os.path.join(os.path.dirname(__file__), "..", "watchlist.json")


def load_watchlist() -> list[str]:
    if not os.path.exists(WATCHLIST_FILE):
        return []
    with open(WATCHLIST_FILE, "r") as f:
        return json.load(f)


def save_watchlist(symbols: list[str]):
    with open(WATCHLIST_FILE, "w") as f:
        json.dump(symbols, f)


class SymbolBody(BaseModel):
    symbol: str


@router.get("")
def get_watchlist():
    return {"symbols": load_watchlist()}


@router.post("")
def add_to_watchlist(body: SymbolBody):
    symbols = load_watchlist()
    symbol = body.symbol.upper()
    if symbol in symbols:
        raise HTTPException(status_code=409, detail=f"{symbol} already in watchlist")
    symbols.append(symbol)
    save_watchlist(symbols)
    return {"symbols": symbols}


@router.delete("/{symbol}")
def remove_from_watchlist(symbol: str):
    symbol = symbol.upper()
    symbols = load_watchlist()
    if symbol not in symbols:
        raise HTTPException(status_code=404, detail=f"{symbol} not in watchlist")
    symbols.remove(symbol)
    save_watchlist(symbols)
    return {"symbols": symbols}
