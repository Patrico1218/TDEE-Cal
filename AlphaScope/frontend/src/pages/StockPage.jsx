import { useState } from "react";
import CandleChart from "../components/CandleChart";
import OscillatorChart from "../components/OscillatorChart";
import { stocksApi, watchlistApi } from "../api/client";
import styles from "./StockPage.module.css";

const PERIODS = ["1mo", "3mo", "6mo", "1y", "2y", "5y"];
const OSCILLATORS = [
  { key: "rsi", label: "RSI" },
  { key: "macd", label: "MACD" },
  { key: "kd", label: "KD" },
];

export default function StockPage() {
  const [input, setInput] = useState("");
  const [symbol, setSymbol] = useState("");
  const [period, setPeriod] = useState("1y");
  const [data, setData] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [oscillator, setOscillator] = useState("rsi");
  const [indicators, setIndicators] = useState({ bollinger: false });
  const [watchMsg, setWatchMsg] = useState("");

  async function fetchStock(sym, per) {
    setLoading(true);
    setError("");
    try {
      const [stockData, stockInfo] = await Promise.all([
        stocksApi.getData(sym, per),
        stocksApi.getInfo(sym),
      ]);
      setData(stockData.data);
      setInfo(stockInfo);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const sym = input.trim().toUpperCase();
    setSymbol(sym);
    fetchStock(sym, period);
  }

  function handlePeriod(p) {
    setPeriod(p);
    if (symbol) fetchStock(symbol, p);
  }

  async function handleAddWatchlist() {
    try {
      await watchlistApi.add(symbol);
      setWatchMsg("Added to watchlist!");
    } catch (e) {
      setWatchMsg(e.message);
    }
    setTimeout(() => setWatchMsg(""), 2000);
  }

  const priceChange = data?.length >= 2
    ? ((data.at(-1).close - data.at(-2).close) / data.at(-2).close * 100).toFixed(2)
    : null;

  return (
    <div className={styles.page}>
      <form onSubmit={handleSearch} className={styles.searchBar}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter symbol (e.g. AAPL, TSLA, NVDA)"
          className={styles.input}
        />
        <button type="submit" className={styles.btn}>Search</button>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      {info && (
        <div className={styles.infoBar}>
          <div className={styles.infoLeft}>
            <span className={styles.sym}>{info.symbol}</span>
            <span className={styles.name}>{info.name}</span>
          </div>
          <div className={styles.infoRight}>
            <span className={styles.price}>${info.last_price?.toFixed(2)}</span>
            {priceChange !== null && (
              <span className={parseFloat(priceChange) >= 0 ? styles.up : styles.down}>
                {parseFloat(priceChange) >= 0 ? "+" : ""}{priceChange}%
              </span>
            )}
            <button onClick={handleAddWatchlist} className={styles.watchBtn}>+ Watchlist</button>
            {watchMsg && <span className={styles.watchMsg}>{watchMsg}</span>}
          </div>
        </div>
      )}

      {data && (
        <>
          <div className={styles.controls}>
            <div className={styles.periodBtns}>
              {PERIODS.map(p => (
                <button key={p} onClick={() => handlePeriod(p)} className={p === period ? styles.periodActive : styles.periodBtn}>{p}</button>
              ))}
            </div>
            <div className={styles.toggles}>
              <label className={styles.toggle}>
                <input type="checkbox" checked={indicators.bollinger} onChange={e => setIndicators(v => ({ ...v, bollinger: e.target.checked }))} />
                Bollinger Bands
              </label>
            </div>
          </div>

          {loading ? <div className={styles.loading}>Loading...</div> : (
            <>
              <CandleChart data={data} indicators={indicators} />

              <div className={styles.oscBar}>
                {OSCILLATORS.map(o => (
                  <button key={o.key} onClick={() => setOscillator(o.key)} className={o.key === oscillator ? styles.oscActive : styles.oscBtn}>{o.label}</button>
                ))}
              </div>
              <OscillatorChart data={data} type={oscillator} />
            </>
          )}
        </>
      )}

      {!data && !loading && (
        <div className={styles.empty}>Enter a stock symbol above to get started.</div>
      )}
    </div>
  );
}
