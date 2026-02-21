import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft } from "lucide-react";
import type { Bus, Seat, Passenger } from "../App";

interface PassengerDetailsProps {
  seats: Seat[];
  bus: Bus;
  onComplete: (passengers: Passenger[]) => void;
  onBack: () => void;
}

export default function PassengerDetails({ seats, bus, onComplete, onBack }: PassengerDetailsProps) {
  const [passengers, setPassengers] = useState<Passenger[]>(
    seats.map((seat) => ({
      name: "",
      age: 0,
      gender: "",
      seatNumber: seat.number,
    }))
  );

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string | number) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const handleSubmit = () => {
    // Validate
    const isValid = passengers.every(p => p.name && p.age > 0 && p.gender) && email && phone;
    if (!isValid) {
      alert("Please fill all passenger details");
      return;
    }
    onComplete(passengers);
  };

  const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Passenger Details</h2>
            <p className="text-gray-600">Enter details for {seats.length} passenger(s)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Passenger Form */}
          <div className="lg:col-span-2 space-y-4">
            {passengers.map((passenger, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-bold mb-4">
                  Passenger {index + 1} - Seat {passenger.seatNumber}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor={`name-${index}`}>Full Name *</Label>
                    <Input
                      id={`name-${index}`}
                      placeholder="Enter full name"
                      value={passenger.name}
                      onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`age-${index}`}>Age *</Label>
                    <Input
                      id={`age-${index}`}
                      type="number"
                      placeholder="Age"
                      value={passenger.age || ""}
                      onChange={(e) => handlePassengerChange(index, "age", parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`gender-${index}`}>Gender *</Label>
                    <Select
                      value={passenger.gender}
                      onValueChange={(value) => handlePassengerChange(index, "gender", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))}

            {/* Contact Details */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Contact Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-3">
                Your ticket will be sent to this email and phone number
              </p>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h3 className="text-xl font-bold mb-4">Trip Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Bus</p>
                  <p className="font-semibold">{bus.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Route</p>
                  <p className="font-semibold">Ahmedabad → Mumbai</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Departure</p>
                  <p className="font-semibold">{bus.departureTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Arrival</p>
                  <p className="font-semibold">{bus.arrivalTime}</p>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <h4 className="font-semibold mb-2">Seats</h4>
                <div className="space-y-1">
                  {seats.map((seat) => (
                    <div key={seat.id} className="flex justify-between text-sm">
                      <span>{seat.number} ({seat.type})</span>
                      <span>₹{seat.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>GST (5%)</span>
                  <span>₹{Math.round(totalAmount * 0.05)}</span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    ₹{Math.round(totalAmount * 1.05)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700"
              >
                Proceed to Payment
              </Button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                By proceeding, you agree to our Terms & Conditions
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}