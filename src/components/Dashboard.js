import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, remove, update } from 'firebase/database';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const { logout, adminUser } = useAuth();

  useEffect(() => {
    const usersRef = ref(database, 'users');
    
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setUsers(usersArray);
      } else {
        setUsers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const sortedUsers = [...users].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === 'timestamp') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getAnxietyLevel = (percentage) => {
    if (percentage < 50) return { 
      level: 'Normal', 
      color: '#4CAF50',
      recommendation: 'No consultation needed'
    };
    return { 
      level: 'Elevated', 
      color: '#F44336',
      recommendation: 'Consultation recommended'
    };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const handleDelete = async (userId, username) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${username}'s data?\n\nThis action cannot be undone.`
    );

    if (confirmDelete) {
      try {
        const userRef = ref(database, `users/${userId}`);
        await remove(userRef);
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete player data. Please try again.');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditForm({
      username: user.username || '',
      fullName: user.fullName || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || '',
      phoneNumber: user.phoneNumber || '',
      emailAddress: user.emailAddress || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const handleUpdateUser = async () => {
    if (!editForm.username) {
      alert('Username is required');
      return;
    }

    try {
      const userRef = ref(database, `users/${editingUser}`);
      await update(userRef, editForm);
      setEditingUser(null);
      setEditForm({});
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update player data. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading player data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-top">
          <div className="admin-info">
            <span className="admin-badge">👤 Admin: {adminUser}</span>
          </div>
          <button onClick={logout} className="logout-button">
            🚪 Logout
          </button>
        </div>
        <img src="/ps-logo.png" alt="Pyschosomatic Logo" className="logo" />
        <h1>Pyschosomatic - Player Analytics</h1>
        <p className="subtitle">Real-time anxiety assessment results</p>
      </header>

      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Players</h3>
          <p className="stat-value">{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>Average Anxiety</h3>
          <p className="stat-value">
            {users.length > 0 
              ? (users.reduce((sum, u) => sum + u.anxietyPercentage, 0) / users.length).toFixed(1)
              : 0}%
          </p>
        </div>
        <div className="stat-card needs-attention">
          <h3>Need Consultation</h3>
          <p className="stat-value">
            {users.filter(u => u.anxietyPercentage >= 50).length}
          </p>
          <p className="stat-label">Players above 50%</p>
        </div>
      </div>

      <div className="table-container">
        <h2>Player Results</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('username')} className="sortable">
                Username {sortBy === 'username' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('fullName')} className="sortable">
                Full Name {sortBy === 'fullName' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th>Contact Info</th>
              <th onClick={() => handleSort('anxietyPercentage')} className="sortable">
                Anxiety Level {sortBy === 'anxietyPercentage' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th>Recommendation</th>
              <th onClick={() => handleSort('totalTime')} className="sortable">
                Play Time {sortBy === 'totalTime' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('timestamp')} className="sortable">
                Date {sortBy === 'timestamp' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => {
              const anxietyInfo = getAnxietyLevel(user.anxietyPercentage);
              return (
                <tr key={user.id}>
                  <td className="username-cell">
                    <span className="username-badge">{user.username}</span>
                  </td>
                  <td>{user.fullName || '-'}</td>
                  <td className="contact-cell">
                    <div className="contact-info">
                      {user.emailAddress && <div>📧 {user.emailAddress}</div>}
                      {user.phoneNumber && <div>📱 {user.phoneNumber}</div>}
                      {user.gender && <div>⚥ {user.gender}</div>}
                      {user.dateOfBirth && <div>🎂 {user.dateOfBirth}</div>}
                      {!user.emailAddress && !user.phoneNumber && !user.gender && !user.dateOfBirth && '-'}
                    </div>
                  </td>
                  <td>
                    <div className="anxiety-cell">
                      <div className="anxiety-bar-container">
                        <div 
                          className="anxiety-bar" 
                          style={{
                            width: `${user.anxietyPercentage}%`,
                            backgroundColor: anxietyInfo.color
                          }}
                        ></div>
                      </div>
                      <span className="anxiety-text">
                        {user.anxietyPercentage.toFixed(1)}% 
                        <span 
                          className="anxiety-level"
                          style={{ color: anxietyInfo.color }}
                        >
                          {' '}({anxietyInfo.level})
                        </span>
                      </span>
                    </div>
                  </td>
                  <td>
                    <span 
                      className={`recommendation-badge ${user.anxietyPercentage >= 50 ? 'needs-consultation' : 'okay'}`}
                    >
                      {user.anxietyPercentage >= 50 ? '⚠️ Consultation Recommended' : '✓ No consultation needed'}
                    </span>
                  </td>
                  <td>{formatTime(user.totalTime)}</td>
                  <td className="timestamp-cell">
                    {new Date(user.timestamp).toLocaleString()}
                  </td>
                  <td className="actions-cell">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="edit-button"
                      title="Edit player data"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id, user.username)}
                      className="delete-button"
                      title="Delete player data"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="no-data">
            <p>No player data yet. Start playing the game!</p>
          </div>
        )}
      </div>

      {editingUser && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Player Information</h2>
            <div className="edit-form">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={editForm.dateOfBirth}
                  onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                  placeholder="+1234567890"
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={editForm.emailAddress}
                  onChange={(e) => setEditForm({...editForm, emailAddress: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handleCancelEdit} className="cancel-button">
                Cancel
              </button>
              <button onClick={handleUpdateUser} className="save-button">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
