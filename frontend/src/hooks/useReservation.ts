import { reservationAPI } from "@/lib/api/reservation";
import { useState, useEffect, useCallback } from "react";
import type { Reservation } from "@/lib/api/reservation";

import {CreateReservationPayload} from "@/types/reservation";

export const useReservation = () => {
  //   const [reservation, setReservation] = useState<Reservation | null>(null);

  const createReservation = useCallback(
    async (data: CreateReservationPayload): Promise<CreateReservationPayload> => {
      const newReservation = await reservationAPI.createReservation(data);
      console.log("Created Reservation:", newReservation);
      //   setReservation(newReservation);
      return newReservation;
    },
    []
  );

  return {
    createReservation,
  };
};
