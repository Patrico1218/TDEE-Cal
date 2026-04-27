const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || res.statusText);
  }
  return res.json();
}

export const stocksApi = {
  getData: (symbol, period = "1y", interval = "1d") =>
    request(`/stocks/${symbol}?period=${period}&interval=${interval}`),
  getInfo: (symbol) => request(`/stocks/${symbol}/info`),
};

export const watchlistApi = {
  get: () => request("/watchlist"),
  add: (symbol) => request("/watchlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ symbol }) }),
  remove: (symbol) => request(`/watchlist/${symbol}`, { method: "DELETE" }),
};

export const backtestApi = {
  run: (payload) => request("/backtest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }),
};
