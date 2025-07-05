import { BarChart } from "@mui/x-charts/BarChart";
import "./CustomBarChart.css";
import { useEffect, useRef, useState } from "react";

export default function CustomBarChart({ itemCounts, dateLabels }: any) {
  const hasData =
    Array.isArray(itemCounts) &&
    itemCounts.length > 0 &&
    itemCounts.some((v: number) => v > 0);
  const hasLabels = Array.isArray(dateLabels) && dateLabels.length > 0;
  const chartRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    value: number;
    label: string;
  } | null>(null);

  useEffect(() => {
    if (!hasData && chartRef.current) {
      const chartContainer = chartRef.current as HTMLElement;
      const textNode = chartContainer.querySelector("text");
      if (textNode && textNode.textContent === "No data to display") {
        textNode.textContent = "データなし";
      }
    }
  }, [hasData]);

  useEffect(() => {
    if (!hasData) {
      setTooltip(null);
    }
  }, [hasData]);

  useEffect(() => {
    if (!chartRef.current || !hasData) return;
    const timeout = setTimeout(() => {
      const allRects = chartRef.current!.querySelectorAll("svg rect");

      // Filter only the actual bars by checking fill color
      const bars = Array.from(allRects).filter((bar) => {
        const fill = bar.getAttribute("fill");
        return fill && fill === "#0B9DBD"; // your bar color
      });

      bars.forEach((bar, index) => {
        const value = itemCounts[index - 1];
        const label = dateLabels[index - 1];

        const mouseEnter = () => {
          const rect = bar.getBoundingClientRect();
          setTooltip({
            x: rect.left + rect.width / 2,
            y: rect.top,
            value,
            label,
          });
        };

        const mouseLeave = () => setTooltip(null);

        bar.addEventListener("mouseenter", mouseEnter);
        bar.addEventListener("mouseleave", mouseLeave);

        // Store handlers for cleanup
        (bar as any)._cleanup = () => {
          bar.removeEventListener("mouseenter", mouseEnter);
          bar.removeEventListener("mouseleave", mouseLeave);
        };
      });
    }, 0);
    return () => {
      clearTimeout(timeout);
      const bars = chartRef.current?.querySelectorAll("svg rect") || [];
      bars.forEach((bar) => {
        (bar as any)._cleanup?.();
      });
    };
  }, [hasData, itemCounts, dateLabels]);

  return (
    <div ref={chartRef} style={{ position: "relative" }}>
      {hasData ? (
        <BarChart
          height={300}
          series={[
            {
              data: hasData ? itemCounts : new Array(dateLabels.length).fill(0),
              label: "件数",
              id: "items",
              color: "#0B9DBD",
            },
          ]}
          xAxis={[
            {
              data: hasLabels ? dateLabels : [""],
              scaleType: "band",
              label: "日付",
              categoryGapRatio: 0.7,
            },
          ]}
          yAxis={[
            {
              min: 0,
              max: 10,
              tickMinStep: 5,
              width: 50,
              label: "件数",
              labelStyle: {
                transform: "rotate(0deg)",
                writingMode: "horizontal-tb",
              },
            },
          ]}
          slotProps={{
            tooltip: { hidden: true },
          }}
          sx={{
            "& .MuiChartsLegend-series:hover": {
              background: "none",
              opacity: 1,
              cursor: "default",
            },
            "& .MuiChartsLegend-root": {
              display: "none",
            },
          }}
        />
      ) : (
        <div
          style={{
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#3E3E3E", fontSize: 12 }}>データなし</span>
        </div>
      )}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            top: tooltip.y - 55,
            left: tooltip.x,
            transform: "translateX(-50%)",
            backgroundColor: "#ffffff",
            border: "1px solid #0B9DBD",
            borderRadius: "12px",
            padding: "6px 10px",
            fontSize: "12px",
            fontWeight: "400",
            color: "#3E3E3E",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <span>{tooltip.label}</span>
          <br />
          {tooltip.value} 件
        </div>
      )}
    </div>
  );
}
