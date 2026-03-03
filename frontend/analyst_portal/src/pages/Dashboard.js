import React, { useState } from 'react';
import './Dashboard.css';
import { FaExclamationTriangle, FaCheckCircle, FaChartLine, FaExchangeAlt, FaBell, FaFolder } from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // Sample data for charts
  const transactionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Transactions',
        data: [12000, 19000, 15000, 17000, 22000, 24000],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      }
    ],
  };

  const alertsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Alerts',
        data: [320, 450, 380, 410, 490, 520],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const alertTypeData = {
    labels: ['High Value', 'Velocity', 'Location', 'Pattern', 'ML Score', 'AML'],
    datasets: [
      {
        label: 'Alert Types',
        data: [35, 25, 15, 10, 10, 5],
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

  // Sample data for assigned cases
  const [assignedCases, setAssignedCases] = useState([
    {
      id: 'CASE-001',
      type: 'High Value Transaction',
      priority: 'high',
      status: 'open',
      created: '2023-03-30 09:15:22',
      customer: 'John Smith',
      transactionId: 'TRX-45678'
    },
    {
      id: 'CASE-002',
      type: 'Unusual Location',
      priority: 'medium',
      status: 'open',
      created: '2023-03-29 14:22:45',
      customer: 'Sarah Johnson',
      transactionId: 'TRX-45679'
    },
    {
      id: 'CASE-003',
      type: 'Velocity Alert',
      priority: 'high',
      status: 'in_progress',
      created: '2023-03-28 11:05:33',
      customer: 'Michael Brown',
      transactionId: 'TRX-45680'
    },
    {
      id: 'CASE-004',
      type: 'ML Model Alert',
      priority: 'medium',
      status: 'in_progress',
      created: '2023-03-27 16:45:12',
      customer: 'Emily Davis',
      transactionId: 'TRX-45681'
    }
  ]);

  return (
    <div className="dashboard">
      <h1>Analyst Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <div className="card-icon">
            <FaExchangeAlt />
          </div>
          <div className="card-content">
            <h3>Today's Transactions</h3>
            <p className="card-value">1,245</p>
            <p className="card-change positive">+8.3% from yesterday</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-icon warning">
            <FaBell />
          </div>
          <div className="card-content">
            <h3>New Alerts</h3>
            <p className="card-value">32</p>
            <p className="card-change negative">+12.5% from yesterday</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-icon">
            <FaFolder />
          </div>
          <div className="card-content">
            <h3>Open Cases</h3>
            <p className="card-value">18</p>
            <p className="card-change neutral">No change from yesterday</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-icon success">
            <FaCheckCircle />
          </div>
          <div className="card-content">
            <h3>Resolved Today</h3>
            <p className="card-value">15</p>
            <p className="card-change positive">+25% from yesterday</p>
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
          <h2>Alert Volume</h2>
          <Bar 
            data={alertsData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Alert Volume (Last 6 Months)'
                }
              }
            }} 
          />
        </div>
      </div>
      
      <div className="dashboard-bottom">
        <div className="chart-container pie-chart">
          <h2>Alert Types</h2>
          <Doughnut 
            data={alertTypeData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'right',
                },
                title: {
                  display: true,
                  text: 'Alert Distribution by Type'
                }
              }
            }} 
          />
        </div>
        
        <div className="assigned-cases">
          <h2>Your Assigned Cases</h2>
          <div className="case-list">
            {assignedCases.map(caseItem => (
              <div key={caseItem.id} className="case-item">
                <div className={`case-priority ${caseItem.priority}`}></div>
                <div className="case-content">
                  <div className="case-header">
                    <h3>{caseItem.id}: {caseItem.type}</h3>
                    <span className={`case-status ${caseItem.status}`}>
                      {caseItem.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="case-details">
                    <p><strong>Customer:</strong> {caseItem.customer}</p>
                    <p><strong>Transaction:</strong> {caseItem.transactionId}</p>
                    <p><strong>Created:</strong> {caseItem.created}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="view-all">
            <a href="/cases">View all cases</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
