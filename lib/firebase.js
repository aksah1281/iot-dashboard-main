// Firebase configuration and initialization
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, set, onValue, off } from 'firebase/database';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC8s_ym-9Tx3Yf6aXzI-aAYVKxp2cFKCrI",
    authDomain: "smartkiosk-f80b5.firebaseapp.com",
    databaseURL: "https://smartkiosk-f80b5-default-rtdb.firebaseio.com",
    projectId: "smartkiosk-f80b5",
    storageBucket: "smartkiosk-f80b5.firebasestorage.app",
    messagingSenderId: "309798500088",
    appId: "1:309798500088:web:7366d6a6be97761e782d0d"
};

// Initialize Firebase (check if already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const database = getDatabase(app);

// LED Control functions
export const ledController = {
  // Set LED state in Firebase
  setLedState: async (state) => {
    try {
      await set(ref(database, 'controls/led'), state);
      return true;
    } catch (error) {
      console.error('Error setting LED state:', error);
      return false;
    }
  },

  // Listen for LED state changes
  onLedStateChange: (callback) => {
    const ledRef = ref(database, 'controls/led');
    onValue(ledRef, (snapshot) => {
      const state = snapshot.val();
      if (state !== null) {
        callback({
          state: state,
          timestamp: Date.now()
        });
      }
    });
    return ledRef;
  },

  // Remove LED state listener
  offLedStateChange: (ledRef) => {
    off(ledRef);
  }
};

// Speaker Control functions
export const speakerController = {
  // Set Speaker state in Firebase
  setSpeakerState: async (state) => {
    try {
      await set(ref(database, 'controls/speaker'), state);
      return true;
    } catch (error) {
      console.error('Error setting Speaker state:', error);
      return false;
    }
  },

  // Listen for Speaker state changes
  onSpeakerStateChange: (callback) => {
    const speakerRef = ref(database, 'controls/speaker');
    onValue(speakerRef, (snapshot) => {
      const state = snapshot.val();
      if (state !== null) {
        callback({
          state: state,
          timestamp: Date.now()
        });
      }
    });
    return speakerRef;
  },

  // Remove Speaker state listener
  offSpeakerStateChange: (speakerRef) => {
    off(speakerRef);
  }
};

export { database }; 
