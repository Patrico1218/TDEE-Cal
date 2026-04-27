import { useEffect, useRef } from "react";
import { createChart, ColorType } from "lightweight-charts";
import styles from "./OscillatorChart.module.css";

export default function OscillatorChart({ data, type }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      layout: { background: { type: ColorType.Solid, color: "#1c2128" }, textColor: "#8b949e" },
      grid: { vertLines: { color: "#30363d" }, horzLines: { color: "#30363d" } },
      rightPriceScale: { borderColor: "#30363d" },
      timeScale: { borderColor: "#30363d", timeVisible: true },
      width: containerRef.current.clientWidth,
      height: 160,
    });
    chartRef.current = chart;
    const ro = new ResizeObserver(() => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth });
    });
    ro.observe(containerRef.current);
    return () => { ro.disconnect(); chart.remove(); };
  }, []);

  useEffect(() => {
    if (!data?.length || !chartRef.current) return;
    const chart = chartRef.current;
    chart.getSeries().forEach(s => chart.removeSeries(s));

    if (type === "rsi") {
      const rsiSeries = chart.addLineSeries({ color: "#bc8cff", lineWidth: 1, title: "RSI" });
      rsiSeries.setData(data.filter(d => d.rsi != null).map(d => ({ time: d.date, value: d.rsi })));
      rsiSeries.createPriceLine({ price: 70, color: "#f85149", lineWidth: 1, lineStyle: 2 });
      rsiSeries.createPriceLine({ price: 30, color: "#3fb950", lineWidth: 1, lineStyle: 2 });
    } else if (type === "macd") {
      const macdSeries = chart.addLineSeries({ color: "#58a6ff", lineWidth: 1, title: "MACD" });
      const signalSeries = chart.addLineSeries({ color: "#f0b429", lineWidth: 1, title: "Signal" });
      const histSeries = chart.addHistogramSeries({ title: "Hist" });
      macdSeries.setData(data.filter(d => d.macd != null).map(d => ({ time: d.date, value: d.macd })));
      signalSeries.setData(data.filter(d => d.macd_signal != null).map(d => ({ time: d.date, value: d.macd_signal })));
      histSeries.setData(data.filter(d => d.macd_hist != null).map(d => ({ time: d.date, value: d.macd_hist, color: d.macd_hist >= 0 ? "#3fb95080" : "#f8514980" })));
    } else if (type === "kd") {
      const kSeries = chart.addLineSeries({ color: "#58a6ff", lineWidth: 1, title: "K" });
      const dSeries = chart.addLineSeries({ color: "#f0b429", lineWidth: 1, title: "D" });
      kSeries.setData(data.filter(d => d.stoch_k != null).map(d => ({ time: d.date, value: d.stoch_k })));
      dSeries.setData(data.filter(d => d.stoch_d != null).map(d => ({ time: d.date, value: d.stoch_d })));
    }

    chart.timeScale().fitContent();
  }, [data, type]);

  return <div ref={containerRef} className={styles.chart} />;
}
