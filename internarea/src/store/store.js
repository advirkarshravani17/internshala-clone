import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../feature/Tempslice";
export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
