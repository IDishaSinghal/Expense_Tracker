from flask import Flask, render_template, request, redirect, url_for
import os 
from utils import load_data, save_data, get_balance, get_total_income, get_total_expenses

app = Flask( __name__ )

#Route for the homepage
@app.route('/')

def index():
    data = load_data()
    balance = get_balance(data)
    total_income = get_total_income(data)
    total_expenses = get_total_expenses(data)
    return render_template('index.html', balance=balance, total_income=total_income, total_expenses=total_expenses)

@app.route('/add_income', methods=['POST'])
def add_income():
    amount = float(request.form['amount'])
    description = request.form['description']
    data = load_data()
    data['income'].append({"amount":amount, "description": description})
    save_data(data)
    return redirect(url_for('index'))

@app.route('/add_expense', methods=['POST'])
def add_expense():
    amount = float(request.form['amount'])
    description = request.form['description']
    data = load_data()
    data['expenses'].append({"amount": amount, "description": description})
    save_data(data)
    return redirect(url_for('index'))

if __name__ == ' __main__ ':
    app.run(debug=True)