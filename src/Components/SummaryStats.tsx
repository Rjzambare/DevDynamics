import React, { useState, useEffect } from 'react';
import { Data, RowsEntity, DayWiseActivityEntity, ActivityMetaEntity, AuthorWorklog } from '../types';
import '../Style/SummaryReport.css'; // Import CSS file

interface SummaryReportProps {
  data: Data;
}

const SummaryReport: React.FC<SummaryReportProps> = ({ data }) => {
  const authorWorklog: AuthorWorklog | undefined = data.AuthorWorklog;

  if (!authorWorklog || !authorWorklog.rows || authorWorklog.rows.length === 0) {
    return <div>No data available</div>;
  }

  // Extract all unique author names
  const authorNames = Array.from(new Set(authorWorklog.rows.map((row: RowsEntity) => row.name)));

  // Initialize activity counts with all counts set to 0
  const initialActivityCounts: { [activity: string]: number } = {};
  authorWorklog.activityMeta?.forEach((meta: ActivityMetaEntity) => {
    initialActivityCounts[meta.label] = 0;
  });

  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [activityCounts, setActivityCounts] = useState<{ [activity: string]: number }>(initialActivityCounts);

  // Update activity counts when the selected author changes
  useEffect(() => {
    if (!selectedAuthor) {
      setActivityCounts(initialActivityCounts);
      return;
    }

    const updatedActivityCounts: { [activity: string]: number } = { ...initialActivityCounts };

    authorWorklog.rows?.forEach((row: RowsEntity) => {
      if (row.name === selectedAuthor) {
        const dayWiseActivity: DayWiseActivityEntity[] | null | undefined = row.dayWiseActivity;

        if (dayWiseActivity) {
          dayWiseActivity.forEach((activity: DayWiseActivityEntity) => {
            if (activity.items && activity.items.children) {
              activity.items.children.forEach((child) => {
                const activityLabel = child.label;
                updatedActivityCounts[activityLabel] += parseInt(child.count, 10);
              });
            }
          });
        }
      }
    });

    setActivityCounts(updatedActivityCounts);
  }, [selectedAuthor, authorWorklog.rows, initialActivityCounts]);

  // Convert activity counts object to array for easier rendering
  const activities = Object.keys(activityCounts).map((activity) => ({
    name: activity,
    count: activityCounts[activity],
  }));

  return (
    <div className="summary-report-container">
      <h2 className="summary-report-title">Summary Statistics</h2>
      <div className="select-author-container">
        <label htmlFor="author-select" className="select-author-label">Select Author: </label>
        <select
          id="author-select"
          value={selectedAuthor}
          onChange={(e) => setSelectedAuthor(e.target.value)}
          className="select-author-dropdown"
        >
          <option value="">-- Select an Author --</option>
          {authorNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <table className="summary-table">
        <thead>
          <tr>
            <th>Activity</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index}>
              <td>{activity.name}</td>
              <td>{activity.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SummaryReport;
