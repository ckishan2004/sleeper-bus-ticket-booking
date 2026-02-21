import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, User } from "lucide-react";
import type { Bus, Seat } from "../App";

interface SeatSelectionProps {
  bus: Bus;
  onConfirm: (seats: Seat[]) => void;
  onBack: () => void;
}

// Generate seat layout for sleeper bus
const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = 10;
  const lowerSeatsPerRow = 2;
  const upperSeatsPerRow = 2;

  // Randomly book some seats
  const bookedSeats = new Set([
    "L1", "L3", "U2", "L8", "U5", "L12", "U9", "L15", "U13", "L19", "U18"
  ]);

  let seatNumber = 1;

  for (let row = 1; row <= rows; row++) {
    // Lower berths
    for (let seat = 1; seat <= lowerSeatsPerRow; seat++) {
      const seatId = `L${seatNumber}`;
      seats.push({
        id: seatId,
        number: seatId,
        type: "lower",
        status: bookedSeats.has(seatId) ? "booked" : "available",
        price: 1200,
      });
      seatNumber++;
    }
  }

  seatNumber = 1;
  for (let row = 1; row <= rows; row++) {
    // Upper berths
    for (let seat = 1; seat <= upperSeatsPerRow; seat++) {
      const seatId = `U${seatNumber}`;
      seats.push({
        id: seatId,
        number: seatId,
        type: "upper",
        status: bookedSeats.has(seatId) ? "booked" : "available",
        price: 1000,
      });
      seatNumber++;
    }
  }

  return seats;
};

export default function SeatSelection({ bus, onConfirm, onBack }: SeatSelectionProps) {
  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const lowerSeats = seats.filter(s => s.type === "lower");
  const upperSeats = seats.filter(s => s.type === "upper");

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "booked") return;

    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
      setSeats(seats.map(s => 
        s.id === seat.id ? { ...s, status: "available" as const } : s
      ));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
      setSeats(seats.map(s => 
        s.id === seat.id ? { ...s, status: "selected" as const } : s
      ));
    }
  };

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const getSeatClassName = (status: string) => {
    if (status === "booked") return "bg-gray-300 cursor-not-allowed";
    if (status === "selected") return "bg-indigo-600 text-white cursor-pointer";
    return "bg-white border-2 border-gray-300 hover:border-indigo-400 cursor-pointer";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{bus.name}</h2>
            <p className="text-gray-600">{bus.departureTime} - {bus.arrivalTime} • {bus.duration}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seat Layout */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">Select Your Seats</h3>
                
                {/* Legend */}
                <div className="flex gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-12 bg-white border-2 border-gray-300 rounded"></div>
                    <span className="text-sm">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-12 bg-indigo-600 rounded"></div>
                    <span className="text-sm">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-12 bg-gray-300 rounded"></div>
                    <span className="text-sm">Booked</span>
                  </div>
                </div>
              </div>

              {/* Bus Layout */}
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="mb-4 text-center">
                  <div className="inline-block bg-gray-800 text-white px-4 py-2 rounded-t-full">
                    Driver
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Lower Berths */}
                  <div>
                    <Badge className="mb-3">Lower Berths - ₹1200</Badge>
                    <div className="grid grid-cols-2 gap-3">
                      {lowerSeats.map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.status === "booked"}
                          className={`${getSeatClassName(seat.status)} h-16 rounded-lg flex items-center justify-center transition-all font-semibold text-sm`}
                        >
                          <User className="w-4 h-4 mr-1" />
                          {seat.number}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Upper Berths */}
                  <div>
                    <Badge className="mb-3">Upper Berths - ₹1000</Badge>
                    <div className="grid grid-cols-2 gap-3">
                      {upperSeats.map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.status === "booked"}
                          className={`${getSeatClassName(seat.status)} h-16 rounded-lg flex items-center justify-center transition-all font-semibold text-sm`}
                        >
                          <User className="w-4 h-4 mr-1" />
                          {seat.number}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Route</span>
                  <span className="font-semibold">AMD → BOM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Departure</span>
                  <span className="font-semibold">{bus.departureTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Arrival</span>
                  <span className="font-semibold">{bus.arrivalTime}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <h4 className="font-semibold mb-3">Selected Seats ({selectedSeats.length})</h4>
                {selectedSeats.length === 0 ? (
                  <p className="text-sm text-gray-500">No seats selected</p>
                ) : (
                  <div className="space-y-2">
                    {selectedSeats.map((seat) => (
                      <div key={seat.id} className="flex justify-between text-sm">
                        <span>{seat.number} ({seat.type})</span>
                        <span className="font-semibold">₹{seat.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-2xl font-bold text-indigo-600">₹{totalAmount}</span>
                </div>
              </div>

              <Button
                onClick={() => onConfirm(selectedSeats)}
                disabled={selectedSeats.length === 0}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700"
              >
                Proceed to Book
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
