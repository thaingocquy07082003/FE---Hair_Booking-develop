import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  modalOpen: boolean;
  currentModal: string | null;
  toast: {
    message: string;
    type: "success" | "error" | "info" | "warning";
    show: boolean;
  };
}

const initialState: UIState = {
  theme: "light",
  sidebarOpen: false,
  modalOpen: false,
  currentModal: null,
  toast: {
    message: "",
    type: "info",
    show: false,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.modalOpen = true;
      state.currentModal = action.payload;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.currentModal = null;
    },
    showToast: (
      state,
      action: PayloadAction<{ message: string; type: UIState["toast"]["type"] }>
    ) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type,
        show: true,
      };
    },
    hideToast: (state) => {
      state.toast.show = false;
    },
  },
});

export const {
  toggleTheme,
  toggleSidebar,
  openModal,
  closeModal,
  showToast,
  hideToast,
} = uiSlice.actions;

export default uiSlice.reducer;
