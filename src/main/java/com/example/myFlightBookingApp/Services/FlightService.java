package com.example.myFlightBookingApp.Services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.myFlightBookingApp.DTOs.Flight;
import com.example.myFlightBookingApp.DTOs.Seat;

@Service
public class FlightService {
    private List<Flight> flights = new ArrayList<>();
    private Random random = new Random();

    public FlightService() {
        flights.add(new Flight(201L, "Kuressaare", LocalDate.of(2025, 4, 4), LocalTime.of(7, 40), 36,
                createRandomSeats(108)));
        flights.add(new Flight(202L, "Kuressaare", LocalDate.of(2025, 4, 4), LocalTime.of(18, 30), 34,
                createRandomSeats(108)));
        flights.add(
                new Flight(203L, "Kärdla", LocalDate.of(2025, 4, 4), LocalTime.of(7, 30), 34, createRandomSeats(108)));
        flights.add(
                new Flight(204L, "Kärdla", LocalDate.of(2025, 4, 4), LocalTime.of(18, 30), 32, createRandomSeats(108)));
        flights.add(
                new Flight(205L, "Pärnu", LocalDate.of(2025, 4, 4), LocalTime.of(6, 45), 30, createRandomSeats(108)));
        flights.add(
                new Flight(206L, "Pärnu", LocalDate.of(2025, 4, 4), LocalTime.of(15, 00), 28, createRandomSeats(108)));
        flights.add(
                new Flight(207L, "Tartu", LocalDate.of(2025, 4, 5), LocalTime.of(8, 00), 42, createRandomSeats(108)));
        flights.add(
                new Flight(208L, "Tartu", LocalDate.of(2025, 4, 5), LocalTime.of(18, 00), 40, createRandomSeats(108)));
        flights.add(
                new Flight(209L, "Pärnu", LocalDate.of(2025, 4, 5), LocalTime.of(6, 45), 30, createRandomSeats(108)));
        flights.add(
                new Flight(210L, "Pärnu", LocalDate.of(2025, 4, 5), LocalTime.of(15, 00), 28, createRandomSeats(108)));
        flights.add(
                new Flight(211L, "Tartu", LocalDate.of(2025, 4, 6), LocalTime.of(7, 15), 40, createRandomSeats(108)));
        flights.add(
                new Flight(212L, "Tartu", LocalDate.of(2025, 4, 6), LocalTime.of(18, 45), 42, createRandomSeats(108)));
        flights.add(
                new Flight(213L, "Kärdla", LocalDate.of(2025, 4, 6), LocalTime.of(10, 30), 32, createRandomSeats(108)));
        flights.add(
                new Flight(214L, "Kärdla", LocalDate.of(2025, 4, 6), LocalTime.of(19, 00), 34, createRandomSeats(108)));
        flights.add(new Flight(215L, "Kuressaare", LocalDate.of(2025, 4, 7), LocalTime.of(8, 10), 36,
                createRandomSeats(108)));
        flights.add(new Flight(216L, "Kuressaare", LocalDate.of(2025, 4, 7), LocalTime.of(17, 50), 38,
                createRandomSeats(108)));

    }

    private List<Seat> createRandomSeats(int numSeats) {
        List<Seat> seats = new ArrayList<>();
        List<Integer> occupiedIndexes = new ArrayList<>();

        int numOccupiedSeats = random.nextInt(numSeats + 1);

        while (occupiedIndexes.size() < numOccupiedSeats) {
            int randomIndex = random.nextInt(numSeats);
            if (!occupiedIndexes.contains(randomIndex)) {
                occupiedIndexes.add(randomIndex);
            }
        }

        for (int i = 1; i <= numSeats / 6; i++) {
            String seatNumberA = "A" + i;
            String seatNumberB = "B" + i;
            String seatNumberC = "C" + i;
            String seatNumberD = "D" + i;
            String seatNumberE = "E" + i;
            String seatNumberF = "F" + i;

            boolean isWindowSeatA = true;
            boolean isWindowSeatF = true;
            boolean isExtraLegroom = (i == 1 || i == 8);
            boolean isNearExit = (i == 1 || i == numSeats / 6);

            boolean isOccupiedA = occupiedIndexes.contains(seats.size());
            boolean isOccupiedB = occupiedIndexes.contains(seats.size() + 1);
            boolean isOccupiedC = occupiedIndexes.contains(seats.size() + 2);
            boolean isOccupiedD = occupiedIndexes.contains(seats.size() + 3);
            boolean isOccupiedE = occupiedIndexes.contains(seats.size() + 4);
            boolean isOccupiedF = occupiedIndexes.contains(seats.size() + 5);

            seats.add(new Seat(seatNumberA, isOccupiedA, isWindowSeatA, isExtraLegroom, isNearExit));
            seats.add(new Seat(seatNumberB, isOccupiedB, false, isExtraLegroom, isNearExit));
            seats.add(new Seat(seatNumberC, isOccupiedC, false, isExtraLegroom, isNearExit));
            seats.add(new Seat(seatNumberD, isOccupiedD, false, isExtraLegroom, isNearExit));
            seats.add(new Seat(seatNumberE, isOccupiedE, false, isExtraLegroom, isNearExit));
            seats.add(new Seat(seatNumberF, isOccupiedF, isWindowSeatF, isExtraLegroom, isNearExit));
        }

        return seats;
    }

    public List<Flight> filterFlights(Long flightId, String destination, LocalDate date, LocalTime time,
            Double maxPrice) {
        return flights.stream()
                .filter(f -> flightId == null || f.getFlightId().equals(flightId))
                .filter(f -> destination == null || f.getDestination().equalsIgnoreCase(destination))
                .filter(f -> date == null || f.getDate().equals(date))
                .filter(f -> time == null || f.getTime().equals(time))
                .filter(f -> maxPrice == null || f.getPrice() <= maxPrice)
                .collect(Collectors.toList());
    }

    public List<Seat> recommendSeats(Long flightId, Boolean windowSeat, Boolean extraLegroom, Boolean nearExit,
            int numberOfSeats) {

        Flight flight = flights.stream()
                .filter(f -> f.getFlightId().equals(flightId))
                .findFirst()
                .orElse(null);

        if (flight == null) {
            return new ArrayList<>();
        }

        List<Seat> availableSeats = flight.getSeats().stream()
                .filter(seat -> !seat.isOccupied())
                .filter(seat -> windowSeat == null || seat.isWindowSeat() == windowSeat)
                .filter(seat -> extraLegroom == null || seat.isExtraLegroom() == extraLegroom)
                .filter(seat -> nearExit == null || seat.isNearExit() == nearExit)
                .collect(Collectors.toList());

        if (numberOfSeats > 66) {
            return new ArrayList<>();
        }

        if (availableSeats.size() < numberOfSeats) {
            return availableSeats;
        }

        if (numberOfSeats > 1) {
            List<List<Seat>> adjacentSeatsGroups = findAdjacentSeats(availableSeats, numberOfSeats);

            if (!adjacentSeatsGroups.isEmpty()) {
                return adjacentSeatsGroups.get(0).stream()
                        .limit(numberOfSeats)
                        .collect(Collectors.toList());
            } else {
                return availableSeats.stream()
                        .limit(numberOfSeats)
                        .collect(Collectors.toList());
            }
        }
        return availableSeats.stream()
                .limit(numberOfSeats)
                .collect(Collectors.toList());
    }

    public List<List<Seat>> findAdjacentSeats(List<Seat> availableSeats, int numberOfSeats) {
        List<List<Seat>> adjacentGroups = new ArrayList<>();
        List<Seat> currentGroup = new ArrayList<>();

        for (int i = 0; i < availableSeats.size(); i++) {
            Seat currentSeat = availableSeats.get(i);

            if (currentGroup.isEmpty()) {
                currentGroup.add(currentSeat);
            } else {
                Seat lastSeatInGroup = currentGroup.get(currentGroup.size() - 1);
                if (areSeatsAdjacent(lastSeatInGroup, currentSeat)) {
                    currentGroup.add(currentSeat);
                } else {
                    adjacentGroups.add(currentGroup);
                    currentGroup = new ArrayList<>();
                    currentGroup.add(currentSeat);
                }
            }
        }

        if (!currentGroup.isEmpty()) {
            adjacentGroups.add(currentGroup);
        }

        adjacentGroups = adjacentGroups.stream()
                .filter(group -> group.size() >= numberOfSeats)
                .collect(Collectors.toList());

        return adjacentGroups;
    }

    private boolean areSeatsAdjacent(Seat seat1, Seat seat2) {
        char seat1Letter = seat1.getSeatNumber().charAt(0);
        char seat2Letter = seat2.getSeatNumber().charAt(0);
        int seat1Row = Integer.parseInt(seat1.getSeatNumber().substring(1));
        int seat2Row = Integer.parseInt(seat2.getSeatNumber().substring(1));

        return seat1Row == seat2Row && Math.abs(seat1Letter - seat2Letter) == 1;
    }
}
