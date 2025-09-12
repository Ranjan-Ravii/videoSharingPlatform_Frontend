
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import api from '../Services/api';

// Create async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await api.post('/users/login', credentials);

      // Store the token in localStorage
      // Save the full user data and tokens
      localStorage.setItem('authUser', JSON.stringify(response.data.data.user));
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);

      // Return the complete data structure
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);


const storedUser = JSON.parse(localStorage.getItem('authUser'));
const storedAccessToken = localStorage.getItem('accessToken');
const storedRefreshToken = localStorage.getItem('refreshToken');

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser || null,
    accessToken: storedAccessToken || null,
    refreshToken: storedRefreshToken || null,
    isAuthenticated: !!storedUser, // true if user is stored
    loading: false,
    error: null,
  },
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem('authUser');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // localStorage.removeItem('authToken'); // incase if being used else where.
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;