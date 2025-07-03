import { useState, useEffect } from 'react';
import { ledController } from '../lib/firebase';

const LedControl = () => {
  const [ledState, setLedState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // Listen for LED state changes from Firebase
    const ledRef = ledController.onLedStateChange((data) => {
      setLedState(data.state);
      setLastUpdate(new Date(data.timestamp));
    });

    // Cleanup listener on unmount
    return () => {
      ledController.offLedStateChange(ledRef);
    };
  }, []);

  const toggleLed = async () => {
    setLoading(true);
    const newState = !ledState;
    
    try {
      const success = await ledController.setLedState(newState);
      if (success) {
        setLedState(newState);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to toggle LED:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">LED Control</h3>
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${ledState ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {ledState ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
          ledState ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50' : 'bg-gray-300 dark:bg-gray-600'
        } transition-all duration-300`}>
          <span className="text-3xl">💡</span>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={toggleLed}
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : ledState
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {loading ? 'Updating...' : ledState ? 'Turn OFF' : 'Turn ON'}
        </button>

        {lastUpdate && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>


    </div>
  );
};

export default LedControl; 