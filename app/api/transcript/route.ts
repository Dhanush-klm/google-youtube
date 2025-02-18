import { NextResponse } from 'next/server';
import { extractVideoId } from '../youtube/route';

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
    const response = await fetch('http://localhost:5000/get-transcript', {
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