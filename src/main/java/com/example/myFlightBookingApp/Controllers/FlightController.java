package com.example.myFlightBookingApp.Controllers;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.web.bind.annotation.RestController;

import com.example.myFlightBookingApp.DTOs.Flight;
import com.example.myFlightBookingApp.DTOs.Seat;
import com.example.myFlightBookingApp.Services.FlightService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightService flightService;

    @Autowired
    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @GetMapping
    public List<Flight> getAllFlights(
            @RequestParam(required = false) Long flightId,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) LocalDate date,
            @RequestParam(required = false) LocalTime time,
            @RequestParam(required = false) Double maxPrice) {

        return flightService.filterFlights(flightId, destination, date, time, maxPrice);
    }

    @GetMapping("/{flightId}/seats")
    public List<Seat> getSeatRecommendations(
            @PathVariable Long flightId,
            @RequestParam(required = false) Boolean windowSeat, 
            @RequestParam(required = false) Boolean extraLegroom,
            @RequestParam(required = false) Boolean nearExit,
            @RequestParam int numberOfSeats) {
        return flightService.recommendSeats(flightId, windowSeat, extraLegroom, nearExit, numberOfSeats);
    }
}
