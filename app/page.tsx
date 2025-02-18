'use client';
import { useState } from 'react';

interface VideoDetails {
  title: string;
  description: string;
  viewCount: string;
  likeCount: string;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      setVideoDetails(data);
    } catch (error) {
      console.error('Error fetching video details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">YouTube Video Details</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter YouTube URL"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Get Details'}
          </button>
        </form>

        {videoDetails && (
          <div className="mt-8 p-4 border rounded-md">
            <h2 className="text-xl font-semibold">{videoDetails.title}</h2>
            <p className="mt-2">{videoDetails.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Views:</span> {videoDetails.viewCount}
              </div>
              <div>
                <span className="font-medium">Likes:</span> {videoDetails.likeCount}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
