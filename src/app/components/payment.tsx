import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { ArrowLeft, CreditCard, Wallet, Building2 } from "lucide-react";
import type { Bus, Seat, Passenger } from "../App";

interface PaymentProps {
  seats: Seat[];
  bus: Bus;
  passengers: Passenger[];
  onComplete: (passengers: Passenger[], paymentMethod: string) => void;
  onBack: () => void;
}

export default function Payment({ seats, bus, passengers, onComplete, onBack }: PaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);

  const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);
  const gstAmount = Math.round(totalAmount * 0.05);
  const finalAmount = totalAmount + gstAmount;

  const handlePayment = () => {
    // Validate payment details
    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        alert("Please fill all card details");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!upiId) {
        alert("Please enter UPI ID");
        return;
      }
    }

    // Simulate payment processing
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onComplete(passengers, paymentMethod);
    }, 2000);
  };

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
            <h2 className="text-3xl font-bold text-gray-900">Payment</h2>
            <p className="text-gray-600">Complete your booking payment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Select Payment Method</h3>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5" />
                      <span>Credit/Debit Card</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="w-5 h-5" />
                      <span>UPI Payment</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <Label htmlFor="netbanking" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Building2 className="w-5 h-5" />
                      <span>Net Banking</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </Card>

            {/* Payment Details */}
            {paymentMethod === "card" && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Card Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      maxLength={19}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardName">Cardholder Name *</Label>
                    <Input
                      id="cardName"
                      placeholder="Name on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardExpiry">Expiry Date *</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        maxLength={5}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardCvv">CVV *</Label>
                      <Input
                        id="cardCvv"
                        type="password"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={3}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {paymentMethod === "upi" && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">UPI Details</h3>
                
                <div>
                  <Label htmlFor="upiId">UPI ID *</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Enter your UPI ID to proceed with payment
                  </p>
                </div>
              </Card>
            )}

            {paymentMethod === "netbanking" && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Net Banking</h3>
                <p className="text-gray-600 mb-4">
                  You will be redirected to your bank's website to complete the payment
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    ✓ Secure payment gateway<br/>
                    ✓ 256-bit SSL encryption<br/>
                    ✓ No card details stored
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h3 className="text-xl font-bold mb-4">Payment Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Route</p>
                  <p className="font-semibold">Ahmedabad → Mumbai</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bus</p>
                  <p className="font-semibold">{bus.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Passengers</p>
                  <p className="font-semibold">{passengers.length}</p>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="space-y-2">
                  {seats.map((seat, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>Seat {seat.number} ({seat.type})</span>
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
                <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                  <span>GST (5%)</span>
                  <span>₹{gstAmount}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    ₹{finalAmount}
                  </span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700"
              >
                {processing ? "Processing..." : `Pay ₹${finalAmount}`}
              </Button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                🔒 Secure payment with 256-bit encryption
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
