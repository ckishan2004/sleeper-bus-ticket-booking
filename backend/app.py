from flask import Flask, request, jsonify # type: ignore

app = Flask(__name__)

# -----------------------
# DATA (Mock Database)
# -----------------------

# Sleeper seats
seats = {f"L{i}": False for i in range(1, 11)}
seats.update({f"U{i}": False for i in range(1, 11)})

# Bookings list
bookings = []

# Stations
stations = ["Ahmedabad", "Vadodara", "Surat", "Mumbai"]

# Meal options
meal_prices = {
    "veg": 150,
    "non-veg": 200,
    "none": 0
}

# -----------------------
# APIs
# -----------------------

@app.route("/seats", methods=["GET"])
def get_seats():
    return jsonify(seats)

@app.route("/book-seat", methods=["POST"])
def book_seat():
    data = request.json
    seat = data.get("seat")
    name = data.get("name")

    if seat not in seats:
        return jsonify({"error": "Invalid seat number"}), 400

    if seats[seat]:
        return jsonify({"error": "Seat already booked"}), 400

    seats[seat] = True
    booking = {
        "name": name,
        "seat": seat,
        "meal": "none",
        "price": 500
    }
    bookings.append(booking)

    return jsonify({"message": "Seat booked successfully", "booking": booking})

@app.route("/meal", methods=["POST"])
def add_meal():
    data = request.json
    seat = data.get("seat")
    meal = data.get("meal")

    for booking in bookings:
        if booking["seat"] == seat:
            booking["meal"] = meal
            booking["price"] += meal_prices.get(meal, 0)
            return jsonify({"message": "Meal added", "booking": booking})

    return jsonify({"error": "Booking not found"}), 404

@app.route("/cancel", methods=["POST"])
def cancel_booking():
    data = request.json
    seat = data.get("seat")

    for booking in bookings:
        if booking["seat"] == seat:
            bookings.remove(booking)
            seats[seat] = False
            return jsonify({"message": "Booking cancelled"})

    return jsonify({"error": "Booking not found"}), 404

@app.route("/stations", methods=["GET"])
def get_stations():
    return jsonify(stations)

@app.route("/bookings", methods=["GET"])
def booking_history():
    return jsonify(bookings)

# -----------------------
# Mock AI/ML Prediction
# -----------------------

@app.route("/predict", methods=["GET"])
def predict_confirmation():
    total_seats = len(seats)
    booked_seats = sum(seats.values())

    fill_ratio = booked_seats / total_seats

    if fill_ratio > 0.8:
        probability = 90
    elif fill_ratio > 0.5:
        probability = 70
    else:
        probability = 40

    return jsonify({
        "confirmation_probability": f"{probability}%"
    })

# -----------------------
# RUN SERVER
# -----------------------

if __name__ == "__main__":
    app.run(debug=True)
