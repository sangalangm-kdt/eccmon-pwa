import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Thunks for fetching process options
export const fetchProcessStorageLocation = createAsyncThunk(
  "process/fetchProcessStorageLocation",
  async () => {
    const response = await fetch("http://localhost:8000/process-storage");
    if (!response.ok) {
      throw new Error("Failed to fetch the storage location option");
    }
    return response.json();
  },
);

export const fetchProcessDisassemblyLocation = createAsyncThunk(
  "process/fetchProcessDisassemblyLocation",
  async () => {
    const response = await fetch("http://localhost:8000/process-disassembly");
    if (!response.ok) {
      throw new Error("Failed to fetch the disassembly location option");
    }
    return response.json();
  },
);

export const fetchProcessGroovingLocation = createAsyncThunk(
  "process/fetchProcessGroovingLocation",
  async () => {
    const response = await fetch("http://localhost:8000/process-grooving");
    if (!response.ok) {
      throw new Error("Failed to fetch the grooving location option");
    }
    return response.json();
  },
);

export const fetchProcessLMDLocation = createAsyncThunk(
  "process/fetchProcessLMDLocation",
  async () => {
    const response = await fetch("http://localhost:8000/process-lmd");
    if (!response.ok) {
      throw new Error("Failed to fetch the LMD option");
    }
    return response.json();
  },
);

export const fetchProcessFinishingLocation = createAsyncThunk(
  "process/fetchProcessFinishingLocation",
  async () => {
    const response = await fetch("http://localhost:8000/process-finishing");
    if (!response.ok) {
      throw new Error("Failed to fetch the finishing location option");
    }
    return response.json();
  },
);

export const fetchProcessAssemblyLocation = createAsyncThunk(
  "process/fetchProcessAssemblyLocation",
  async () => {
    const response = await fetch("http://localhost:8000/process-assembly");
    if (!response.ok) {
      throw new Error("Failed to fetch the assembly location option");
    }
    return response.json();
  },
);

// Slice for managing process options state
const processSlice = createSlice({
  name: "process",
  initialState: {
    storage: [],
    disassembly: [],
    grooving: [],
    lmd: [],
    finishing: [],
    assembly: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchProcessStorageLocation
    builder
      .addCase(fetchProcessStorageLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProcessStorageLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.storage = action.payload;
        console.log("storage option:", action.payload);
      })
      .addCase(fetchProcessStorageLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle other fetch actions similarly
      .addCase(fetchProcessDisassemblyLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProcessDisassemblyLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.disassembly = action.payload;
      })
      .addCase(fetchProcessDisassemblyLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProcessGroovingLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProcessGroovingLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.grooving = action.payload;
      })
      .addCase(fetchProcessGroovingLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProcessLMDLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProcessLMDLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.lmd = action.payload;
      })
      .addCase(fetchProcessLMDLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProcessFinishingLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProcessFinishingLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.finishing = action.payload;
      })
      .addCase(fetchProcessFinishingLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProcessAssemblyLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProcessAssemblyLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.assembly = action.payload;
      })
      .addCase(fetchProcessAssemblyLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the actions and reducer
export const selectProcess = (state) => state.process;
export default processSlice.reducer;
