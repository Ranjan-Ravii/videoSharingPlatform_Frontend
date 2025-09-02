import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../../Features/Authentication.slice.jsx'
// import userVideosReducer from '../../Features/Video.slice.jsx'
import allVideosReducer from '../../Features/AllVideos.slice.jsx'

export const store = configureStore({
  reducer: {
    auth : authReducer,
    // userVideos: userVideosReducer,
    allVideos: allVideosReducer,
  },
})