from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_mysqldb import MySQL # type: ignore

app = Flask(__name__)
bcrypt = Bcrypt(app)

#database configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'abcd12@'
app.config['MYSQL_DB'] = 'budgetTracker'

mysql = MySQL(app)

#registration endpoint 
def register():
    data = request.get_json()
    username = data['username']
    
    password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO users(username , password_hash) VALUES(%s, %s, %s)",(username ,password))
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "user registered successfully"}), 201 

#Login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user= data['username']
    password = data['password']

    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE username = %s",[user])
    user = cur.fetchone()

    if user and bcrypt.check_password_hash(user[3] , password):
        return jsonify({"message": "Login successful!", "userId": user[0]})
    else:
        return jsonify({"message": "Invalid email or password"}), 401

if __name__ == '__main__':
    app.run(debug= True)


