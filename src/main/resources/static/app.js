let currentFlight = null;

// ========== FETCH & INITIALIZE ==========
fetch(`/api/flights`)
    .then(response => response.json())
    .then(data => {
        populateDatalists(data);

        document.getElementById('flight-filter-form').addEventListener('submit', (e) => {
            e.preventDefault();
            filterFlights(data);
            resetForm();
        });

        document.getElementById('all-flights').addEventListener('click', () => {
            displayFlights(data);
            resetForm();
        });
    })
    .catch(error => console.error('Error fetching flight data:', error));


// ========== FILTERING ==========
function resetForm() {
    document.getElementById('flight-filter-form').reset();
}

function populateDatalists(flights) {
    const destinationList = document.getElementById('destinations');
    const timeList = document.getElementById('times');
    const priceList = document.getElementById('price');

    destinationList.innerHTML = '';
    timeList.innerHTML = '';
    priceList.innerHTML = '';

    const unique = (arr) => [...new Set(arr)];

    unique(flights.map(f => f.destination)).forEach(val => {
        destinationList.innerHTML += `<option value="${val}">`;
    });

    unique(flights.map(f => f.time.slice(0, 5))).forEach(val => {
        timeList.innerHTML += `<option value="${val}">`;
    });

    unique(flights.map(f => f.price)).forEach(val => {
        priceList.innerHTML += `<option value="${val}">`;
    });
}

function filterFlights(flights) {
    const destination = document.getElementById('destination').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const price = document.getElementById('price').value;

    const filtered = flights.filter(flight =>
        (!destination || flight.destination === destination) &&
        (!date || flight.date === date) &&
        (!time || flight.time === time) &&
        (!price || flight.price <= parseFloat(price))
    );

    displayFlights(filtered);
}

// ========== DISPLAY FLIGHTS ==========
function displayFlights(flights) {
    const flightListDiv = document.getElementById('flight-list');
    flightListDiv.innerHTML = '';

    flights.forEach(flight => {
        const time = new Date(`1970-01-01T${flight.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const box = document.createElement('div');
        box.classList.add('flight-box');
        box.innerHTML = `
            <p>${formatEstonianDate(flight.date)}</p>
            <h3>${flight.destination}</h3>
            <p>Lend nr: ${flight.flightId}</p>
            <p>${time}</p>
            <p>${flight.price} EUR</p>
        `;

        box.addEventListener('click', () => openFlightModal(flight));
        flightListDiv.appendChild(box);
    });
}

function formatEstonianDate(dateStr) {
    const date = new Date(dateStr);
    const days = ['P', 'E', 'T', 'K', 'N', 'R', 'L'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('et-EE', { month: 'long' });
    return `${days[date.getDay()]} ${day}.${month}`;
}

// ========== OPEN MODAL ==========
function openFlightModal(flight) {
    const modal = document.getElementById('seatModal');
    const details = document.getElementById('flight-details');
    currentFlight = flight;

    details.innerHTML = `
        <p><strong>Flight Number:</strong> ${flight.flightId}</p>
        <p><strong>Destination:</strong> ${flight.destination}</p>
        <p><strong>Date:</strong> ${formatEstonianDate(flight.date)}</p>
        <p><strong>Time:</strong> ${new Date(`1970-01-01T${flight.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>Price:</strong> ${flight.price} EUR</p>
    `;

    generateSeatMap(flight.seats);
    modal.style.display = 'block';

    document.getElementById("applyFilters").addEventListener('click', (event) => {
        event.preventDefault(); 
        const filters = {
            windowSeat: document.getElementById('windowSeat').checked,
            extraLegroom: document.getElementById('extraLegroom').checked,
            nearExit: document.getElementById('nearExit').checked,
            seatCount: parseInt(document.getElementById('seatCount').value)
        };

        fetchRecommendedSeats(currentFlight.flightId, filters).then(recommendedSeats => {
            const recommendedSeatNumbers = new Set(recommendedSeats.map(s => s.seatNumber));
            generateSeatMap(currentFlight.seats, filters, recommendedSeatNumbers);
        });

        document.getElementById('seat-filter-form').reset();
    });
}


// ========== SEAT MAP ==========
function generateSeatMap(seats, filters = null, recommendedSeatNumbers = new Set(), rows = 18) {
    const seatMap = document.getElementById('seat-map');
    seatMap.innerHTML = '';
    seatMap.style.display = 'grid';
    seatMap.style.gridTemplateColumns = 'repeat(3, 40px) 20px repeat(3, 40px)';
    seatMap.style.gap = '10px';

    for (let i = 1; i <= rows; i++) {
       
        ['A', 'B', 'C', 'aisle', 'D', 'E', 'F'].forEach(letter => {
            const seatId = letter === 'aisle' ? null : `${letter}${i}`;
            const seatEl = document.createElement('div');

            if (letter === 'aisle') {
                seatEl.className = 'aisle';
            } else {
                seatEl.textContent = seatId;
                const seatData = seats.find(s => s.seatNumber === seatId);

                if (seatData?.occupied) {
                    seatEl.className = 'seat occupied';
                } else {
                    seatEl.className = 'seat available';

                    // Check if seat is in the recommended list
                    if (recommendedSeatNumbers.has(seatData.seatNumber)) {
                        console.log("Recommended seats:", recommendedSeatNumbers);
                        seatEl.classList.add('recommended');
                    }

                    seatEl.addEventListener('click', () => selectSeat(seatEl, seatData));
                }
            }

            seatMap.appendChild(seatEl);
        });
    }
}

// ========== SEAT FILTERING ==========
document.getElementById('applyFilters').addEventListener('click', () => {
    const filters = {
        windowSeat: document.getElementById('windowSeat').checked,
        extraLegroom: document.getElementById('extraLegroom').checked,
        nearExit: document.getElementById('nearExit').checked,
        seatCount: parseInt(document.getElementById('seatCount').value)
    };
    console.log("Filters applied:", filters); 

    if (currentFlight) {
        fetchRecommendedSeats(currentFlight.flightId, filters).then(recommendedSeats => {
            const recommendedSeatNumbers = new Set(recommendedSeats.map(s => s.seatNumber));
            console.log("Recommended seats:", recommendedSeatNumbers); // Log to check
            generateSeatMap(currentFlight.seats, filters, recommendedSeatNumbers);
        });
    }
});

function fetchRecommendedSeats(flightId, filters) {
    const params = new URLSearchParams({
        windowSeat: filters.windowSeat,
        extraLegroom: filters.extraLegroom,
        nearExit: filters.nearExit,
        numberOfSeats: filters.seatCount
    });

    return fetch(`/api/flights/${flightId}/seats?` + params.toString())
    .then(response => response.json())
    .then(data => {
        return data;
    });
}

//viimati lisatud:
function highlightRecommendedSeats(recommendedSeats) {
    const seatElements = document.querySelectorAll(".seat.available");

    seatElements.forEach(seat => {
        const seatNumber = seat.textContent.trim();
        const isRecommended = recommendedSeats.some(s => s.seatNumber === seatNumber);

        seat.classList.remove("recommended");

        if (isRecommended) {
            seat.classList.add("recommended");
        }
    });
}


function selectSeat(el, seatData) {
    if (el.classList.contains('available') || el.classList.contains('recommended')) {
        if (el.classList.contains('selected')) {
            el.classList.remove('selected');
        } else {
            el.classList.add('selected');
        }

        // Remove yellow highlighting once selected
        if (el.classList.contains('selected')) {
            el.classList.remove('recommended');
        }

        updateSeatSummary();
    }
}

function updateSeatSummary() {
    const selected = [...document.querySelectorAll('.seat.selected')];
    const seatNames = selected.map(s => s.textContent);
    const totalPrice = selected.length * 10;

    document.getElementById('seat-summary').textContent = seatNames.length
        ? `Valitud kohad: ${seatNames.join(', ')} | Kokku: ${totalPrice} EUR`
        : 'Valitud kohad: -';

    document.getElementById('confirm-seats').disabled = selected.length === 0;
}

// ========== CONFIRMATION & CLEANUP ==========
document.getElementById('confirm-seats').addEventListener('click', () => {
    const selectedSeats = [...document.querySelectorAll('.seat.selected')].map(s => s.textContent);
    document.getElementById('custom-alert').style.display = 'block';
});

document.getElementById('close-alert').addEventListener('click', () => {
    document.getElementById('custom-alert').style.display = 'none';
    document.getElementById('seatModal').style.display = 'none';
    clearSelectedSeats();
});

document.querySelector('#seatModal .close').addEventListener('click', () => {
    document.getElementById('seatModal').style.display = 'none';
    clearSelectedSeats();
});

function clearSelectedSeats() {
    document.querySelectorAll('.seat.selected').forEach(seat => seat.classList.remove('selected'));
    document.getElementById('seat-summary').textContent = 'Valitud kohad: -';
    document.getElementById('confirm-seats').disabled = true;
}
