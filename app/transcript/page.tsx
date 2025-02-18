'use client';
import { useState } from 'react';
import Link from 'next/link';

interface TranscriptEntry {
  text: string;
  start: number;
  duration: number;
}

export default function TranscriptPage() {
  const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (data.transcript) {
        setTranscript(data.transcript);
      }
    } catch (error) {
      console.error('Error fetching transcript:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <nav className="max-w-2xl mx-auto mb-8">
        <Link href="/" className="text-blue-500 hover:text-blue-600">
          ← Back to Video Details
        </Link>
      </nav>
      
      <main className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">YouTube Transcript Extractor</h1>
        
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
            {loading ? 'Processing...' : 'Get Transcript'}
          </button>
        </form>

        {transcript.length > 0 && (
          <div className="mt-8 p-4 border rounded-md">
            <h2 className="text-xl font-semibold mb-4">Transcript</h2>
            <div className="space-y-4">
              {transcript.map((entry, index) => (
                <div key={index} className="p-2 hover:bg-gray-50">
                  <p>{entry.text}</p>
                  <span className="text-sm text-gray-500">
                    {Math.floor(entry.start / 60)}:{Math.floor(entry.start % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 