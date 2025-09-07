import React, { useState } from 'react';
import api from '../Services/api';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return alert('Select a video file');
    try {
      setLoading(true);
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('videoFile', videoFile);
      if (thumbnail) form.append('thumbnail', thumbnail);

      await api.post('/video/upload-video', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Uploaded');
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnail(null);
    } catch (e) {
      console.error(e);
      alert('Upload failed. Ensure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  const resetVideoFile = () => setVideoFile(null);
  const resetThumbnail = () => setThumbnail(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Upload Video
            </h1>
            <p className="text-gray-400">Share your content with the world</p>
          </div>

          {/* Upload Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            <div className="space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Video Title *
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter an engaging title for your video"
                  className="w-full p-4 rounded-xl bg-gray-900/70 border border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 text-white placeholder-gray-400"
                />
              </div>

              {/* Description Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your video content..."
                  rows="4"
                  className="w-full p-4 rounded-xl bg-gray-900/70 border border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 text-white placeholder-gray-400 resize-none"
                />
              </div>

              {/* Video File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Video File *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    accept="video/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center justify-between w-full p-6 border-2 border-dashed border-gray-600 hover:border-red-500 rounded-xl bg-gray-900/30 transition-all duration-200">
                    <div className="flex items-center">
                      <svg className="h-8 w-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <div>
                        {videoFile ? (
                          <div>
                            <p className="text-green-400 font-medium">{videoFile.name}</p>
                            <p className="text-gray-500 text-sm">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-300 font-medium">Click to upload video</p>
                            <p className="text-gray-500 text-sm">MP4, AVI, MOV up to 500MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {videoFile && (
                      <button
                        onClick={resetVideoFile}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        type="button"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Thumbnail (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => setThumbnail(e.target.files[0])}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center justify-between w-full p-6 border-2 border-dashed border-gray-600 hover:border-red-500 rounded-xl bg-gray-900/30 transition-all duration-200">
                    <div className="flex items-center">
                      <svg className="h-8 w-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        {thumbnail ? (
                          <div>
                            <p className="text-green-400 font-medium">{thumbnail.name}</p>
                            <p className="text-gray-500 text-sm">{(thumbnail.size / 1024).toFixed(1)} KB</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-300 font-medium">Upload thumbnail</p>
                            <p className="text-gray-500 text-sm">PNG, JPG up to 5MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {thumbnail && (
                      <button
                        onClick={resetThumbnail}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        type="button"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Progress (if loading) */}
              {loading && (
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <svg className="animate-spin h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-300">Uploading your video...</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  disabled={loading || !videoFile}
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/25"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </div>
                  ) : (
                    'Upload Video'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              By uploading, you agree to our terms of service and community guidelines
            </p>
          </div>
        </div>
      </div>
      <div className='h-16'></div>
    </div>
  );
}