import { Routes, Route, NavLink } from "react-router-dom";
import StockPage from "./pages/StockPage";
import WatchlistPage from "./pages/WatchlistPage";
import BacktestPage from "./pages/BacktestPage";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <span className={styles.logo}>AlphaScope</span>
        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ""}>Chart</NavLink>
          <NavLink to="/watchlist" className={({ isActive }) => isActive ? styles.active : ""}>Watchlist</NavLink>
          <NavLink to="/backtest" className={({ isActive }) => isActive ? styles.active : ""}>Backtest</NavLink>
        </nav>
      </header>
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<StockPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/backtest" element={<BacktestPage />} />
        </Routes>
      </main>
    </div>
  );
}
