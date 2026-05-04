import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password, t }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true },
      );
      const token = response.data.token;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          return rejectWithValue(t("common:userDoesNotExist"));
        } else if (error.response.status === 401) {
          return rejectWithValue(t("common:invalidUserOrPass"));
        } else {
          return rejectWithValue(t("common:errorNetwork"));
        }
      } else {
        return rejectWithValue(t("common:anErrorOccured"));
      }
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      return rejectWithValue("Logout failed. Please try again.");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAuthState } = authSlice.actions;
export default authSlice.reducer;
