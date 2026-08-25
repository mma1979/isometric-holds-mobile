import React from 'react';
import { StyleSheet, View, Text, LayoutChangeEvent } from 'react-native';
import Svg, { Line as SvgLine, Circle, Polyline, Text as SvgText, Rect } from 'react-native-svg';
import { LogEntry } from '../types';
import { format, parseISO } from 'date-fns';
import { theme } from '../theme';

interface ProgressChartProps {
  logs: LogEntry[];
}

export default function ProgressChart({ logs }: ProgressChartProps) {
  const [width, setWidth] = React.useState(320);

  const onLayout = (e: LayoutChangeEvent) => {
    const layoutWidth = e.nativeEvent.layout.width;
    if (layoutWidth > 0) {
      setWidth(layoutWidth);
    }
  };

  if (logs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No workout logs yet. Start training!</Text>
      </View>
    );
  }

  // Format and take the last 8 entries for clean display
  const displayLogs = logs.slice(-8);
  const height = 180;
  const paddingLeft = 36;
  const paddingRight = 24;
  const paddingTop = 24;
  const paddingBottom = 30;

  const chartWidth = Math.max(width - paddingLeft - paddingRight, 100);
  const chartHeight = height - paddingTop - paddingBottom;

  const durations = displayLogs.map((l) => l.durationReps);
  const maxDuration = Math.max(...durations, 30);
  const minDuration = 0;

  // Calculate points
  const points = displayLogs.map((log, index) => {
    const x =
      displayLogs.length === 1
        ? paddingLeft + chartWidth / 2
        : paddingLeft + (index / (displayLogs.length - 1)) * chartWidth;
    const y =
      paddingTop +
      chartHeight -
      ((log.durationReps - minDuration) / (maxDuration - minDuration || 1)) * chartHeight;
    return {
      x,
      y,
      duration: log.durationReps,
      date: format(parseISO(log.date), 'MMM d'),
    };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Grid lines
  const gridLines = [0, 0.5, 1];

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Svg width={width} height={height}>
        {/* Background Grid Lines */}
        {gridLines.map((ratio, idx) => {
          const y = paddingTop + chartHeight * (1 - ratio);
          const value = Math.round(minDuration + ratio * (maxDuration - minDuration));
          return (
            <React.Fragment key={`grid-${idx}`}>
              <SvgLine
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke={theme.colors.cardBorderHighlight}
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <SvgText
                x={paddingLeft - 8}
                y={y + 4}
                fill={theme.colors.textSubtle}
                fontSize={10}
                textAnchor="end"
              >
                {value}s
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Line Plot */}
        {points.length > 1 && (
          <Polyline
            points={polylinePoints}
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth={3}
          />
        )}

        {/* Data Points */}
        {points.map((p, idx) => (
          <React.Fragment key={`point-${idx}`}>
            <Circle
              cx={p.x}
              cy={p.y}
              r={5}
              fill={theme.colors.primary}
              stroke={theme.colors.card}
              strokeWidth={2}
            />
            {/* Value Label above point */}
            <SvgText
              x={p.x}
              y={p.y - 8}
              fill={theme.colors.text}
              fontSize={11}
              fontWeight="bold"
              textAnchor="middle"
            >
              {p.duration}s
            </SvgText>
            {/* Date Label below chart */}
            <SvgText
              x={p.x}
              y={height - 8}
              fill={theme.colors.textMuted}
              fontSize={10}
              textAnchor="middle"
            >
              {p.date}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: theme.spacing.sm,
  },
  emptyContainer: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderStyle: 'dashed',
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
});
