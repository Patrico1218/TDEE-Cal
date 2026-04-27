import { useState } from "react";
import { backtestApi } from "../api/client";
import styles from "./BacktestPage.module.css";

const INDICATORS = [
  { value: "ma_cross", label: "MA Cross (MA5 / MA20)" },
  { value: "rsi_oversold", label: "RSI Oversold (< 30)" },
  { value: "macd_cross", label: "MACD Cross" },
];

const EXIT_INDICATORS = [
  { value: "ma_cross", label: "MA Cross (MA5 / MA20)" },
  { value: "rsi_overbought", label: "RSI Overbought (> 70)" },
  { value: "macd_cross", label: "MACD Cross" },
];

const PERIODS = ["6mo", "1y", "2y", "5y"];

export default function BacktestPage() {
  const [form, setForm] = useState({
    symbol: "",
    period: "2y",
    entry_indicator: "ma_cross",
    exit_indicator: "rsi_overbought",
    initial_capital: 10000,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(key, val) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function handleRun(e) {
    e.preventDefault();
    if (!form.symbol.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await backtestApi.run({ ...form, symbol: form.symbol.trim().toUpperCase() });
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Backtest</h2>

      <form onSubmit={handleRun} className={styles.form}>
        <div className={styles.row}>
          <label className={styles.label}>Symbol</label>
          <input
            value={form.symbol}
            onChange={e => update("symbol", e.target.value)}
            placeholder="e.g. AAPL"
            className={styles.input}
          />
        </div>
        <div className={styles.row}>
          <label className={styles.label}>Period</label>
          <div className={styles.btnGroup}>
            {PERIODS.map(p => (
              <button type="button" key={p} onClick={() => update("period", p)}
                className={form.period === p ? styles.btnActive : styles.btnInactive}>{p}</button>
            ))}
          </div>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>Entry Signal</label>
          <select value={form.entry_indicator} onChange={e => update("entry_indicator", e.target.value)} className={styles.select}>
            {INDICATORS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>Exit Signal</label>
          <select value={form.exit_indicator} onChange={e => update("exit_indicator", e.target.value)} className={styles.select}>
            {EXIT_INDICATORS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>Initial Capital ($)</label>
          <input
            type="number"
            value={form.initial_capital}
            onChange={e => update("initial_capital", parseFloat(e.target.value))}
            className={styles.input}
            min={100}
          />
        </div>
        <button type="submit" className={styles.runBtn} disabled={loading}>
          {loading ? "Running..." : "Run Backtest"}
        </button>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      {result && (
        <div className={styles.results}>
          <h3 className={styles.resultTitle}>{result.symbol} — {result.period}</h3>

          <div className={styles.statsGrid}>
            <Stat label="Total Return" value={`${result.total_return_pct >= 0 ? "+" : ""}${result.total_return_pct}%`} color={result.total_return_pct >= 0 ? "green" : "red"} />
            <Stat label="Final Capital" value={`$${result.final_capital.toLocaleString()}`} />
            <Stat label="Win Rate" value={`${result.win_rate}%`} color={result.win_rate >= 50 ? "green" : "red"} />
            <Stat label="Total Trades" value={result.total_trades} />
            <Stat label="Max Drawdown" value={`-${result.max_drawdown_pct}%`} color="red" />
          </div>

          {result.trades.length > 0 && (
            <div className={styles.tradeTable}>
              <h4 className={styles.tradeTitle}>Trade History</h4>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Entry Date</th>
                    <th>Exit Date</th>
                    <th>Entry Price</th>
                    <th>Exit Price</th>
                    <th>P&L</th>
                    <th>P&L %</th>
                  </tr>
                </thead>
                <tbody>
                  {result.trades.map((t, i) => (
                    <tr key={i} className={t.pnl >= 0 ? styles.win : styles.loss}>
                      <td>{t.entry_date}</td>
                      <td>{t.exit_date}</td>
                      <td>${t.entry_price}</td>
                      <td>${t.exit_price}</td>
                      <td>{t.pnl >= 0 ? "+" : ""}${t.pnl.toFixed(2)}</td>
                      <td>{t.pnl_pct >= 0 ? "+" : ""}{t.pnl_pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue} style={{ color: color === "green" ? "var(--green)" : color === "red" ? "var(--red)" : "var(--text-primary)" }}>
        {value}
      </span>
    </div>
  );
}
