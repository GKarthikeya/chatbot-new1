from flask import Flask, request, jsonify
from samvidha_scraper import get_attendance_summary  # Your selenium function

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
    return "✅ Samvidha Bot is live!"

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        print(f"🔐 Received login request for: {username}")

        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400

        result = get_attendance_summary(username, password)
        return jsonify({"result": result})

    except Exception as e:
        print(f"❌ Error in /login route: {e}")
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

    
if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000)
