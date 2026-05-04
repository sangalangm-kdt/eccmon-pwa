import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Fetch cylinder status options
export const fetchCylinderStatus = createAsyncThunk(
  "status/fetchCylinderStatus",
  async () => {
    const response = await fetch("http://localhost:8000/cylinder-status");
    if (!response.ok) {
      throw new Error("Failed to fetch cylinder status options");
    }
    return response.json();
  },
);

const statusSlice = createSlice({
  name: "status",
  initialState: {
    cylinderStatusOptions: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCylinderStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCylinderStatus.fulfilled, (state, action) => {
        console.log("Cylinder Status Data:", action.payload);
        state.status = "succeeded";
        state.cylinderStatusOptions = action.payload;
      })
      .addCase(fetchCylinderStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setSelectedStatus } = statusSlice.actions;

export default statusSlice.reducer;
