package com.example.myFlightBookingApp.DTOs;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class Flight {
    private Long flightId;
    private String destination;
    private LocalDate date;
    private LocalTime time;
    private double price;
    private List<Seat> seats;

    public Flight(Long flightId, String destination, LocalDate date, LocalTime time, double price, List<Seat> seats) {
        this.flightId= flightId;
        this.destination = destination;
        this.date = date;
        this.time = time;
        this.price = price;
        this.seats = seats;
    }

    public Long getFlightId() {
        return flightId;
    }

    public String getDestination() {
        return destination;
    }

    public LocalDate getDate() {
        return date;
    }

    public LocalTime getTime() {
        return time;
    }

    public double getPrice() {
        return price;
    }

    public List<Seat> getSeats() {
        return seats;
    }


}
