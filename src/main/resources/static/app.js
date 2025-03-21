// Fetch flight data from API
fetch('/api/flights')
    .then(response => response.json())
    .then(data => {
        // Example flight data
        console.log("Flight data fetched:", data);

        // Populate the datalists with available options
        populateDatalists(data);

        // Add event listener for the form submission
        const form = document.getElementById('flight-filter-form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            filterFlights(data);

            // Clear the form after submit
            resetForm();
        });

        // Add event listener for showing all flights
        const allFlightsButton = document.getElementById('väljuvad lennud');
        allFlightsButton.addEventListener('click', () => {
            displayFlights(data); // Display all flights
            resetForm();           // Reset the form
        });
    })
    .catch(error => console.error('Error fetching flight data:', error));

// Function to populate the datalist options
function populateDatalists(flights) {
    const destinationDatalist = document.getElementById('destinations');
    const timesDatalist = document.getElementById('times');
    const priceDatalist = document.getElementById('price');

    // Clear current datalist options
    destinationDatalist.innerHTML = '';
    timesDatalist.innerHTML = '';
    priceDatalist.innerHTML = '';

    // Populate the destination datalist
    const destinations = [...new Set(flights.map(flight => flight.destination))];
    destinations.forEach(destination => {
        const option = document.createElement('option');
        option.value = destination;
        destinationDatalist.appendChild(option);
    });

    // Populate the time datalist
    const times = [...new Set(flights.map(flight => flight.time))];
    times.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        timesDatalist.appendChild(option);
    });

    // Populate the price datalist
    const prices = [...new Set(flights.map(flight => flight.price))];
    prices.forEach(price => {
        const option = document.createElement('option');
        option.value = price;
        priceDatalist.appendChild(option);
    });
}

// Function to filter flights based on selected options
function filterFlights(flights) {
    // Get the values from the form
    const destination = document.getElementById('destination').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const price = document.getElementById('price').value;

    // Filter flights based on selected criteria
    const filteredFlights = flights.filter(flight => {
        return (
            (destination === '' || flight.destination === destination) &&
            (date === '' || flight.date === date) &&
            (time === '' || flight.time === time) &&
            (price === '' || flight.price <= parseFloat(price))
        );
    });

    // Display the filtered flights
    displayFlights(filteredFlights);
}

// Function to display flights on the page
function displayFlights(flights) {
    const flightListDiv = document.getElementById('flight-list');

    // Clear the previous flight list
    flightListDiv.innerHTML = '';

    flights.forEach(flight => {
        const flightTime = new Date(`1970-01-01T${flight.time}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const flightBox = document.createElement('div');
        flightBox.classList.add('flight-box');

        flightBox.innerHTML = `
            <p>${flight.formattedDate}</p>
            <h3>${flight.destination}</h3>
            <p>Lend nr: ${flight.flightId}</p>
            <p>${flightTime}</p>
            <p>${flight.price}€</p>
        `;

        // Add event listener to open the modal when clicking the flight box
        flightBox.addEventListener('click', () => openFlightModal(flight));

        flightListDiv.appendChild(flightBox);
    });
}

// Function to reset the filter form after submission
function resetForm() {
    // Reset all input fields to their default values
    const form = document.getElementById('flight-filter-form');
    form.reset(); // This will reset all form fields (input, select, etc.)
}

// Function to open the modal and display flight info
function openFlightModal(flight) {
    const modal = document.getElementById('seatModal');
    const flightDetails = document.getElementById('flight-details');
    const seatMap = document.getElementById('seat-map');
    const seatCountInput = document.getElementById('seatCount');
    const windowSeatFilter = document.getElementById('windowSeat');
    const extraLegroomFilter = document.getElementById('extraLegroom');
    const nearExitFilter = document.getElementById('nearExit');
    
    // Set flight details
    flightDetails.innerHTML = `
        <p><strong>Flight Number:</strong> ${flight.flightId}</p>
        <p><strong>Destination:</strong> ${flight.destination}</p>
        <p><strong>Date:</strong> ${flight.formattedDate}</p>
        <p><strong>Time:</strong> ${new Date(`1970-01-01T${flight.time}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>Price:</strong> ${flight.price}€</p>
    `;

    // Set seat map
    seatMap.innerHTML = '';
    flight.seats.forEach(seat => {
        const seatElement = document.createElement('div');
        seatElement.classList.add('seat');
        seatElement.classList.add(seat.isOccupied ? 'occupied' : 'available');
        seatElement.textContent = seat.seatNumber;
        seatElement.dataset.seatNumber = seat.seatNumber;
        seatElement.dataset.isWindowSeat = seat.isWindowSeat;
        seatElement.dataset.isExtraLegroom = seat.isExtraLegroom;
        seatElement.dataset.isNearExit = seat.isNearExit;
        
        // Disable clicking on occupied seats
        if (seat.isOccupied) {
            seatElement.classList.add('occupied');
        } else {
            seatElement.classList.add('available');
            seatElement.addEventListener('click', () => selectSeat(seatElement, seat));
        }

        seatMap.appendChild(seatElement);
    });

    // Open the modal
    modal.style.display = 'block';

    // Apply filter when clicking the apply filters button
    document.getElementById('applyFilters').addEventListener('click', () => {
        filterSeats(flight);
    });

    // Close the modal when clicking the close button
    document.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close the modal when clicking outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Function to select a seat
function selectSeat(seatElement, seat) {
    if (seatElement.classList.contains('available')) {
        seatElement.classList.toggle('selected');
    }
}

// Function to filter seats based on the selected filters
function filterSeats(flight) {
    const windowSeatFilter = document.getElementById('windowSeat');
    const extraLegroomFilter = document.getElementById('extraLegroom');
    const nearExitFilter = document.getElementById('nearExit');
    const seatCount = document.getElementById('seatCount').value;

    const filteredSeats = flight.seats.filter(seat => {
        return (
            !seat.isOccupied &&
            (!windowSeatFilter.checked || seat.isWindowSeat === windowSeatFilter.checked) &&
            (!extraLegroomFilter.checked || seat.isExtraLegroom === extraLegroomFilter.checked) &&
            (!nearExitFilter.checked || seat.isNearExit === nearExitFilter.checked)
        );
    });

    // Update the seat map with filtered seats
    const seatMap = document.getElementById('seat-map');
    seatMap.innerHTML = '';
    filteredSeats.slice(0, seatCount).forEach(seat => {
        const seatElement = document.createElement('div');
        seatElement.classList.add('seat');
        seatElement.classList.add('available');
        seatElement.textContent = seat.seatNumber;
        seatElement.dataset.seatNumber = seat.seatNumber;
        seatElement.addEventListener('click', () => selectSeat(seatElement, seat));

        seatMap.appendChild(seatElement);
    });
}
