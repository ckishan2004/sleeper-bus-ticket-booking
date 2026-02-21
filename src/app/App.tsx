import { useState } from "react";
import BusSearch from "./components/bus-search";
import BusList from "./components/bus-list";
import SeatSelection from "./components/seat-selection";
import PassengerDetails from "./components/passenger-details";
import Payment from "./components/payment";
import BookingConfirmation from "./components/booking-confirmation";
import { Toaster } from "./components/ui/sonner";

export interface Bus {
  id: string;
  name: string;
  operator: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  rating: number;
  totalSeats: number;
  availableSeats: number;
  amenities: string[];
  busType: string;
}

export interface Seat {
  id: string;
  number: string;
  type: "lower" | "upper";
  status: "available" | "booked" | "selected";
  price: number;
}

export interface Passenger {
  name: string;
  age: number;
  gender: string;
  seatNumber: string;
}

export interface BookingData {
  bus: Bus;
  seats: Seat[];
  passengers: Passenger[];
  totalAmount: number;
}

function App() {
  const [step, setStep] = useState<
    "search" | "list" | "seats" | "details" | "payment" | "confirmation"
  >("search");

  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  // ✅ BusSearch will send results here
  const handleSearchBus = (results: Bus[]) => {
    setBuses(results);
    setStep("list");
  };

  const handleSelectBus = (bus: Bus) => {
    setSelectedBus(bus);
    setStep("seats");
  };

  const handleSeatsConfirm = (seats: Seat[]) => {
    setSelectedSeats(seats);
    setStep("details");
  };

  const handleBackToSeats = () => {
    setStep("seats");
  };

  const handleBackToBusList = () => {
    setSelectedSeats([]);
    setStep("list");
  };

  const handleBackToSearch = () => {
    setStep("search");
  };

  const handleBackToDetails = () => {
    setStep("details");
  };

  const handlePassengerDetailsComplete = (passengersData: Passenger[]) => {
    setPassengers(passengersData);
    setStep("payment");
  };

  const handlePaymentComplete = (
    passengersData: Passenger[],
    paymentMethod: string
  ) => {
    if (!selectedBus) return;

    const booking: BookingData = {
      bus: selectedBus,
      seats: selectedSeats,
      passengers: passengersData,
      totalAmount: selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
    };

    setBookingData(booking);
    setStep("confirmation");
  };

  const handleNewBooking = () => {
    setStep("search");
    setBuses([]);
    setSelectedBus(null);
    setSelectedSeats([]);
    setPassengers([]);
    setBookingData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors />

      {step === "search" && <BusSearch onSearch={handleSearchBus} />}

      {step === "list" && (
        <BusList
          buses={buses}
          onSelect={handleSelectBus}
          onBack={handleBackToSearch}
        />
      )}

      {step === "seats" && selectedBus && (
        <SeatSelection
          bus={selectedBus}
          onConfirm={handleSeatsConfirm}
          onBack={handleBackToBusList}
        />
      )}

      {step === "details" && selectedBus && (
        <PassengerDetails
          seats={selectedSeats}
          bus={selectedBus}
          onComplete={handlePassengerDetailsComplete}
          onBack={handleBackToSeats}
        />
      )}

      {step === "payment" && selectedBus && (
        <Payment
          seats={selectedSeats}
          bus={selectedBus}
          passengers={passengers}
          onComplete={handlePaymentComplete}
          onBack={handleBackToDetails}
        />
      )}

      {step === "confirmation" && bookingData && (
        <BookingConfirmation
          bookingData={bookingData}
          onNewBooking={handleNewBooking}
        />
      )}
    </div>
  );
}

export default App;