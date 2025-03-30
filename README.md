# Flight Booking Application ✈️

## Introduction
This is a flight booking application that allows users to search for flights, view detailed flight information, 
filter flights based on preferences (such as destination, date, time, and price), and select seats in a flight. 
It provides an intuitive interface for booking flights.

#### Technologies Used
- **Backend**: Spring Boot (Java)
- **Frontend**: HTML, CSS, JavaScript
- **Database**: In-memory mock data (no database connection)
- **Version Control**: Git, GitHub

## Steps to Run the Backend:
1. Clone the Repository: Download or clone the repository with the project files.
2. Set up the Backend API: Ensure that the backend API (providing flight data and recommended seat data) is running and accessible.
3. Run the Application:
4. Open the http://localhost:8080/index.html file in a web browser to view the application.

## Main Features
- **Flight Search and Filtering**: Allows the user to filter flights based on destination, date, time, and price.
- **Flight Details and Seat Selection**: Displays flight details and provides an interactive seat map for users to choose their seats.
- **Filters for Seat Preferences**: Users can filter available seats by preferences such as window seats, extra legroom, or proximity to an exit.
- **Booking Confirmation**: After selecting seats, users can confirm their booking, which shows a summary of selected seats and total cost.

## Key Functions Explained

Here’s a breakdown of the core functions in the application:

- `populateDatalists()`: Populates the dropdowns (destinations, times, and prices) with unique values from the flight data.

- `filterFlights()`: Filters flights based on the user’s selected criteria (destination, date, time, and price).

- `displayFlights()`: Displays all flights on the page, showing details like destination, date, time, price and flight ID (flight number).

- `openFlightModal()`: Displays the detailed information of the selected flight and shows the seat map in a modal.

- `generateSeatMap()`: Generates a seat map for the selected flight, indicating available, occupied, and recommended seats.

- `fetchRecommendedSeats()`: Requests the backend for recommended seats based on the selected filters (e.g., window seat, extra legroom).

- `selectSeat()`: Manages seat selection and updates the seat summary.

- `updateSeatSummary()`: Updates the UI with the selected seats and the total price.

## Challenges & Learnings:

## Future Improvements (Optional)
What could you add or improve in the future?

## Screenshots
<img width="1466" alt="Screenshot 2025-03-29 at 22 40 54" src="https://github.com/user-attachments/assets/4600915b-ef79-48e5-8445-f9bffecb1aa0" />

<img width="1445" alt="Screenshot 2025-03-29 at 22 50 27" src="https://github.com/user-attachments/assets/34985b52-302a-46be-b061-fbf10dc424ae" />

<img width="1460" alt="Screenshot 2025-03-29 at 23 19 07" src="https://github.com/user-attachments/assets/b7ed4ef2-ca78-403b-baa0-b6a881ec0dc2" />

<img width="1461" alt="Screenshot 2025-03-29 at 23 19 44" src="https://github.com/user-attachments/assets/28238374-eddd-4a87-a311-0b583a49b3eb" />



