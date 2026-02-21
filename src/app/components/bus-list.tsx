import { Bus } from "../App";

type Props = {
  buses: Bus[];
  onSelect: (bus: Bus) => void;
  onBack: () => void;
};

export default function BusList({ buses, onSelect, onBack }: Props) {
  return (
    <div style={{ padding: 16, maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={onBack} style={{ padding: 10, cursor: "pointer" }}>
          Back
        </button>
        <h2 style={{ margin: 0 }}>Available Buses</h2>
      </div>

      {!buses?.length ? (
        <p style={{ marginTop: 16 }}>No buses found.</p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {buses.map((bus) => (
            <div
              key={bus.id}
              style={{
                border: "1px solid #ccc",
                padding: 12,
                borderRadius: 8,
                display: "grid",
                gap: 6,
              }}
            >
              <h3 style={{ margin: 0 }}>{bus.name}</h3>
              <div>
                <b>Operator:</b> {bus.operator}
              </div>
              <div>
                <b>Time:</b> {bus.departureTime} → {bus.arrivalTime} ({bus.duration})
              </div>
              <div>
                <b>Price:</b> ₹ {bus.price}
              </div>
              <div>
                <b>Available seats:</b> {bus.availableSeats}
              </div>

              <button
                onClick={() => onSelect(bus)}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  cursor: "pointer",
                  width: "fit-content",
                }}
              >
                Select
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}