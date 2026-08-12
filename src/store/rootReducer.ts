import { combineReducers } from "@reduxjs/toolkit";
import studentsReducer from "@/features/students/store/studentsSlice";

export const rootReducer = combineReducers({
  students: studentsReducer,
});
