import random
import json
import time
import requests
from datetime import datetime, timezone

# ─── Configuration ────────────────────────────────────────────
INTERSECTION_ID = "INT_001"
LANES = ["north", "south", "east", "west"]
SIMULATION_INTERVAL = 2  # seconds between each snapshot
BACKEND_URL = "http://localhost:5000/api/traffic"  # 👈 your backend endpoint

# ─── Time Multiplier ──────────────────────────────────────────
def get_traffic_multiplier():
    hour = datetime.now().hour

    if 8 <= hour <= 10:
        return 2.5
    elif 17 <= hour <= 19:
        return 3.0
    elif 23 <= hour or hour <= 5:
        return 0.3
    else:
        return 1.0

# ─── Lane Data Generator ──────────────────────────────────────
def generate_lane_data(multiplier):
    lanes = {}
    green_lane = random.choice(LANES)

    for lane in LANES:
        base_count = random.randint(1, 20)
        vehicle_count = int(base_count * multiplier)

        lanes[lane] = {
            "vehicle_count": vehicle_count,
            "signal_state": "green" if lane == green_lane else "red",
            "emergency": random.random() < 0.05
        }

    return lanes

# ─── Snapshot Builder ─────────────────────────────────────────
def generate_snapshot():
    multiplier = get_traffic_multiplier()

    snapshot = {
        "intersection_id": INTERSECTION_ID,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "lanes": generate_lane_data(multiplier)
    }

    return snapshot

# ─── Send Snapshot to Backend ─────────────────────────────────
def send_snapshot(snapshot):
    try:
        response = requests.post(
            BACKEND_URL,
            json=snapshot,                    # automatically sets Content-Type: application/json
            timeout=5                         # don't wait more than 5 seconds for a response
        )

        if response.status_code == 201:
            print(f"✅ Snapshot sent successfully | {snapshot['timestamp']}")
        else:
            print(f"⚠️  Unexpected response: {response.status_code} | {response.text}")

    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend. Is it running on port 5000?")

    except requests.exceptions.Timeout:
        print("❌ Request timed out. Backend might be slow or down.")

    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

# ─── Main Loop ────────────────────────────────────────────────
if __name__ == "__main__":
    print("🚦 Traffic Simulator Started...")
    print(f"📡 Sending data to: {BACKEND_URL}\n")

    while True:
        snapshot = generate_snapshot()
        print(json.dumps(snapshot, indent=2))
        send_snapshot(snapshot)
        print("-" * 50)
        time.sleep(SIMULATION_INTERVAL)