from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_mysqldb import MySQL
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
CORS(app)  # Enable CORS
bcrypt = Bcrypt(app)

# Database configuration
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

mysql = MySQL(app)

# Root route
@app.route('/')
def home():
    return "Welcome to the Movie Recommendation Booking API!"

# Registration endpoint
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data['username']
        password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO users (username, password_hash) VALUES (%s, %s)", (username, password))
        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "user registered successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data['username']
        password = data['password']

        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM users WHERE username = %s", [username])
        user = cur.fetchone()

        if user and bcrypt.check_password_hash(user[2], password):
            return jsonify({"message": "Login successful!", "username": user[0]}), 200
        else:
            return jsonify({"message": "Invalid username or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Submit budget data endpoint
@app.route('/submit_budget', methods=['POST'])
def submit_budget():
    try:
        data = request.get_json()
        username = data['username']
        income_sources = data['income_sources']
        expenses = data['expenses']
        saving_goal = data['saving_goal']
        monthly_budget = data['monthly_budget']
        selected_month = data['selected_month']
        selected_year = data['selected_year']

        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO budget_data (username, income_sources, expenses, saving_goal, monthly_budget, selected_month, selected_year)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (username, json.dumps(income_sources), json.dumps(expenses), saving_goal, monthly_budget, selected_month, selected_year))
        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Budget data submitted successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get budget data endpoint
@app.route('/get_budget/<string:username>', methods=['GET'])
def get_budget(username):
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM budget_data WHERE username = %s", [username])
        budget_data = cur.fetchall()
        cur.close()
        return jsonify(budget_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)