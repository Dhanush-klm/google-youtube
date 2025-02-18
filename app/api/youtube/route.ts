import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { extractVideoId } from '@/app/utils/youtube';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

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

    // Initialize YouTube API client
    const youtube = google.youtube({
      version: 'v3',
      auth: YOUTUBE_API_KEY,
    });

    // Fetch video details from YouTube API
    const response = await youtube.videos.list({
      part: ['snippet', 'statistics'],
      id: [videoId],
    });

    const video = response.data.items?.[0];
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      title: video.snippet?.title,
      description: video.snippet?.description,
      viewCount: video.statistics?.viewCount,
      likeCount: video.statistics?.likeCount,
      publishedAt: video.snippet?.publishedAt,
      channelTitle: video.snippet?.channelTitle,
    });

  } catch (error) {
    console.error('Error processing YouTube URL:', error);
    return NextResponse.json(
      { error: 'Failed to process YouTube URL' },
      { status: 500 }
    );
  }
} 