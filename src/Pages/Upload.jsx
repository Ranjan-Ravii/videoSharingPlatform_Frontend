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

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 rounded bg-zinc-900 border border-zinc-800" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full p-2 rounded bg-zinc-900 border border-zinc-800" />
        <input type="file" onChange={(e) => setVideoFile(e.target.files[0])} accept="video/*" className="w-full" />
        <input type="file" onChange={(e) => setThumbnail(e.target.files[0])} accept="image/*" className="w-full" />
        <button disabled={loading} type="submit" className="bg-red-600 px-4 py-2 rounded">{loading ? 'Uploading...' : 'Upload'}</button>
      </form>
    </div>
  );
}

