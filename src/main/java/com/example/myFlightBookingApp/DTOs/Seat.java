package com.example.myFlightBookingApp.DTOs;

public class Seat {
    private String seatNumber;
    private boolean isOccupied;
    private boolean isWindowSeat;
    private boolean isExtraLegroom;
    private boolean isNearExit;

    public Seat(String seatNumber, boolean isOccupied, boolean isWindowSeat, boolean isExtraLegroom,
            boolean isNearExit) {
        this.seatNumber = seatNumber;
        this.isOccupied = isOccupied;
        this.isWindowSeat = isWindowSeat;
        this.isExtraLegroom = isExtraLegroom;
        this.isNearExit = isNearExit;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public boolean isOccupied() {
        return isOccupied;
    }

    public void setOccupied(boolean isOccupied) {
        this.isOccupied = isOccupied;
    }

    public boolean isWindowSeat() {
        return isWindowSeat;
    }

    public void setWindowSeat(boolean isWindowSeat) {
        this.isWindowSeat = isWindowSeat;
    }

    public boolean isExtraLegroom() {
        return isExtraLegroom;
    }

    public void setExtraLegroom(boolean isExtraLegroom) {
        this.isExtraLegroom = isExtraLegroom;
    }

    public boolean isNearExit() {
        return isNearExit;
    }

    public void setNearExit(boolean isNearExit) {
        this.isNearExit = isNearExit;
    }

}
