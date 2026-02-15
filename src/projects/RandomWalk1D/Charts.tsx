import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { StatPoint1D } from './Simulation';

export default function RWCharts1D({ stats }: { stats: StatPoint1D[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={stats}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis
          dataKey="step"
          label={{ value: 'Step (N)', position: 'insideBottomRight', offset: -5 }}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          label={{ value: 'MSD', angle: -90, position: 'insideLeft' }}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#333', borderColor: '#444', color: '#fff' }}
          itemStyle={{ color: '#fff' }}
        />
        <Legend verticalAlign="top" height={36} />
        <Line
          type="linear"
          dataKey="theoretical"
          stroke="#ff4d4f"
          strokeDasharray="5 5"
          dot={false}
          strokeWidth={2}
          name="Theory (MSD = N)"
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="msd"
          stroke="#8884d8"
          dot={false}
          strokeWidth={2}
          name="Simulated MSD"
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
