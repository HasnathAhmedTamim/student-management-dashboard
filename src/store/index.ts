import { configureStore } from "@reduxjs/toolkit";
import studentsReducer from "./studentsSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      students: studentsReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
