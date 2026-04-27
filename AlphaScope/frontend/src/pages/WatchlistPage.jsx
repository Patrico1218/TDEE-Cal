import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { watchlistApi, stocksApi } from "../api/client";
import styles from "./WatchlistPage.module.css";

export default function WatchlistPage() {
  const [symbols, setSymbols] = useState([]);
  const [quotes, setQuotes] = useState({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    watchlistApi.get().then(r => {
      setSymbols(r.symbols);
      fetchQuotes(r.symbols);
    });
  }, []);

  async function fetchQuotes(syms) {
    const results = await Promise.allSettled(syms.map(s => stocksApi.getInfo(s)));
    const map = {};
    syms.forEach((s, i) => {
      if (results[i].status === "fulfilled") map[s] = results[i].value;
    });
    setQuotes(map);
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await watchlistApi.add(input.trim());
      setSymbols(res.symbols);
      fetchQuotes(res.symbols);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  async function handleRemove(sym) {
    const res = await watchlistApi.remove(sym);
    setSymbols(res.symbols);
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Watchlist</h2>

      <form onSubmit={handleAdd} className={styles.addBar}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add symbol (e.g. AAPL)"
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.addBtn}>Add</button>
      </form>

      {symbols.length === 0 ? (
        <div className={styles.empty}>Your watchlist is empty. Add some stocks above.</div>
      ) : (
        <div className={styles.grid}>
          {symbols.map(sym => {
            const q = quotes[sym];
            return (
              <div key={sym} className={styles.card} onClick={() => navigate(`/?symbol=${sym}`)}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardSym}>{sym}</span>
                  <button className={styles.removeBtn} onClick={e => { e.stopPropagation(); handleRemove(sym); }}>✕</button>
                </div>
                {q ? (
                  <>
                    <div className={styles.cardPrice}>${q.last_price?.toFixed(2)}</div>
                    <div className={styles.cardMeta}>
                      <span>52W H: ${q.fifty_two_week_high?.toFixed(2)}</span>
                      <span>52W L: ${q.fifty_two_week_low?.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className={styles.cardLoading}>Loading...</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
