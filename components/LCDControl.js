import { useEffect, useState } from 'react';
import { database } from '../lib/firebase';
import { ref, onValue, off } from 'firebase/database';

const POLL_INTERVAL = 2000;

const LCDControl = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let intervalId;
    let usersRef = ref(database, 'users');

    const fetchUsers = () => {
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const userList = Object.values(data)
            .filter(u => u.name)
            .map(u => ({ name: u.name, email: u.email || '' }));
          setUsers(userList);
        } else {
          setUsers([]);
        }
      });
    };

    fetchUsers();
    intervalId = setInterval(fetchUsers, POLL_INTERVAL);

    return () => {
      clearInterval(intervalId);
      off(usersRef);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Registered Users</h3>
      {users.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400">No users registered yet.</div>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user, idx) => (
            <li key={idx} className="py-3 flex flex-col">
              <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
              {user.email && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LCDControl; 
