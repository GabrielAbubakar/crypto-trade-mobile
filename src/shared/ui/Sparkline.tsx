import type { IMarketSparklinePoint } from "@/shared/types";
import React from "react";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

export interface SparklineProps {
  data?: IMarketSparklinePoint[];
  color: string;
  width?: number;
  height?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color,
  width = 120,
  height = 35,
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data.map((d) => d.priceUsd));
  const max = Math.max(...data.map((d) => d.priceUsd));
  const range = max - min === 0 ? 1 : max - min;

  const paddingY = 4;
  const usableHeight = height - paddingY * 2;

  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - paddingY - ((val.priceUsd - min) / range) * usableHeight;
    return { x, y };
  });

  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    linePath += ` L ${points[i].x} ${points[i].y}`;
  }

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;
  const gradientId = `grad-${color.replace("#", "")}`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </LinearGradient>
      </Defs>
      <Path d={areaPath} fill={`url(#${gradientId})`} />
      <Path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
