from youtube_transcript_api import YouTubeTranscriptApi
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return '<h1>YouTube Transcript API Server is Running!</h1>'

@app.route('/get-transcript', methods=['POST'])
def get_transcript():
    try:
        data = request.json
        video_id = data.get('videoId')
        
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        
        formatted_transcript = []
        for entry in transcript:
            formatted_transcript.append({
                'text': entry['text'],
                'start': entry['start'],
                'duration': entry['duration']
            })
            
        return jsonify({'transcript': formatted_transcript})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000) 