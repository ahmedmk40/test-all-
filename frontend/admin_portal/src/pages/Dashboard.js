import React from 'react';
import './Dashboard.css';
import { FaExclamationTriangle, FaCheckCircle, FaChartLine, FaUsers, FaClipboardList, FaServer } from 'react-icons/fa';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // Sample data for charts
  const transactionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Approved Transactions',
        data: [12000, 19000, 15000, 17000, 22000, 24000],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Declined Transactions',
        data: [1200, 1900, 1500, 1700, 2200, 2400],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const fraudData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Fraud Attempts',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const ruleTriggersData = {
    labels: ['High Value', 'Velocity', 'Location', 'Pattern', 'ML Score', 'Other'],
    datasets: [
      {
        label: 'Rule Triggers',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <div className="card-icon">
            <FaCheckCircle />
          </div>
          <div className="card-content">
            <h3>Total Transactions</h3>
            <p className="card-value">24,532</p>
            <p className="card-change positive">+12.5% from last month</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-icon warning">
            <FaExclamationTriangle />
          </div>
          <div className="card-content">
            <h3>Fraud Attempts</h3>
            <p className="card-value">342</p>
            <p className="card-change negative">+5.2% from last month</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-icon">
            <FaUsers />
          </div>
          <div className="card-content">
            <h3>Active Users</h3>
            <p className="card-value">1,245</p>
            <p className="card-change positive">+3.7% from last month</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-icon">
            <FaServer />
          </div>
          <div className="card-content">
            <h3>System Health</h3>
            <p className="card-value">98.5%</p>
            <p className="card-change positive">+0.5% from last month</p>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="dashboard-charts">
        <div className="chart-container">
          <h2>Transaction Volume</h2>
          <Line 
            data={transactionData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Transaction Volume (Last 6 Months)'
                }
              }
            }} 
          />
        </div>
        
        <div className="chart-container">
          <h2>Fraud Attempts</h2>
          <Bar 
            data={fraudData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Fraud Attempts (Last 6 Months)'
                }
              }
            }} 
          />
        </div>
      </div>
      
      <div className="dashboard-bottom">
        <div className="chart-container pie-chart">
          <h2>Rule Triggers</h2>
          <Pie 
            data={ruleTriggersData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'right',
                },
                title: {
                  display: true,
                  text: 'Rule Triggers by Type'
                }
              }
            }} 
          />
        </div>
        
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">
                <FaClipboardList />
              </div>
              <div className="activity-content">
                <p className="activity-title">Rule "High Value Transaction" updated</p>
                <p className="activity-time">2 hours ago</p>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon">
                <FaUsers />
              </div>
              <div className="activity-content">
                <p className="activity-title">New user "John Doe" added</p>
                <p className="activity-time">3 hours ago</p>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon warning">
                <FaExclamationTriangle />
              </div>
              <div className="activity-content">
                <p className="activity-title">Unusual activity detected in ML Service</p>
                <p className="activity-time">5 hours ago</p>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon">
                <FaChartLine />
              </div>
              <div className="activity-content">
                <p className="activity-title">Monthly report generated</p>
                <p className="activity-time">1 day ago</p>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon">
                <FaServer />
              </div>
              <div className="activity-content">
                <p className="activity-title">System maintenance completed</p>
                <p className="activity-time">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
