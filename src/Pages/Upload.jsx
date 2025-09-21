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
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white mt-5">
      {/* container fits screen below navbar */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Upload Video
          </h1>
          <p className="text-gray-400 text-sm">Share your content with the world</p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {/* LEFT */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 shadow-xl overflow-y-auto">
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Video Title *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging title"
                className="w-full p-3 rounded-lg bg-gray-900/70 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 text-white placeholder-gray-400"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                placeholder="Describe your video..."
                className="w-full p-3 rounded-lg bg-gray-900/70 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 text-white placeholder-gray-400 resize-none"
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Thumbnail (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex items-center justify-between w-full p-4 border-2 border-dashed border-gray-600 hover:border-red-500 rounded-lg bg-gray-900/30">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      {thumbnail ? (
                        <>
                          <p className="text-green-400 text-sm">{thumbnail.name}</p>
                          <p className="text-gray-500 text-xs">{(thumbnail.size / 1024).toFixed(1)} KB</p>
                        </>
                      ) : (
                        <p className="text-gray-400 text-sm">Upload thumbnail (PNG, JPG)</p>
                      )}
                    </div>
                  </div>
                  {thumbnail && (
                    <button
                      onClick={resetThumbnail}
                      className="p-1 text-red-400 hover:text-red-300"
                      type="button"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 shadow-xl overflow-y-auto flex flex-col justify-between">
            {/* Video Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Video File *
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  accept="video/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex items-center justify-between w-full p-4 border-2 border-dashed border-gray-600 hover:border-red-500 rounded-lg bg-gray-900/30">
                  <div>
                    {videoFile ? (
                      <>
                        <p className="text-green-400 text-sm">{videoFile.name}</p>
                        <p className="text-gray-500 text-xs">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
                      </>
                    ) : (
                      <p className="text-gray-400 text-sm">Click to upload video (MP4, AVI, MOV)</p>
                    )}
                  </div>
                  {videoFile && (
                    <button
                      onClick={resetVideoFile}
                      className="p-1 text-red-400 hover:text-red-300"
                      type="button"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Progress */}
            {loading && (
              <div className="mb-4">
                <p className="text-gray-300 text-sm mb-1">Uploading...</p>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              disabled={loading || !videoFile}
              onClick={handleSubmit}
              className="w-full mt-auto bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
            >
              {loading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-gray-400">
          By uploading, you agree to our terms of service and community guidelines.
        </div>
      </div>
    </div>
  );
}
