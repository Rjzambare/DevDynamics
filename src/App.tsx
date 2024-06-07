// App.tsx

import React, { useEffect, useState } from 'react';
import { fetchActivityData } from './Services/api';
import ActivityChart from './Components/ActivityChart';
import ActivityTable from './Components/ActivityTable';
import SummaryStats from './Components/SummaryStats';
import ActivityDetails from './Components/ActivityDetails';
import './App.css';
import { Data } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('chart');

  useEffect(() => {
    fetchActivityData()
      .then((activityData: Data) => {
        setData(activityData);
      })
      .catch((error: Error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });

    const handleScroll = () => {
      const sections = document.querySelectorAll('.component-container');
      let currentSection = 'chart';

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          currentSection = section.id;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSidebarItemClick = (section: string) => {
    setActiveSection(section);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="App">
      <div className="sidebar">
        <div className="sidebar-content">
          <header>
            <h1>Dashboard</h1>
          </header>
          <nav>
            <ul>
              <li><a href="#chart" className={activeSection === 'chart' ? 'active' : ''} onClick={() => handleSidebarItemClick('chart')}>Activity Chart</a></li>
              <li><a href="#table" className={activeSection === 'table' ? 'active' : ''} onClick={() => handleSidebarItemClick('table')}>Activity Table</a></li>
              <li><a href="#summary" className={activeSection === 'summary' ? 'active' : ''} onClick={() => handleSidebarItemClick('summary')}>Summary Stats</a></li>
              <li><a href="#details" className={activeSection === 'details' ? 'active' : ''} onClick={() => handleSidebarItemClick('details')}>Activity Details</a></li>
            </ul>
          </nav>
        </div>
      </div>
      <div className='component'>
        <main className="main-content">
          <header className='header'>
            <h1>Developer Activity Dashboard</h1>
          </header>
          
          <div className="dashboard">
            <section id="chart" className="component-container">
              <ActivityChart data={data} />
            </section>
            <section id="table" className="component-container">
              <ActivityTable data={data} />
            </section>
            <section id="summary" className="component-container summary-stats-container">
              <SummaryStats data={data} />
            </section>
            <section id="details" className="component-container">
              <ActivityDetails data={data} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
