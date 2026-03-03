import React, { useState } from 'react';
import './SystemConfiguration.css';
import { FaSave, FaUndo, FaCog, FaServer, FaDatabase, FaNetworkWired, FaEnvelope, FaLock } from 'react-icons/fa';

const SystemConfiguration = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  
  // Sample configuration data
  const [config, setConfig] = useState({
    general: {
      systemName: 'Transaction Monitoring System',
      environment: 'production',
      maintenanceMode: false,
      debugMode: false,
      logLevel: 'info',
      maxLogSize: 100,
      retentionPeriod: 90
    },
    services: {
      apiGateway: {
        enabled: true,
        port: 8000,
        maxConnections: 1000,
        timeout: 30
      },
      signalService: {
        enabled: true,
        port: 8001,
        maxConnections: 1000,
        timeout: 30
      },
      transactionApi: {
        enabled: true,
        port: 8002,
        maxConnections: 1000,
        timeout: 30
      },
      blockService: {
        enabled: true,
        port: 8003,
        maxConnections: 500,
        timeout: 15
      },
      ruleService: {
        enabled: true,
        port: 8004,
        maxConnections: 500,
        timeout: 30
      },
      velocityService: {
        enabled: true,
        port: 8005,
        maxConnections: 500,
        timeout: 15
      },
      mlService: {
        enabled: true,
        port: 8006,
        maxConnections: 200,
        timeout: 60
      },
      amlService: {
        enabled: true,
        port: 8007,
        maxConnections: 300,
        timeout: 45
      },
      responseService: {
        enabled: true,
        port: 8008,
        maxConnections: 500,
        timeout: 15
      }
    },
    database: {
      host: 'db.example.com',
      port: 5432,
      name: 'transaction_monitoring',
      user: 'admin',
      maxConnections: 100,
      connectionTimeout: 30,
      idleTimeout: 600
    },
    redis: {
      host: 'redis.example.com',
      port: 6379,
      maxConnections: 100,
      connectionTimeout: 10
    },
    email: {
      smtpServer: 'smtp.example.com',
      port: 587,
      username: 'notifications@example.com',
      useTLS: true,
      senderName: 'Transaction Monitoring System',
      senderEmail: 'notifications@example.com'
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      lockoutPeriod: 15,
      passwordExpiry: 90,
      minPasswordLength: 12,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true,
      requireLowercase: true
    }
  });
  
  const handleInputChange = (section, field, value) => {
    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [field]: value
      }
    });
    setHasChanges(true);
  };
  
  const handleNestedInputChange = (section, subsection, field, value) => {
    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [subsection]: {
          ...config[section][subsection],
          [field]: value
        }
      }
    });
    setHasChanges(true);
  };
  
  const handleSave = () => {
    // In a real application, this would save to the backend
    alert('Configuration saved successfully!');
    setHasChanges(false);
  };
  
  const handleReset = () => {
    // In a real application, this would reset to the last saved state
    alert('Configuration reset to last saved state.');
    setHasChanges(false);
  };
  
  return (
    <div className="system-configuration">
      <div className="page-header">
        <h1>System Configuration</h1>
        <div className="header-actions">
          {hasChanges && (
            <>
              <button className="btn btn-secondary" onClick={handleReset}>
                <FaUndo /> Reset Changes
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                <FaSave /> Save Configuration
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="config-container">
        <div className="config-sidebar">
          <div 
            className={`config-nav-item ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <FaCog className="nav-icon" />
            <span>General</span>
          </div>
          <div 
            className={`config-nav-item ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <FaServer className="nav-icon" />
            <span>Services</span>
          </div>
          <div 
            className={`config-nav-item ${activeTab === 'database' ? 'active' : ''}`}
            onClick={() => setActiveTab('database')}
          >
            <FaDatabase className="nav-icon" />
            <span>Database</span>
          </div>
          <div 
            className={`config-nav-item ${activeTab === 'redis' ? 'active' : ''}`}
            onClick={() => setActiveTab('redis')}
          >
            <FaNetworkWired className="nav-icon" />
            <span>Redis</span>
          </div>
          <div 
            className={`config-nav-item ${activeTab === 'email' ? 'active' : ''}`}
            onClick={() => setActiveTab('email')}
          >
            <FaEnvelope className="nav-icon" />
            <span>Email</span>
          </div>
          <div 
            className={`config-nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FaLock className="nav-icon" />
            <span>Security</span>
          </div>
        </div>
        
        <div className="config-content">
          {activeTab === 'general' && (
            <div className="config-section">
              <h2>General Configuration</h2>
              <div className="config-form">
                <div className="form-group">
                  <label>System Name</label>
                  <input 
                    type="text" 
                    value={config.general.systemName}
                    onChange={(e) => handleInputChange('general', 'systemName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Environment</label>
                  <select 
                    value={config.general.environment}
                    onChange={(e) => handleInputChange('general', 'environment', e.target.value)}
                  >
                    <option value="development">Development</option>
                    <option value="testing">Testing</option>
                    <option value="staging">Staging</option>
                    <option value="production">Production</option>
                  </select>
                </div>
                <div className="form-group checkbox">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={config.general.maintenanceMode}
                      onChange={(e) => handleInputChange('general', 'maintenanceMode', e.target.checked)}
                    />
                    Maintenance Mode
                  </label>
                </div>
                <div className="form-group checkbox">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={config.general.debugMode}
                      onChange={(e) => handleInputChange('general', 'debugMode', e.target.checked)}
                    />
                    Debug Mode
                  </label>
                </div>
                <div className="form-group">
                  <label>Log Level</label>
                  <select 
                    value={config.general.logLevel}
                    onChange={(e) => handleInputChange('general', 'logLevel', e.target.value)}
                  >
                    <option value="debug">Debug</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Max Log Size (MB)</label>
                  <input 
                    type="number" 
                    value={config.general.maxLogSize}
                    onChange={(e) => handleInputChange('general', 'maxLogSize', parseInt(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Data Retention Period (days)</label>
                  <input 
                    type="number" 
                    value={config.general.retentionPeriod}
                    onChange={(e) => handleInputChange('general', 'retentionPeriod', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'services' && (
            <div className="config-section">
              <h2>Services Configuration</h2>
              <div className="services-grid">
                {Object.keys(config.services).map((service) => (
                  <div key={service} className="service-card">
                    <div className="service-header">
                      <h3>{service.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
                      <div className="toggle-switch">
                        <input 
                          type="checkbox" 
                          id={`toggle-${service}`} 
                          checked={config.services[service].enabled}
                          onChange={(e) => handleNestedInputChange('services', service, 'enabled', e.target.checked)}
                        />
                        <label htmlFor={`toggle-${service}`}></label>
                      </div>
                    </div>
                    <div className="service-config">
                      <div className="form-group">
                        <label>Port</label>
                        <input 
                          type="number" 
                          value={config.services[service].port}
                          onChange={(e) => handleNestedInputChange('services', service, 'port', parseInt(e.target.value))}
                          disabled={!config.services[service].enabled}
                        />
                      </div>
                      <div className="form-group">
                        <label>Max Connections</label>
                        <input 
                          type="number" 
                          value={config.services[service].maxConnections}
                          onChange={(e) => handleNestedInputChange('services', service, 'maxConnections', parseInt(e.target.value))}
                          disabled={!config.services[service].enabled}
                        />
                      </div>
                      <div className="form-group">
                        <label>Timeout (seconds)</label>
                        <input 
                          type="number" 
                          value={config.services[service].timeout}
                          onChange={(e) => handleNestedInputChange('services', service, 'timeout', parseInt(e.target.value))}
                          disabled={!config.services[service].enabled}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'database' && (
            <div className="config-section">
              <h2>Database Configuration</h2>
              <div className="config-form">
                <div className="form-group">
                  <label>Host</label>
                  <input 
                    type="text" 
                    value={config.database.host}
                    onChange={(e) => handleInputChange('database', 'host', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Port</label>
                  <input 
                    type="number" 
                    value={config.database.port}
                    onChange={(e) => handleInputChange('database', 'port', parseInt(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Database Name</label>
                  <input 
                    type="text" 
                    value={config.database.name}
                    onChange={(e) => handleInputChange('database', 'name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input 
                    type="text" 
                    value={config.database.user}
                    onChange={(e) => handleInputChange('database', 'user', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    value="••••••••••••"
                    onChange={() => {}} // In a real app, this would update the password
                  />
                </div>
                <div className="form-group">
                  <label>Max Connections</label>
                  <input 
                    type="number" 
                    value={config.database.maxConnections}
                    onChange={(e) => handleInputChange('database', 'maxConnections', parseInt(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Connection Timeout (seconds)</label>
                  <input 
                    type="number" 
                    value={config.database.connectionTimeout}
                    onChange={(e) => handleInputChange('database', 'connectionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Idle Timeout (seconds)</label>
                  <input 
                    type="number" 
                    value={config.database.idleTimeout}
                    onChange={(e) => handleInputChange('database', 'idleTimeout', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'redis' && (
            <div className="config-section">
              <h2>Redis Configuration</h2>
              <div className="config-form">
                <div className="form-group">
                  <label>Host</label>
                  <input 
                    type="text" 
                    value={config.redis.host}
                    onChange={(e) => handleInputChange('redis', 'host', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Port</label>
                  <input 
                    type="number" 
                    value={config.redis.port}
                    onChange={(e) => handleInputChange('redis', 'port', parseInt(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    value="••••••••••••"
                    onChange={() => {}} // In a real app, this would update the password
                  />
   
(Content truncated due to size limit. Use line ranges to read in chunks)