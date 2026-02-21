import { useState } from "react";
import { Bus } from "../App";

type Props = {
  onSearch: (results: Bus[]) => void;
};

export default function BusSearch({ onSearch }: Props) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = () => {
    // ✅ Dummy data (replace with API later)
    const results: Bus[] = [
      {
        id: "1",
        name: "Volvo AC Sleeper",
        operator: "GSRTC",
        departureTime: "10:00 PM",
        arrivalTime: "06:00 AM",
        duration: "8h",
        price: 899,
        rating: 4.5,
        totalSeats: 40,
        availableSeats: 12,
        amenities: ["AC", "WiFi", "Charging"],
        busType: "Sleeper",
      },
      {
        id: "2",
        name: "AC Seater",
        operator: "Patel Travels",
        departureTime: "09:00 PM",
        arrivalTime: "05:30 AM",
        duration: "8h 30m",
        price: 699,
        rating: 4.1,
        totalSeats: 45,
        availableSeats: 18,
        amenities: ["AC", "Water Bottle"],
        busType: "Seater",
      },
    ];

    onSearch(results);
  };

  return (
    <div style={{ padding: 16, maxWidth: 520, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 12 }}>Search Buses</h2>

      <div style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          style={{ padding: 10 }}
        />
        <input
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={{ padding: 10 }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: 10 }}
        />

        <button
          onClick={handleSearch}
          style={{
            padding: 12,
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
}