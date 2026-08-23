import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { LogEntry } from '../types';
import { format, parseISO } from 'date-fns';

interface ProgressChartProps {
  logs: LogEntry[];
}

export default function ProgressChart({ logs }: ProgressChartProps) {
  if (logs.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-700 bg-gray-900/50">
        <p className="text-gray-400">No workout logs yet. Start training!</p>
      </div>
    );
  }

  // Format data for Recharts
  const data = logs.map((log) => ({
    ...log,
    formattedDate: format(parseISO(log.date), 'MMM d'),
    volume: log.sets * log.durationReps, // Optional metric: sets * duration
  }));

  return (
    <div className="h-72 w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis 
            dataKey="formattedDate" 
            stroke="#9CA3AF" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            label={{ value: 'Duration (sec)', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF', fontSize: 12 } }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
            itemStyle={{ color: '#F3F4F6' }}
            formatter={(value: number) => [`${value} sec`, 'Duration/Reps']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="durationReps"
            stroke="#EAB308"
            strokeWidth={3}
            dot={{ fill: '#EAB308', r: 4, strokeWidth: 2, stroke: '#1F2937' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
