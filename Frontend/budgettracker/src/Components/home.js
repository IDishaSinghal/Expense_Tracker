import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Button from "./Button";  
import Input from "./Input";  
import Card from "./Card";  
import CardContent from "./CardContent";

const BudgetTrackerHome = ({ username }) => {
    const [incomeSources, setIncomeSources] = useState([{ id: 1, source: "", amount: "" }]);
    const [expenses, setExpenses] = useState([]);
    const [savingGoal, setSavingGoal] = useState("");
    const [monthlyBudget, setMonthlyBudget] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBudgetData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/get_budget/${username}/${selectedMonth}/${selectedYear}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (data.length > 0) {
                    const budget = data[0];
                    setIncomeSources(JSON.parse(budget.income_sources));
                    setExpenses(JSON.parse(budget.expenses));
                    setSavingGoal(budget.saving_goal);
                    setMonthlyBudget(budget.monthly_budget);
                    setSelectedMonth(budget.selected_month);
                    setSelectedYear(budget.selected_year);
                }
            } catch (error) {
                console.error('Error fetching budget data:', error);
            }
        };

        fetchBudgetData();
    }, [username, selectedMonth, selectedYear]);

    const addIncomeSource = () => {
        setIncomeSources([...incomeSources, { id: incomeSources.length + 1, source: "", amount: "" }]);
    };

    const updateIncomeSource = (id, field, value) => {
        setIncomeSources(incomeSources.map((inc) => (inc.id === id ? { ...inc, [field]: value } : inc)));
    };

    const addExpense = () => {
        setExpenses([...expenses, { id: expenses.length + 1, name: "", date: "", mode: "", amount: "", note: "" }]);
    };

    const updateExpense = (id, field, value) => {
        setExpenses(expenses.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)));
    };

    const handleSubmit = async () => {
        const budgetData = {
            username,  // Include the username here
            income_sources: incomeSources,
            expenses,
            saving_goal: savingGoal,
            monthly_budget: monthlyBudget,
            selected_month: selectedMonth,
            selected_year: selectedYear,
        };
        console.log("Budget Data Submitted:", budgetData);

        const response = await fetch('http://127.0.0.1:5000/submit_budget', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(budgetData),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Budget data submitted successfully');
            navigate('/dashboard'); // Navigate to the dashboard page
        } else {
            alert(data.error || 'Submission failed. Please try again.');
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <Card>
                <CardContent>
                    <h2 className="text-xl font-bold mb-4">Select Month & Year</h2>
                    <div className="flex space-x-2">
                        <select className="border p-2" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                            <option value="">Month</option>
                            {[
                                "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
                            ].map((month) => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                        <select className="border p-2" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                            <option value="">Year</option>
                            {[2023, 2024, 2025, 2026].map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardContent>
                    <h2 className="text-xl font-bold mb-4">Income Sources</h2>
                    {incomeSources.map((inc) => (
                        <div key={inc.id} className="flex space-x-2 mb-2">
                            <Input placeholder="Source" value={inc.source} onChange={(e) => updateIncomeSource(inc.id, "source", e.target.value)} />
                            <Input type="number" placeholder="Amount" value={inc.amount} onChange={(e) => updateIncomeSource(inc.id, "amount", e.target.value)} />
                        </div>
                    ))}
                    <Button onClick={addIncomeSource}>+ Add More</Button>
                </CardContent>
            </Card>
            
            <Card>
                <CardContent>
                    <h2 className="text-xl font-bold mb-4">Expenses</h2>
                    {expenses.map((exp) => (
                        <div key={exp.id} className="grid grid-cols-5 gap-2 mb-2">
                            <Input placeholder="Name" value={exp.name} onChange={(e) => updateExpense(exp.id, "name", e.target.value)} />
                            <Input type="date" value={exp.date} onChange={(e) => updateExpense(exp.id, "date", e.target.value)} />
                            <Input placeholder="Mode" value={exp.mode} onChange={(e) => updateExpense(exp.id, "mode", e.target.value)} />
                            <Input type="number" placeholder="Amount" value={exp.amount} onChange={(e) => updateExpense(exp.id, "amount", e.target.value)} />
                            <Input placeholder="Note" value={exp.note} onChange={(e) => updateExpense(exp.id, "note", e.target.value)} />
                        </div>
                    ))}
                    <Button onClick={addExpense}>+ Add Expense</Button>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <h2 className="text-xl font-bold mb-4">Goals & Budget</h2>
                    <Input type="number" placeholder="Saving Goal" value={savingGoal} onChange={(e) => setSavingGoal(e.target.value)} />
                    <Input type="number" placeholder="Monthly Budget" value={monthlyBudget} onChange={(e) => setMonthlyBudget(e.target.value)} className="mt-2" />
                </CardContent>
            </Card>
            
            <div className="text-center mt-6">
                <Button onClick={handleSubmit}>Submit Budget</Button>
            </div>
        </div>
    );
};

export default BudgetTrackerHome;
