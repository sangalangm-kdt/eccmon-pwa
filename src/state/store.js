import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import pageReducer from "../features/page/pageSlice";
import scannedCodeReducer from "../features/scannedResult/scannedCodeSlice";
import statusReducer from "../features/status/statusSlice";
import processLocationReducer from "../features/process/processLocationSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    page: pageReducer,
    scannedCode: scannedCodeReducer,
    status: statusReducer,
    processLocation: processLocationReducer,
  },
});

export default store;
