from flask import Flask , request , render_template 

app = Flask(__name__)

users = {"testuser":"password123"}

@app.route("/")
def home():
    return "welcome to one stop website for managing the budget! "

@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == "POST":
        username= request.form.get("username")
        password= request.form.get("password")
        if username in users and users[username] == password:
            return redirect(url_for("home"))
        else:
            return "Invalid credentials !",401
    return render_template("login.html")

if __name__ == "__main__":
    app.run(debug=True)
