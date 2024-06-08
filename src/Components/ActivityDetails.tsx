import React, { useState, useEffect } from 'react';
import { Data, DayWiseActivityEntity } from '../types';
import '../Style/ActivityDetails.css'; // Import CSS file

interface ActivityDetailsProps {
  data: Data;
}

const ActivityDetails: React.FC<ActivityDetailsProps> = ({ data }) => {
  const authorWorklog = data.AuthorWorklog;
  const [selectedName, setSelectedName] = useState<string>(''); // Initialize with an empty string
  const [activityDetails, setActivityDetails] = useState<DayWiseActivityEntity[]>([]);

  useEffect(() => {
    if (!authorWorklog || !authorWorklog.rows || authorWorklog.rows.length === 0) {
      return;
    }

    if (selectedName) {
      const filteredData = filterDataByName(selectedName);
      setActivityDetails(filteredData);
    } else {
      setActivityDetails(generateInitialTableData());
    }
  }, [selectedName, authorWorklog]);

  if (!authorWorklog || !authorWorklog.rows || authorWorklog.rows.length === 0) {
    return <div className="activity-details-container">No data available</div>;
  }

  // Extract all unique names for the dropdown
  const allNames = Array.from(new Set(authorWorklog.rows.map((row) => row.name)));

  // Function to generate initial table data with 0 values
  const generateInitialTableData = (): DayWiseActivityEntity[] => {
    const allDates = Array.from(new Set(authorWorklog.rows?.flatMap((row) =>
      row.dayWiseActivity?.map((activity) => activity.date) || []
    )));

    return allDates.map(date => ({
      date,
      items: {
        children: [
          { label: 'PR Open', count: '0', fillColor: '' },
          { label: 'PR Merged', count: '0', fillColor: '' },
          { label: 'Commits', count: '0', fillColor: '' },
          { label: 'PR Reviewed', count: '0', fillColor: '' },
          { label: 'PR Comments', count: '0', fillColor: '' },
          { label: 'Incident Alerts', count: '0', fillColor: '' },
          { label: 'Incidents Resolved', count: '0', fillColor: '' }
        ]
      }
    }));
  };

  // Function to filter data by selected name
  const filterDataByName = (name: string): DayWiseActivityEntity[] => {
    const filteredData: DayWiseActivityEntity[] = [];

    authorWorklog.rows?.forEach((row) => {
      if (row.name === name && row.dayWiseActivity) {
        row.dayWiseActivity.forEach((activity) => {
          const existingActivity = filteredData.find((a) => a.date === activity.date);
          if (!existingActivity) {
            filteredData.push(activity);
          } else {
            existingActivity.items?.children?.forEach((child, index) => {
              if (activity.items?.children && activity.items.children[index]) {
                child.count = (parseInt(child.count) + parseInt(activity.items.children[index].count)).toString();
              }
            });
          }
        });
      }
    });

    return filteredData;
  };

  return (
    <div className="activity-details-container">
      <h3 className="activity-details-title">Activity Details</h3>
      <div className="select-container">
        <label htmlFor="name-select" className="select-label">Select Name: </label>
        <select id="name-select" value={selectedName} onChange={(e) => setSelectedName(e.target.value)} className="select-dropdown">
          <option value="">-- Select an Author --</option>
          {allNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <table className="activity-details-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>PR Open</th>
              <th>PR Merged</th>
              <th>Commits</th>
              <th>PR Reviewed</th>
              <th>PR Comments</th>
              <th>Incident Alerts</th>
              <th>Incidents Resolved</th>
            </tr>
          </thead>
          <tbody>
            {activityDetails.map((activity, index) => (
              <tr key={index}>
                <td>{activity.date}</td>
                <td>{activity.items?.children?.find((child) => child.label === 'PR Open')?.count || '0'}</td>
                <td>{activity.items?.children?.find((child) => child.label === 'PR Merged')?.count || '0'}</td>
                <td>{activity.items?.children?.find((child) => child.label === 'Commits')?.count || '0'}</td>
                <td>{activity.items?.children?.find((child) => child.label === 'PR Reviewed')?.count || '0'}</td>
                <td>{activity.items?.children?.find((child) => child.label === 'PR Comments')?.count || '0'}</td>
                <td>{activity.items?.children?.find((child) => child.label === 'Incident Alerts')?.count || '0'}</td>
                <td>{activity.items?.children?.find((child) => child.label === 'Incidents Resolved')?.count || '0'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityDetails;
