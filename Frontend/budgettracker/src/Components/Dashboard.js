import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';

const Dashboard = ({ username }) => {
    const [budgetData, setBudgetData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBudgetData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/get_budget/${username}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBudgetData(data.length > 0 ? data[data.length - 1] : null); // Use the most recent data
            } catch (error) {
                console.error('Error fetching budget data:', error);
                setError('Error fetching budget data');
            }
        };

        fetchBudgetData();
    }, [username]);

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!budgetData) {
        return <p>Loading budget data...</p>;
    }

    const incomeSources = JSON.parse(budgetData.income_sources || "[]");
    const expenses = JSON.parse(budgetData.expenses || "[]");

    const totalIncome = incomeSources.reduce((sum, inc) => sum + parseFloat(inc.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    const remainingBalance = totalIncome - totalExpenses;
    const savingGoal = parseFloat(budgetData.saving_goal || 0);
    const isSavingGoalMet = remainingBalance >= savingGoal;

    const pieData = {
        labels: ['Total Income', 'Total Expenses', 'Remaining Balance'],
        datasets: [
            {
                data: [totalIncome, totalExpenses, remainingBalance],
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            },
        ],
    };

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <div className="summary">
                <h2>Summary</h2>
                <p><strong>Total Income:</strong> ${totalIncome.toFixed(2)}</p>
                <p><strong>Total Expenses:</strong> ${totalExpenses.toFixed(2)}</p>
                <p><strong>Monthly Budget:</strong> ${budgetData.monthly_budget}</p>
                <p><strong>Saving Goal:</strong> ${savingGoal}</p>
                <p><strong>Remaining Balance:</strong> ${remainingBalance.toFixed(2)}</p>
                <p>
                    <strong>Status:</strong> {isSavingGoalMet ? (
                        <span style={{ color: 'green' }}>On track to meet saving goal!</span>
                    ) : (
                        <span style={{ color: 'red' }}>Not meeting saving goal.</span>
                    )}
                </p>
            </div>
            <div className="chart">
                <h2>Income vs Expenses</h2>
                <Pie data={pieData} />
            </div>
        </div>
    );
};

export default Dashboard;