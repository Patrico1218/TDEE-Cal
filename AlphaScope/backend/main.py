from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import stocks, watchlist, backtest

app = FastAPI(title="AlphaScope API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stocks.router, prefix="/api/stocks", tags=["stocks"])
app.include_router(watchlist.router, prefix="/api/watchlist", tags=["watchlist"])
app.include_router(backtest.router, prefix="/api/backtest", tags=["backtest"])


@app.get("/")
def root():
    return {"message": "AlphaScope API is running"}
