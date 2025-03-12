import React, { useState, useEffect } from 'react';

const Dashboard = ({ username }) => {
    const [budgetData, setBudgetData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBudgetData = async () => {
            try {
                console.log(`Fetching budget data for username: ${username}`);
                const response = await fetch(`http://127.0.0.1:5000/get_budget/${username}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Fetched budget data:', data);
                setBudgetData(data);
            } catch (error) {
                console.error('Error fetching budget data:', error);
                setError('Error fetching budget data');
            }
        };

        fetchBudgetData();
    }, [username]);

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <p>Welcome to your dashboard. This is where you can view and manage your budget data.</p>
            {error ? (
                <p className="error">{error}</p>
            ) : budgetData ? (
                <div>
                    <h2>Budget Data</h2>
                    <pre>{JSON.stringify(budgetData, null, 2)}</pre>
                </div>
            ) : (
                <p>Loading budget data...</p>
            )}
        </div>
    );
};

export default Dashboard;