import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TranscriptList = () => {
    const [transcripts, setTranscripts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(5); // Number of items per page
    const [visibleTranscripts, setVisibleTranscripts] = useState([]);

    useEffect(() => {
        fetchTranscripts();
    }, []);

    useEffect(() => {
        const startIndex = (currentPage - 1) * perPage;
        const endIndex = startIndex + perPage;
        setVisibleTranscripts(transcripts.slice(startIndex, endIndex));
    }, [transcripts, currentPage, perPage]);

    const fetchTranscripts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/transcripts');
            setTranscripts(response.data);
        } catch (error) {
            console.error('Error fetching transcripts:', error);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(transcripts.length / perPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Recent Transcriptions</div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Your Recent Audio Transcripts</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            View and manage your recent audio transcripts. Easily access and share your transcribed content.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-center justify-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="grid gap-6">
                            {visibleTranscripts.length === 0 ? (
                                <p>No transcripts available</p>
                            ) : (
                                visibleTranscripts.map((transcript) => (
                                    <div key={transcript._id} className="bg-background rounded-xl p-4 shadow-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-primary rounded-full p-2">
                                                <FileIcon className="h-6 w-6 text-primary-foreground" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold">{transcript.title}</h3>
                                                <p className="text-muted-foreground">{transcript.transcriptions}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">{new Date(transcript.timestamp).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="flex justify-center space-x-4 mt-6">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === Math.ceil(transcripts.length / perPage)}
                                className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                    <img
                src="https://cdn.prod.website-files.com/5fac161927bf86485ba43fd0/64705e36d6c173f75626cf6b_Blog-Cover-2022_02_How-to-Transcribe-Audio-to-Text-(Automatically-_-For-Free).jpeg"
                width="550"
                height="310"
                alt="Recent Transcriptions"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
                </div>
            </div>
        </section>
    );
};

function ClockIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}

function FileIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
    )
}

export default TranscriptList;
