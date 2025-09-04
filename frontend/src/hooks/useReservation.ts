import { reservationAPI } from "@/lib/api/reservation";
import { useCallback } from "react";
import type {
  CreateReservationPayload,
  CreateReservationResponse,
} from "@/types/reservation";

export const useReservation = () => {
  //   const [reservation, setReservation] = useState<Reservation | null>(null);

  const createReservation = useCallback(
    async (
      data: CreateReservationPayload
    ): Promise<CreateReservationResponse> => {
      const created = await reservationAPI.createReservation(data);
      console.log("Created Reservation:", created);
      return created;
    },
    []
  );

  return {
    createReservation,
  };
};
