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
        (!time || flight.time.slice(0, 5) === time) &&
        (!price || flight.price <= parseFloat(price))
    );

    displayFlights(filtered);
    displayFlightTimesForFilter(flights);
}

function formatEstonianDate(dateStr) {
    const date = new Date(dateStr);
    const days = ['P', 'E', 'T', 'K', 'N', 'R', 'L'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('et-EE', { month: 'long' });
    return `${days[date.getDay()]} ${day}.${month}`;
}

// ========== DISPLAY FLIGHTS ==========
function displayFlights(flights) {
    const flightListDiv = document.getElementById('flight-list');
    flightListDiv.innerHTML = '';

    flights.sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.time}`);
        const dateTimeB = new Date(`${b.date}T${b.time}`);
        return dateTimeA - dateTimeB;
    });

    flights.forEach(flight => {
        const time = new Date(`1970-01-01T${flight.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const box = document.createElement('div');
        box.classList.add('flight-box');
        box.innerHTML = `
          <div>
            <h3>${flight.destination}</h3>
          </div>
          <div>
            <p>${formatEstonianDate(flight.date)}</p>
          </div>
          <div>
            <p>${time}</p>
          </div>
          <div class="flight-number">
            <p>Lend nr ${flight.flightId}</p>
          </div>
          <div class="flight-price">
            ${flight.price} EUR
          </div>
        `;

        box.addEventListener('click', () => openFlightModal(flight));
        flightListDiv.appendChild(box);
    });

    displayFlightTimesForFilter(flights);
}

function displayFlightTimesForFilter(flights) {
    const timesDatalistElement = document.getElementById('times');

    const uniqueTimes = new Set(flights.map(flight => {
        const formattedTime = new Date(`1970-01-01T${flight.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return formattedTime;
    }));

    const sortedTimes = [...uniqueTimes].sort();
    timesDatalistElement.innerHTML = '';

    sortedTimes.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        timesDatalistElement.appendChild(option);
    });
}

// ========== OPEN MODAL ==========
function openFlightModal(flight) {
    const modal = document.getElementById('seatModal');
    const details = document.getElementById('flight-details');
    currentFlight = flight;

    details.innerHTML = `
        <p><strong>Lend nr:</strong> ${flight.flightId}</p>
        <p><strong>Sihtkoht:</strong> ${flight.destination}</p>
        <p><strong>Kuupäev:</strong> ${formatEstonianDate(flight.date)}</p>
        <p><strong>Väljumisaeg:</strong> ${new Date(`1970-01-01T${flight.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>Hind:</strong> ${flight.price} EUR</p>
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

    for (let i = 1; i <= rows; i++) {

        if (i === 8) {
            const spacer = document.createElement('div');
            spacer.className = 'row-spacer';
            spacer.style.gridColumn = '1 / -1';
            seatMap.appendChild(spacer);
        }
        
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

                    if (seatData && recommendedSeatNumbers.has(seatData.seatNumber)) {
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

    if (currentFlight) {
        fetchRecommendedSeats(currentFlight.flightId, filters).then(recommendedSeats => {
            const recommendedSeatNumbers = new Set(recommendedSeats.map(s => s.seatNumber));
            console.log("Recommended seats:", recommendedSeatNumbers);
            generateSeatMap(currentFlight.seats, filters, recommendedSeatNumbers);
        });
    }
});

function fetchRecommendedSeats(flightId, filters) {
    const params = new URLSearchParams();

    if (filters.windowSeat) params.append('windowSeat', true);
    if (filters.extraLegroom) params.append('extraLegroom', true);
    if (filters.nearExit) params.append('nearExit', true);
    params.append('numberOfSeats', filters.seatCount);

    return fetch(`/api/flights/${flightId}/seats?` + params.toString())
        .then(response => response.json());
}

function selectSeat(el, seatData) {
    if (el.classList.contains('available') || el.classList.contains('recommended')) {
        if (el.classList.contains('selected')) {
            el.classList.remove('selected');
        } else {
            el.classList.add('selected');
        }
        if (el.classList.contains('selected')) {
            el.classList.remove('recommended');
        }
        updateSeatSummary();
    }
}

function updateSeatSummary() {
    const selected = [...document.querySelectorAll('.seat.selected')];
    const seatNames = selected.map(s => s.textContent);
    const totalPrice = selected.length * currentFlight.price;

    document.getElementById('seat-summary').textContent = seatNames.length
        ? `Valitud kohad: ${seatNames.join(', ')} | Kokku: ${totalPrice} EUR`
        : 'Valitud kohad: -';

    document.getElementById('confirm-seats').disabled = selected.length === 0;
}

// ========== CONFIRMATION & CLEANUP ==========
document.getElementById('confirm-seats').addEventListener('click', () => {
    const selectedSeats = [...document.querySelectorAll('.seat.selected')].map(s => s.textContent);
    document.getElementById('custom-alert').classList.add('visible');
});

document.getElementById('close-alert').addEventListener('click', () => {
    document.getElementById('custom-alert').classList.remove('visible');
    document.getElementById('seatModal').style.display = 'none';
    clearSelectedSeats();
});

document.querySelector('#seatModal .close').addEventListener('click', () => {
    document.getElementById('custom-alert').classList.remove('visible');
    document.getElementById('seatModal').style.display = 'none';
    clearSelectedSeats();
});

function clearSelectedSeats() {
    document.querySelectorAll('.seat.selected').forEach(seat => seat.classList.remove('selected'));
    document.getElementById('seat-summary').textContent = 'Valitud kohad: -';
    document.getElementById('confirm-seats').disabled = true;
}

document.getElementById('all-flights').addEventListener('click', () => {
    document.querySelector('.main').scrollIntoView({ behavior: 'smooth' });
});


