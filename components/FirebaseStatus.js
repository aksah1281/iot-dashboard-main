import { useState, useEffect } from 'react';
import { ledController, database } from '../lib/firebase';
import { ref, get, onValue, off } from 'firebase/database';

const FirebaseStatus = () => {
  const [status, setStatus] = useState({
    connected: false,
    error: null,
    lastTest: null,
    currentLedState: null,
    connectionCount: 0
  });
  const [testing, setTesting] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-9), { message, type, timestamp }]);
  };

  useEffect(() => {
    // Monitor Firebase connection
    const connectedRef = ref(database, '.info/connected');
    const unsubscribe = onValue(connectedRef, (snapshot) => {
      const connected = snapshot.val();
      setStatus(prev => ({ ...prev, connected }));
      addLog(`Firebase connection: ${connected ? 'Connected' : 'Disconnected'}`, connected ? 'success' : 'error');
    });

    // Monitor LED state changes
    const ledRef = ledController.onLedStateChange((data) => {
      setStatus(prev => ({ ...prev, currentLedState: data.state }));
      addLog(`LED state changed: ${data.state ? 'ON' : 'OFF'}`, 'info');
    });

    return () => {
      off(connectedRef);
      ledController.offLedStateChange(ledRef);
    };
  }, []);

  const testConnection = async () => {
    setTesting(true);
    addLog('Testing Firebase connection...', 'info');
    
    try {
      // Test reading from Firebase
      const ledRef = ref(database, 'controls/led');
      const snapshot = await get(ledRef);
      const ledState = snapshot.val();
      
      setStatus(prev => ({
        ...prev,
        error: null,
        lastTest: new Date(),
        currentLedState: ledState
      }));
      
      addLog(`Test successful - LED state: ${ledState !== null ? (ledState ? 'ON' : 'OFF') : 'Not set'}`, 'success');
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: error.message,
        lastTest: new Date()
      }));
      addLog(`Test failed: ${error.message}`, 'error');
    } finally {
      setTesting(false);
    }
  };

  const testLedWrite = async () => {
    setTesting(true);
    addLog('Testing LED write...', 'info');
    
    try {
      const newState = !status.currentLedState;
      const success = await ledController.setLedState(newState);
      
      if (success) {
        addLog(`LED write test successful - Set to: ${newState ? 'ON' : 'OFF'}`, 'success');
      } else {
        addLog('LED write test failed', 'error');
      }
    } catch (error) {
      addLog(`LED write test failed: ${error.message}`, 'error');
    } finally {
      setTesting(false);
    }
  };

  const getStatusColor = (connected, error) => {
    if (error) return 'text-red-600';
    if (connected) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getStatusText = (connected, error) => {
    if (error) return 'Error';
    if (connected) return 'Connected';
    return 'Connecting...';
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Firebase Status</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              status.error ? 'bg-red-500' : status.connected ? 'bg-green-500' : 'bg-yellow-500'
            }`} />
            <span className={`text-sm font-medium ${getStatusColor(status.connected, status.error)}`}>
              {getStatusText(status.connected, status.error)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Connection Status</span>
              <span className={`text-sm font-medium ${status.connected ? 'text-green-600' : 'text-red-600'}`}>
                {status.connected ? 'Online' : 'Offline'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Current LED State</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {status.currentLedState !== null ? (status.currentLedState ? 'ON' : 'OFF') : 'Unknown'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Last Test</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {status.lastTest ? status.lastTest.toLocaleTimeString() : 'Never'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Database Path</span>
              <code className="text-sm font-mono text-blue-600 dark:text-blue-400">controls/led</code>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Project ID</span>
              <code className="text-sm font-mono text-blue-600 dark:text-blue-400">smartkiosk-f80b5</code>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Database URL</span>
              <code className="text-sm font-mono text-blue-600 dark:text-blue-400 truncate">
                smartkiosk-f80b5-default-rtdb.firebaseio.com
              </code>
            </div>
          </div>
        </div>

        {status.error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300 font-medium">Error Details:</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{status.error}</p>
          </div>
        )}

        <div className="mt-4 flex space-x-3">
          <button
            onClick={testConnection}
            disabled={testing}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 text-sm"
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
          
          <button
            onClick={testLedWrite}
            disabled={testing}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 text-sm"
          >
            {testing ? 'Testing...' : 'Test LED Write'}
          </button>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Log</h3>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No activity yet...</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-mono">{log.timestamp}</span>
                <span className={`${
                  log.type === 'error' ? 'text-red-600' :
                  log.type === 'success' ? 'text-green-600' :
                  'text-gray-700 dark:text-gray-300'
                }`}>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FirebaseStatus; 