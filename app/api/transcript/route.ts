import { NextResponse } from 'next/server';
import { extractVideoId } from '@/app/utils/youtube';

// Replace the localhost URL with your deployed server URL
const TRANSCRIPT_API_URL = process.env.TRANSCRIPT_API_URL || 'http://localhost:5000';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    // Extract video ID from URL
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Make request to your Python transcript service
    const response = await fetch(`${TRANSCRIPT_API_URL}/get-transcript`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoId }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch transcript');
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error processing transcript request:', error);
    return NextResponse.json(
      { error: 'Failed to process transcript request' },
      { status: 500 }
    );
  }
} 