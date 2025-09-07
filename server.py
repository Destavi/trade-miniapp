from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3, datetime, requests, random

app = Flask(__name__)
CORS(app)

DB = "data.db"
ADMIN_TOKEN = "supersecret"

# --- База ---
def init_db():
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute("""CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT,
        first_name TEXT,
        last_name TEXT,
        subscribed INTEGER DEFAULT 0,
        last_active TEXT
    )""")
    cur.execute("""CREATE TABLE IF NOT EXISTS signals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pair TEXT,
        direction TEXT,
        entryTime INTEGER,
        duration INTEGER,
        percent REAL,
        created_at TEXT
    )""")
    conn.commit()
    conn.close()

init_db()

def query_db(query,args=(),one=False):
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute(query,args)
    rv = cur.fetchall()
    conn.commit()
    conn.close()
    return (rv[0] if rv else None) if one else rv

# --- WhiteBIT API ---
def get_price(symbol):
    url = f"https://whitebit.com/api/v4/public/ticker?market={symbol}"
    r = requests.get(url)
    data = r.json()
    last_price = float(data['result']['last'])
    return last_price

def generate_signal(symbol):
    prices = [get_price(symbol), get_price(symbol)]
    delta = prices[-1] - prices[-2]
    percent = round(abs(delta)/prices[-2]*100,2)
    direction = "LONG 📈" if delta>0 else "SHORT 📉"
    entryTime = random.choice([1,3,5,10])
    duration = random.choice([1,3,5])
    now = datetime.datetime.utcnow().isoformat()
    query_db("INSERT INTO signals (pair,direction,entryTime,duration,percent,created_at) VALUES(?,?,?,?,?,?)",
             (symbol,direction,entryTime,duration,percent,now))
    return {"pair":symbol,"direction":direction,"entryTime":entryTime,"duration":duration,"percent":percent,"created_at":now}

# --- API ---
@app.route("/api/signals/latest")
def latest_signal():
    row = query_db("SELECT pair,direction,entryTime,duration,percent,created_at FROM signals ORDER BY id DESC LIMIT 1",one=True)
    if not row:
        return jsonify({"error":"no signals"})
    return jsonify(dict(zip(["pair","direction","entryTime","duration","percent","created_at"],row)))

@app.route("/api/signals/history")
def history():
    limit = int(request.args.get("limit",5))
    rows = query_db("SELECT pair,direction,entryTime,duration,percent,created_at FROM signals ORDER BY id DESC LIMIT ?",(limit,))
    return jsonify([dict(zip(["pair","direction","entryTime","duration","percent","created_at"],r)) for r in rows])

@app.route("/api/signals/generate",methods=["POST"])
def api_generate_signal():
    symbol = request.json.get("pair","BTC_USDT")
    signal = generate_signal(symbol)
    return jsonify(signal)

if __name__=="__main__":
    app.run(host="0.0.0.0", port=5000)
