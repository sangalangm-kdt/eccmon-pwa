import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create an async thunk for checking the scanned code
export const checkScannedCode = createAsyncThunk(
  "scannedCode/checkScannedCode",
  async (eccId) => {
    const response = await axios.post("http://localhost:8000/check-code", {
      eccId,
    });
    return response.data; // Return the data from the API response
  },
);

const scannedCodeSlice = createSlice({
  name: "scannedCode",
  initialState: {
    data: null,
    error: null,
    loading: false,
  },
  reducers: {
    setScannedCode: (state, action) => {
      state.data = action.payload; // action.payload should include eccId
      state.error = null;
    },
    clearScannedCode: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkScannedCode.pending, (state) => {
        state.loading = true; // Set loading to true when the request is initiated
      })
      .addCase(checkScannedCode.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = null;
        state.loading = false; // Reset loading state on success
      })
      .addCase(checkScannedCode.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false; // Reset loading state on failure
      });
  },
});

// Export the actions and reducer
export const { setScannedCode, clearScannedCode } = scannedCodeSlice.actions;
export default scannedCodeSlice.reducer;
