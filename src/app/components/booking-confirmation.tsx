import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle2, Download, Mail, MapPin, Clock, AlertTriangle } from "lucide-react";
import type { BookingData } from "../App";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useState } from "react";

interface BookingConfirmationProps {
  bookingData: BookingData;
  onNewBooking: () => void;
}

export default function BookingConfirmation({ bookingData, onNewBooking }: BookingConfirmationProps) {
  const bookingId = `BUS${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const [isCancelled, setIsCancelled] = useState(false);

  const handleDownloadTicket = async () => {
    try {
      toast.info("Generating ticket PDF...");
      
      // Create a PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Add title
      pdf.setFontSize(24);
      pdf.text("Bus Ticket", pageWidth / 2, 20, { align: 'center' });
      
      // Add booking ID
      pdf.setFontSize(16);
      pdf.text(`Booking ID: ${bookingId}`, 20, 40);
      
      // Add journey details
      pdf.setFontSize(12);
      pdf.text(`Route: Ahmedabad to Mumbai`, 20, 55);
      pdf.text(`Bus: ${bookingData.bus.name}`, 20, 65);
      pdf.text(`Operator: ${bookingData.bus.operator}`, 20, 75);
      pdf.text(`Departure: ${bookingData.bus.departureTime}`, 20, 85);
      pdf.text(`Arrival: ${bookingData.bus.arrivalTime}`, 20, 95);
      pdf.text(`Date: ${currentDate}`, 20, 105);
      
      // Add passenger details
      pdf.setFontSize(14);
      pdf.text("Passengers:", 20, 120);
      pdf.setFontSize(12);
      bookingData.passengers.forEach((passenger, index) => {
        pdf.text(
          `${index + 1}. ${passenger.name} (${passenger.age} yrs, ${passenger.gender}) - Seat ${passenger.seatNumber}`,
          25,
          130 + (index * 10)
        );
      });
      
      // Add payment summary
      const yPos = 150 + (bookingData.passengers.length * 10);
      pdf.setFontSize(14);
      pdf.text("Payment Summary:", 20, yPos);
      pdf.setFontSize(12);
      
      bookingData.seats.forEach((seat, index) => {
        pdf.text(
          `Seat ${seat.number} (${seat.type} berth): ₹${seat.price}`,
          25,
          yPos + 10 + (index * 8)
        );
      });
      
      const totalPos = yPos + 20 + (bookingData.seats.length * 8);
      pdf.text(`GST (5%): ₹${Math.round(bookingData.totalAmount * 0.05)}`, 25, totalPos);
      pdf.setFontSize(14);
      pdf.text(
        `Total Paid: ₹${Math.round(bookingData.totalAmount * 1.05)}`,
        25,
        totalPos + 10
      );
      
      // Save the PDF
      pdf.save(`bus-ticket-${bookingId}.pdf`);
      toast.success("Ticket downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download ticket");
      console.error(error);
    }
  };

  const handleEmailTicket = () => {
    // Mock email functionality
    toast.success("Ticket sent to your email address!");
    // In real implementation, this would call a backend API to send email
  };

  const handleCancelBooking = () => {
    setIsCancelled(true);
    toast.success("Booking cancelled successfully! Refund will be processed within 5-7 business days.");
  };

  if (isCancelled) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-full mb-4">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Cancelled</h1>
          <p className="text-gray-600 mb-6">Your booking has been cancelled successfully</p>
          
          <Card className="p-6 mb-6">
            <div className="text-left space-y-3">
              <div>
                <p className="text-sm text-gray-600">Booking ID</p>
                <p className="font-semibold">{bookingId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cancellation Date</p>
                <p className="font-semibold">{currentDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Refund Amount</p>
                <p className="text-xl font-bold text-green-600">₹{Math.round(bookingData.totalAmount * 1.05 * 0.85)}</p>
                <p className="text-xs text-gray-500">(15% cancellation fee deducted)</p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600">Refund will be credited to your original payment method within 5-7 business days.</p>
              </div>
            </div>
          </Card>

          <Button
            onClick={onNewBooking}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Book Another Ticket
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your bus ticket has been successfully booked</p>
        </div>

        {/* Booking Details Card */}
        <Card className="p-8 mb-6 shadow-xl">
          <div className="border-b pb-4 mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm text-gray-600">Booking ID</p>
                <p className="text-2xl font-bold text-gray-900">{bookingId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Booking Date</p>
                <p className="font-semibold">{currentDate}</p>
              </div>
            </div>
          </div>

          {/* Journey Details */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Journey Details</h3>
            
            <div className="bg-indigo-50 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm text-gray-600">From</span>
                  </div>
                  <p className="text-xl font-bold">Ahmedabad</p>
                  <p className="text-2xl font-bold text-indigo-600">{bookingData.bus.departureTime}</p>
                </div>

                <div className="px-4">
                  <div className="w-16 border-t-2 border-gray-400 border-dashed"></div>
                  <p className="text-xs text-gray-600 text-center mt-1">{bookingData.bus.duration}</p>
                </div>

                <div className="flex-1 text-right">
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <span className="text-sm text-gray-600">To</span>
                    <MapPin className="w-4 h-4 text-indigo-600" />
                  </div>
                  <p className="text-xl font-bold">Mumbai</p>
                  <p className="text-2xl font-bold text-indigo-600">{bookingData.bus.arrivalTime}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Bus Name</p>
                <p className="font-semibold">{bookingData.bus.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Operator</p>
                <p className="font-semibold">{bookingData.bus.operator}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bus Type</p>
                <p className="font-semibold">{bookingData.bus.busType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">PNR Number</p>
                <p className="font-semibold font-mono">{bookingId.slice(-6)}</p>
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="border-t pt-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Passenger Details</h3>
            <div className="space-y-3">
              {bookingData.passengers.map((passenger, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p className="font-semibold">{passenger.name}</p>
                    <p className="text-sm text-gray-600">
                      {passenger.age} yrs • {passenger.gender}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-indigo-600">Seat {passenger.seatNumber}</p>
                    <p className="text-sm text-gray-600">
                      {bookingData.seats.find(s => s.number === passenger.seatNumber)?.type} berth
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold mb-4">Payment Summary</h3>
            <div className="space-y-2">
              {bookingData.seats.map((seat, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>Seat {seat.number} ({seat.type} berth)</span>
                  <span>₹{seat.price}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm text-gray-600">
                <span>GST (5%)</span>
                <span>₹{Math.round(bookingData.totalAmount * 0.05)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t mt-2">
                <span className="text-lg font-bold">Total Paid</span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{Math.round(bookingData.totalAmount * 1.05)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button variant="outline" className="h-12" onClick={handleDownloadTicket}>
            <Download className="w-4 h-4 mr-2" />
            Download Ticket
          </Button>
          <Button variant="outline" className="h-12" onClick={handleEmailTicket}>
            <Mail className="w-4 h-4 mr-2" />
            Email Ticket
          </Button>
        </div>

        <Button
          onClick={onNewBooking}
          className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 mb-4"
        >
          Book Another Ticket
        </Button>

        {/* Cancel Booking Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full h-12 text-red-600 border-red-300 hover:bg-red-50">
              Cancel Booking
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this booking? A cancellation fee of 15% will be deducted from the refund amount.
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm">
                    <strong>Booking ID:</strong> {bookingId}<br/>
                    <strong>Total Paid:</strong> ₹{Math.round(bookingData.totalAmount * 1.05)}<br/>
                    <strong>Refund Amount:</strong> ₹{Math.round(bookingData.totalAmount * 1.05 * 0.85)}
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Booking</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancelBooking} className="bg-red-600 hover:bg-red-700">
                Cancel Booking
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Important Info */}
        <Card className="mt-6 p-4 bg-yellow-50 border-yellow-200">
          <div className="flex gap-3">
            <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900 mb-1">Important Information</p>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Please arrive at the boarding point 15 minutes before departure</li>
                <li>• Carry a valid ID proof for verification</li>
                <li>• Cancellation charges apply as per policy</li>
                <li>• Keep your booking ID handy for boarding</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}