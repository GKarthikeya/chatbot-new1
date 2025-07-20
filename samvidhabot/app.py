from flask import Flask, request, jsonify
from samvidha_scraper import get_attendance_summary  # Your selenium function

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
    return "✅ Samvidha Bot is live!"

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    print(f"🔐 Received login request for: {username}")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    result = get_attendance_summary(username, password)
    return jsonify({"result": result})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
