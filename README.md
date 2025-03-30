# **Flight Booking Application** 🛫

## Table of Contents
1. [Introduction](#introduction)
2. [Technologies Used](#technologies-used)
3. [Steps to Run the Backend](#steps-to-run-the-backend)
4. [Main Features](#main-features)
5. [Key Functions Explained](#key-functions-explained)
6. [Challenges and Learning](#challenges-and-learning)
7. [Future Improvements](#future-improvements)
8. [Screenshots](#screenshots)

   
## <a id="introduction"></a>💡 Introduction
This is a **Flight Booking Web Application** that allows users to search for flights, view detailed flight information, 
filter flights based on preferences (such as destination, date, time, and price), and select seats in a flight. 
It provides an intuitive interface for booking flights.

## <a id="technologies-used"></a> ⚙️ Technologies Used
- **Backend**: Spring Boot (Java)
- **Frontend**: HTML, CSS, JavaScript
- **Database**: In-memory mock data (no database connection)
- **Version Control**: Git, GitHub

## <a id="steps-to-run-the-backend"></a> 🚀 Steps to Run the Backend
1. Clone the Repository: Download or clone the repository with the project files.
2. Set up the Backend API: Ensure that the backend API (providing flight data and recommended seat data) is running and accessible.
3. Run the Application:
4. Open the http://localhost:8080/index.html file in a web browser to view the application.

## <a id="main-features"></a> ✨ Main Features
- **Flight Search and Filtering**: Allows the user to filter flights based on destination, date, time, and price.
- **Flight Details and Seat Selection**: Displays flight details and provides an interactive seat map for users to choose their seats.
- **Filters for Seat Preferences**: Users can filter available seats by preferences such as window seats, extra legroom, or proximity to an exit.
- **Booking Confirmation**: After selecting seats, users can confirm their booking, which shows a summary of selected seats and total cost.

## <a id="key-functions-explained"></a> 💻 Key Functions Explained
- `populateDatalists()`: Populates the dropdowns (destinations, times, and prices) with unique values from the flight data.
- `filterFlights()`: Filters flights based on the user’s selected criteria (destination, date, time, and price).
- `displayFlights()`: Displays all flights on the page, showing details like destination, date, time, price and flight ID (flight number).
- `openFlightModal()`: Displays the detailed information of the selected flight and shows the seat map in a modal.
- `generateSeatMap()`: Generates a seat map for the selected flight, indicating available, occupied, and recommended seats.
- `fetchRecommendedSeats()`: Requests the backend for recommended seats based on the selected filters (e.g., window seat, extra legroom).
- `selectSeat()`: Manages seat selection and updates the seat summary.
- `updateSeatSummary()`: Updates the UI with the selected seats and the total price.

## <a id="challenges-and-learning"></a> 🤓 Challenges & Learning
This is my first larger backend + frontend project. I independently created the DTOs, Controllers, HTML and CSS, but I developed the Services and JavaScript with the help of ChatGPT: step-by-step, I provided prompts for what I wanted to achieve, and then repeatedly modified the code snippets created by ChatGPT until I got exactly what I wanted.

1. In `flightService`:
- `public recommendSeats()`;
- `findAdjacentSeats()`;
- `private boolean areSeatsAdjacent()`
  
The challenge was figuring out how the recommendedSeats function offers the first available seats based on both randomly generated occupied seats and user-filtered seat preferences (whether one or more filters are applied).

2. In JavaScript:
- `function createSeatMap()`;
- `function selectSeats()`;
  
The challenge was displaying the seats so that the layout was 3+3 seats per row with an aisle between them. Additionally, I had trouble ensuring the seat map would correctly display whether a seat is occupied or available based on backend data and user-filtered results. It took some time, but I eventually solved it after realizing that the browser was showing an older version of my code from the cache rather than the updated one 😅

However, I couldn't resolve the issue where the adjacent seat recommendation doesn't account for the aisle. For example, if the airplane has seats 1A, 1B, 1C, aisle, 1D, 1E, 1F, the program would suggest 1C and 1D as adjacent seats, which shouldn't happen.

3. If a user requests more seats than are available, the program recommends only 1 seat instead of the requested number.

The entire project took about 7 days to complete. I learned that no matter how challenging the problem may seem at first, it's always doable with patience and determination. Every challenge is an opportunity to learn and improve.


## <a id="future-improvements"></a>🔧 Future Improvements
- **Database Integration** – Replace hardcoded flights and seats with database storage using repositories.
- **Admin Panel** – Add endpoints for managing flights and seat configurations.
- **Testing** – Implement unit tests for backend logic.
- **Responsive Design** – Add support for tablet and mobile layouts.
- **User Roles** – Introduce authentication and role-based access (e.g., admin, passenger).
- **Seat Persistence** – Save seat reservations to the database.
- **Validation & Errors** – Improve input validation and user-friendly error handling.


## <a id="screenshots"></a> Screenshots
<img width="1466" alt="Screenshot 2025-03-29 at 22 40 54" src="https://github.com/user-attachments/assets/4600915b-ef79-48e5-8445-f9bffecb1aa0" />

<img width="1445" alt="Screenshot 2025-03-29 at 22 50 27" src="https://github.com/user-attachments/assets/34985b52-302a-46be-b061-fbf10dc424ae" />

<img width="1460" alt="Screenshot 2025-03-29 at 23 19 07" src="https://github.com/user-attachments/assets/b7ed4ef2-ca78-403b-baa0-b6a881ec0dc2" />

<img width="1461" alt="Screenshot 2025-03-29 at 23 19 44" src="https://github.com/user-attachments/assets/28238374-eddd-4a87-a311-0b583a49b3eb" />



