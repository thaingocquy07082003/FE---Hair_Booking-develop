import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Booking {
  id: string;
  userId: string;
  stylistId: string;
  serviceId: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}

interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload);
    },
    updateBooking: (state, action: PayloadAction<Booking>) => {
      const index = state.bookings.findIndex(
        (booking) => booking.id === action.payload.id
      );
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
    },
    deleteBooking: (state, action: PayloadAction<string>) => {
      state.bookings = state.bookings.filter(
        (booking) => booking.id !== action.payload
      );
    },
    setSelectedBooking: (state, action: PayloadAction<Booking | null>) => {
      state.selectedBooking = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setBookings,
  addBooking,
  updateBooking,
  deleteBooking,
  setSelectedBooking,
  setLoading,
  setError,
} = bookingSlice.actions;

export default bookingSlice.reducer;
