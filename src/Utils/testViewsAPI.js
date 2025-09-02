// // testViewsAPI.js - Utility to test views API endpoints
// import api from '../Services/api';

// export const testViewsAPI = async () => {
//   console.log('🧪 Testing Views API endpoints...');
  
//   try {
//     // Test 1: Check if we can reach the backend
//     console.log('📍 Testing backend connectivity...');
//     const testResponse = await api.get('/video/allvideos');
//     console.log('✅ Backend connectivity:', testResponse.status === 200 ? 'OK' : 'FAILED');
    
//     // Test 2: Test views POST endpoint
//     console.log('📝 Testing views POST endpoint...');
//     const dummyVideoId = '507f1f77bcf86cd799439011'; // Dummy ObjectId
//     try {
//       const postResponse = await api.post('/video/views/add', { videoId: dummyVideoId });
//       console.log('✅ Views POST endpoint:', postResponse.status === 200 ? 'OK' : 'FAILED');
//       console.log('📊 Response data:', postResponse.data);
//     } catch (postError) {
//       console.log('❌ Views POST endpoint failed:', postError.response?.status, postError.response?.data);
//     }
    
//     // Test 3: Test views GET endpoint
//     console.log('📖 Testing views GET endpoint...');
//     try {
//       const getResponse = await api.get(`/video/Views/${dummyVideoId}`);
//       console.log('✅ Views GET endpoint:', getResponse.status === 200 ? 'OK' : 'FAILED');
//       console.log('📊 Response data:', getResponse.data);
//     } catch (getError) {
//       console.log('❌ Views GET endpoint failed:', getError.response?.status, getError.response?.data);
//     }
    
//   } catch (error) {
//     console.error('❌ API test failed:', error);
//   }
// };

// export const logVideoData = (video) => {
//   console.log('📹 Video data structure:');
//   console.log('ID:', video._id);
//   console.log('Title:', video.title);
//   console.log('viewedBy:', video.viewedBy);
//   console.log('viewedBy length:', video.viewedBy?.length);
//   console.log('All keys:', Object.keys(video));
// };
