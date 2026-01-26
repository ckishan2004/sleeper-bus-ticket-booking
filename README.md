# 🚌 Sleeper Bus Ticket Booking System  
**Ahmedabad → Mumbai**

## Role
AI/ML Software Engineer Assignment

## Project Overview
This project is a **web-based Sleeper Bus Ticket Booking System** designed for the route **Ahmedabad to Mumbai**.  
The system allows users to select sleeper seats, add passenger details, optionally book meals during checkout, and confirm bookings.

A **mock AI/ML prediction feature** is also included to estimate booking confirmation probability based on seat occupancy.

---

## System Assumptions
- Only **one sleeper bus** exists in the system.
- The bus operates between **Ahmedabad and Mumbai**.
- There may be **multiple intermediate stations**.
- Payment gateway integration is **not required**.

---

## Core Features
1. Visual sleeper seat availability (Upper & Lower berth)
2. Seat booking with double-booking prevention
3. Passenger details collection
4. Optional meal booking during checkout
5. Booking summary and confirmation
6. Booking cancellation
7. Booking history
8. Mock AI/ML booking confirmation prediction

---

## UI/UX Design
- Tool Used: **Figma**
- Design approach: **Mobile-first, step-by-step guided flow**
- Screens:
  - Home / Search Journey
  - Seat Selection
  - Passenger Details
  - Meal Selection
  - Review & Confirm
  - Booking Confirmation

🔗 **Figma Prototype Link:**  
(Add your Figma public link here)

---

## Backend Technology
- **Language:** Python
- **Framework:** Flask
- **Architecture:** REST APIs
- **Data Storage:** In-memory (Dictionary & List)
- **Reason:** Assignment focuses on logic & system design, not database setup

---

## Backend API Endpoints

### Seat Management
- `GET /seats`  
  → Fetch all seat availability

- `POST /book-seat`  
  → Book a selected seat

- `POST /cancel`  
  → Cancel an existing booking

---

### Meal Booking
- `POST /meal`  
  → Add meal option (veg / non-veg / none) to a booking

---

### Additional APIs
- `GET /stations`  
  → List intermediate stations

- `GET /bookings`  
  → Booking history

---

### Mock AI/ML Prediction
- `GET /predict`  
  → Returns booking confirmation probability (percentage)

**Prediction Logic (Mock):**
- High seat occupancy → Higher confirmation probability
- Low seat occupancy → Lower probability

This mock logic simulates how a real ML model could behave using historical data.

---

## Example API Request

### Book Seat
```json
{
  "name": "Kishan",
  "seat": "L3"
}
