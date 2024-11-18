import React, { useState } from 'react';

// UserCard Component to display individual user
const UserCard = ({ user }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle collapse/expand state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3>{user.name}</h3>
        <button onClick={toggleExpand} style={styles.button}>
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isExpanded && (
        <div style={styles.details}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}
    </div>
  );
};

// Dashboard Component to display all user cards
const Dashboard = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
    { id: 3, name: 'Alex Johnson', email: 'alex@example.com', role: 'Viewer' },
  ];

  return (
    <div style={styles.container}>
      <h1>Dashboard</h1>
      <div style={styles.cardContainer}>
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

// Some simple inline styles for layout
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  cardContainer: {
    display: 'flex',
    gap: '20px',
  },
  card: {
    width: '250px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  details: {
    marginTop: '10px',
    background: '#f9f9f9',
    padding: '10px',
    borderRadius: '5px',
  },
  button: {
    padding: '5px 10px',
    cursor: 'pointer',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
  },
};

export default Dashboard;
