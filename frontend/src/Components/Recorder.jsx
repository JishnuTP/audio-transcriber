import React, { useState, useRef } from 'react';
import axios from 'axios';
import MicIcon from '@mui/icons-material/Mic';
import { useNavigate } from 'react-router-dom';

const Recorder = () => {
    const [recording, setRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const mediaRecorderRef = useRef(null);
    const [title, setTitle] = useState('');
    const navigate= useNavigate();

    const startRecording = () => {
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');
    
        if (storedUsername && storedPassword) {
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
              const mediaRecorder = new MediaRecorder(stream);
              mediaRecorderRef.current = mediaRecorder;
              let chunks = [];
    
              mediaRecorder.ondataavailable = (event) => {
                chunks.push(event.data);
              };
    
              mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunks, { type: 'audio/wav' });
    
                // Create FormData and append the audioBlob
                const formData = new FormData();
                formData.append('audio', audioBlob, 'audio.wav');
    
                // Send FormData to backend for transcription
                axios.post('http://localhost:5000/api/transcribe', formData)
                  .then(response => {
                    setTranscript(response.data.transcript);
                  })
                  .catch(error => {
                    console.error('Error transcribing audio:', error);
                  });
    
                // Clear chunks for next recording
                chunks = [];
              };
    
              mediaRecorder.start();
            })
            .catch(error => {
              console.error('Error accessing microphone:', error);
            });
    
          setRecording(true);
        } else {
          // User not logged in, navigate to login
          navigate('/login');
        }
      };
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setRecording(false);


    };
    ///for saving transripted file

    const saveTranscription = () => {
        if (!title || !transcript) {
            console.error('Title or transcript is missing');
            return;
        }

        axios.post('http://localhost:5000/api/saveTranscription', { title, transcript })
            .then(response => {
                console.log('Transcription saved to database:', response.data);
                // Optionally clear the title and transcript after saving


            })
            .catch(error => {

                console.error('Error saving transcription to database:', error);
                setTranscript('');
                setTitle('');

            });
    };

    return (
        <div className="bg-muted rounded-xl p-6 w-full max-w-md shadow-lg">
            <div className="flex flex-col items-center space-y-4">
                <div className="flex flex-col items-center justify-center">
                    <MicIcon className="h-12 w-12 text-primary" />
                    <h2 className="text-2xl font-bold">Record Audio</h2>
                    <p className="text-muted-foreground">
                        Click the microphone to start recording. Your audio will be transcribed in real-time.
                    </p>
                </div>
                <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    placeholder="Enter title and save ..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <button
                    onClick={recording ? stopRecording : startRecording}
                    className="w-full inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                    <MicIcon className="h-5 w-5 mr-2" />
                    {recording ? 'Stop Recording' : 'Start Recording'}
                </button>
                <div className="bg-background rounded-md p-4 w-full">
                    <p className="text-muted-foreground">Your transcribed text will appear here:</p>
                    <p className='text-red-500'>{transcript}</p>
                    {transcript && (
                        <button
                            onClick={saveTranscription}
                            className="mt-4 inline-flex items-center justify-center h-10 px-4 rounded-md bg-primary text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            Save Transcription
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recorder;