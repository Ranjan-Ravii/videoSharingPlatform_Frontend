import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../Services/api';

// Async thunk to get all videos
export const getAllVideos = createAsyncThunk(
  'videos/getAll',
  async (_, thunkApi) => {
    try {
      const response = await api.get('/video/allvideos');

      // ✅ Only return the array of videos from response
      return response.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch videos.'
      );
    }
  }
);


// Initial state
const allVideosSlice = createSlice({
  name: 'allVideos',
  initialState: {
    videos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload; // ✅ payload is already just the array
        // console.log("Fetched videos:", action.payload);
      })
      .addCase(getAllVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default allVideosSlice.reducer;
