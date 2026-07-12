import React from 'react';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <header className="header">
        <h1>TransitOps Dashboard</h1>
        <div className="user-profile">Admin</div>
      </header>
      
      <div className="main-content">
        <aside className="sidebar">
          <nav>
            <ul>
              <li className="active">Overview</li>
              <li>Fleet Management</li>
              <li>Routes & Schedules</li>
              <li>Maintenance</li>
              <li>Settings</li>
            </ul>
          </nav>
        </aside>
        
        <main className="dashboard">
          <section className="metrics">
            <div className="card">
              <h3>Active Vehicles</h3>
              <p className="value">42 / 50</p>
            </div>
            <div className="card">
              <h3>On-Time Performance</h3>
              <p className="value">94%</p>
            </div>
            <div className="card">
              <h3>Incidents Today</h3>
              <p className="value">3</p>
            </div>
          </section>

          <section className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <span className="time">10:32 AM</span>
                <span className="desc">Bus 204 delayed by 10 minutes on Route 7.</span>
              </div>
              <div className="activity-item">
                <span className="time">09:15 AM</span>
                <span className="desc">Routine maintenance completed for Bus 102.</span>
              </div>
              <div className="activity-item">
                <span className="time">08:00 AM</span>
                <span className="desc">Morning shift started smoothly. All drivers reported.</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
