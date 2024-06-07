import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Data, RowsEntity, DayWiseActivityEntity, ActivityMetaEntity } from '../types';
import '../Style/ActivityTable.css'; // Import CSS file

interface ActivityTableProps {
  data: Data;
}

interface ChartData {
  name: string;
  [key: string]: number | string;
}

const ActivityTable: React.FC<ActivityTableProps> = ({ data }) => {
  const authorWorklog = data.AuthorWorklog;
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  if (!authorWorklog || !authorWorklog.rows || authorWorklog.rows.length === 0) {
    return <div>No data available</div>;
  }

  // Extract all unique dates for the dropdown
  const allDates = Array.from(new Set(authorWorklog.rows.flatMap((row: RowsEntity) =>
    row.dayWiseActivity?.map((activity: DayWiseActivityEntity) => activity.date) || []
  )));

  // Extract all unique names for the dropdown
  const allNames = Array.from(new Set(authorWorklog.rows.map((row: RowsEntity) => row.name)));

  // Function to filter data by selected date and name
  const filterDataBySelectedDateAndName = () => {
    if (!selectedDate || !selectedName) {
      return authorWorklog.rows.flatMap((row: RowsEntity) => {
        return row.dayWiseActivity?.map((activity: DayWiseActivityEntity) => {
          const rowData: ChartData = { name: row.name, date: activity.date };

          if (activity.items && activity.items.children) {
            activity.items.children.forEach((child) => {
              rowData[child.label] = parseInt(child.count);
            });
          }

          return rowData;
        }) || [];
      });
    }

    return authorWorklog.rows
      .filter(row => row.name === selectedName)
      .flatMap((row: RowsEntity) => {
        return row.dayWiseActivity?.filter(activity => activity.date === selectedDate)
          .map((activity: DayWiseActivityEntity) => {
            const rowData: ChartData = { name: row.name, date: activity.date };

            if (activity.items && activity.items.children) {
              activity.items.children.forEach((child) => {
                rowData[child.label] = parseInt(child.count);
              });
            }

            return rowData;
          }) || [];
      });
  };

  const chartData = filterDataBySelectedDateAndName();

  // Extract all unique activity names for the data keys
  const activityNames = Array.from(new Set(
    authorWorklog.rows.flatMap((row: RowsEntity) =>
      row.dayWiseActivity?.flatMap((activity: DayWiseActivityEntity) =>
        activity.items?.children?.map((a) => a.label) || []
      ) || []
    )
  ));

  // Generate a color for each activity
  const activityColors: { [key: string]: string } = {};
  const colors = [
    "#8884d8", "#82ca9d", "#ffc658", "#d0ed57", "#a4de6c",
    "#8dd1e1", "#83a6ed", "#ffbb28", "#ff8042", "#a28bf5"
  ];

  activityNames.forEach((activity, index) => {
    const meta = authorWorklog.activityMeta?.find((meta: ActivityMetaEntity) => meta.label === activity);
    activityColors[activity] = meta ? meta.fillColor : colors[index % colors.length];
  });

  return (
    <div className="activity-table-container">
      <div className="activity-table-header">Activity Table</div>
      <div className="select-container">
        <div>
          <label htmlFor="date-select" className="select-label">Select Date: </label>
          <select id="date-select" value={selectedDate || ''} onChange={(e) => setSelectedDate(e.target.value || null)} className="select-dropdown">
            <option value="">-- Select date --</option>
            {allDates.map(date => (
              <option key={date} value={date}>
                {new Date(date).toISOString().split('T')[0]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="name-select" className="select-label">Select Name: </label>
          <select id="name-select" value={selectedName || ''} onChange={(e) => setSelectedName(e.target.value || null)} className="select-dropdown">
          <option value="">-- Select an Author --</option>
            {allNames.map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h3 className="activity-graph-title">Activity Bar Graph</h3>
      
      <div className="activity-graph-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {activityNames.map((activityName) => (
              <Bar key={activityName} dataKey={activityName} fill={activityColors[activityName]} className="activity-bar" />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityTable;
