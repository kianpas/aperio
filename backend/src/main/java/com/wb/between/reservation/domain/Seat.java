package com.wb.between.reservation.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "seats")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String seatNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatType seatType;

    @Column(nullable = false)
    private Boolean isActive;

    @Column(length = 200)
    private String description;

    @Builder
    public Seat(String seatNumber, SeatType seatType, String description) {
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.isActive = true;
        this.description = description;
    }

    public void deactivate() {
        this.isActive = false;
    }

    public void activate() {
        this.isActive = true;
    }

    public void updateSeat(SeatType seatType, String description) {
        this.seatType = seatType;
        this.description = description;
    }
}