// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../Services/api';
// import axios from 'axios';

// // Async thunk to get videos of a specific user
// export const getUservideos = createAsyncThunk(
//   'user/videoStatus',
//   async (username, thunkApi) => {
//     try {
//       const response = await api.get(`/video/uservideos/c/${username}`);
//       // API returns { data: { username, avatar, userVideos: [] } }
//       return response.data.data;
//     } catch (error) {
//       return thunkApi.rejectWithValue(error.response?.data?.message || 'Failed to fetch user videos');
//     }
//   }
// );

// // Initial state
// const storedUserVideos = JSON.parse(localStorage.getItem('userVideos'));

// const userVideoSlice = createSlice({
//   name: 'userVideos',
//   initialState: {
//     videos: (storedUserVideos && storedUserVideos.videos) || [],
//     userInfo: (storedUserVideos && storedUserVideos.userInfo) || null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearUserVideos: (state) => {
//       state.videos = [];
//       state.error = null;
//       localStorage.removeItem('userVideos');
//     },
//   },
//   extraReducers: (builder) => {
//     // Get User Videos
//     builder
//       .addCase(getUservideos.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getUservideos.fulfilled, (state, action) => {
//         state.loading = false;
//         state.videos = action.payload.userVideos || [];
//         state.userInfo = { username: action.payload.username, avatar: action.payload.avatar };
//         localStorage.setItem('userVideos', JSON.stringify({ videos: state.videos, userInfo: state.userInfo }));
//       })
//       .addCase(getUservideos.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearUserVideos } = userVideoSlice.actions;
// export default userVideoSlice.reducer;
