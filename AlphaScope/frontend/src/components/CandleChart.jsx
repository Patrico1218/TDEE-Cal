import { useEffect, useRef } from "react";
import { createChart, ColorType, CrosshairMode } from "lightweight-charts";
import styles from "./CandleChart.module.css";

const CHART_COLORS = {
  bg: "#1c2128",
  grid: "#30363d",
  text: "#8b949e",
  upColor: "#3fb950",
  downColor: "#f85149",
  ma5: "#f0b429",
  ma20: "#58a6ff",
  ma60: "#bc8cff",
  bbUpper: "#8b949e",
  bbLower: "#8b949e",
  volume: "#30363d",
};

export default function CandleChart({ data, indicators }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef({});

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: CHART_COLORS.bg },
        textColor: CHART_COLORS.text,
      },
      grid: {
        vertLines: { color: CHART_COLORS.grid },
        horzLines: { color: CHART_COLORS.grid },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: CHART_COLORS.grid },
      timeScale: { borderColor: CHART_COLORS.grid, timeVisible: true },
      width: containerRef.current.clientWidth,
      height: 420,
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: CHART_COLORS.upColor,
      downColor: CHART_COLORS.downColor,
      borderUpColor: CHART_COLORS.upColor,
      borderDownColor: CHART_COLORS.downColor,
      wickUpColor: CHART_COLORS.upColor,
      wickDownColor: CHART_COLORS.downColor,
    });

    const volumeSeries = chart.addHistogramSeries({
      color: CHART_COLORS.volume,
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });
    chart.priceScale("volume").applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });

    const ma5Series = chart.addLineSeries({ color: CHART_COLORS.ma5, lineWidth: 1, title: "MA5" });
    const ma20Series = chart.addLineSeries({ color: CHART_COLORS.ma20, lineWidth: 1, title: "MA20" });
    const ma60Series = chart.addLineSeries({ color: CHART_COLORS.ma60, lineWidth: 1, title: "MA60" });
    const bbUpperSeries = chart.addLineSeries({ color: CHART_COLORS.bbUpper, lineWidth: 1, lineStyle: 2, title: "BB Upper" });
    const bbLowerSeries = chart.addLineSeries({ color: CHART_COLORS.bbLower, lineWidth: 1, lineStyle: 2, title: "BB Lower" });

    seriesRef.current = { candleSeries, volumeSeries, ma5Series, ma20Series, ma60Series, bbUpperSeries, bbLowerSeries };
    chartRef.current = chart;

    const ro = new ResizeObserver(() => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth });
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!data?.length || !seriesRef.current.candleSeries) return;
    const { candleSeries, volumeSeries, ma5Series, ma20Series, ma60Series, bbUpperSeries, bbLowerSeries } = seriesRef.current;

    const toPoint = (d, key) => d[key] != null ? { time: d.date, value: d[key] } : null;

    candleSeries.setData(data.map(d => ({ time: d.date, open: d.open, high: d.high, low: d.low, close: d.close })));
    volumeSeries.setData(data.map(d => ({ time: d.date, value: d.volume, color: d.close >= d.open ? "#3fb95040" : "#f8514940" })));
    ma5Series.setData(data.filter(d => d.ma5 != null).map(d => toPoint(d, "ma5")));
    ma20Series.setData(data.filter(d => d.ma20 != null).map(d => toPoint(d, "ma20")));
    ma60Series.setData(data.filter(d => d.ma60 != null).map(d => toPoint(d, "ma60")));

    if (indicators?.bollinger) {
      bbUpperSeries.setData(data.filter(d => d.bb_upper != null).map(d => toPoint(d, "bb_upper")));
      bbLowerSeries.setData(data.filter(d => d.bb_lower != null).map(d => toPoint(d, "bb_lower")));
    } else {
      bbUpperSeries.setData([]);
      bbLowerSeries.setData([]);
    }

    chartRef.current?.timeScale().fitContent();
  }, [data, indicators]);

  return <div ref={containerRef} className={styles.chart} />;
}
