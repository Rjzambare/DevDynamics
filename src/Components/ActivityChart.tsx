import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Data, ActivityMetaEntity, DayWiseActivityEntity, ChildrenEntity } from '../types';
import '../Style/ActivityChart.css';

interface ActivityChartProps {
  data: Data;
}

interface ChartData {
  date: string;
  [key: string]: number | string;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  const authorWorklog = data.AuthorWorklog;

  if (!authorWorklog || !authorWorklog.rows || authorWorklog.rows.length === 0) {
    return <div>No data available</div>;
  }

  const chartData: ChartData[] = [];

  authorWorklog.rows[0]?.dayWiseActivity?.forEach((day: DayWiseActivityEntity) => {
    const formattedDate = new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayData: ChartData = { date: formattedDate };

    authorWorklog.activityMeta?.forEach((meta: ActivityMetaEntity) => {
      const activity = day.items?.children?.find((child: ChildrenEntity) => child.label === meta.label);
      dayData[meta.label] = activity ? parseInt(activity.count) : 0;
    });

    chartData.push(dayData);
  });

  const lines = authorWorklog.activityMeta?.map((meta: ActivityMetaEntity) => (
    <Line key={meta.label} type="monotone" dataKey={meta.label} stroke={meta.fillColor} strokeWidth={2} />
  ));

  return (
    <div className="activity-chart-container">
      <h3 className="activity-chart-title">Activity Chart</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {lines}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;
