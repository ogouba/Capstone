import { useEffect, useState } from "react";
import "./WatchLater.css";

function WatchLater(){
    const [videosPrisma, setVideosPrisma] = useState([]);
    const [videosAPI, setVideosAPI] = useState([]);

    useEffect(() => {
        const fetchWatchLaterVideosPrisma = async () => {
            const response = await fetch("http://localhost:3000/notifications/watchLaterPrisma",
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const data = await response.json();
            setVideosPrisma(data.watchLaterVideos);
        };
        fetchWatchLaterVideosPrisma();
    }, []);

    useEffect(() => {
        const fetchWatchLaterVideosAPI = async () => {
            const response = await fetch("http://localhost:3000/notifications/watchLaterAPI",
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const data = await response.json();
            setVideosAPI(data.watchLaterVideos);
        };
        fetchWatchLaterVideosAPI();
    }, []);

    const deleteVideoAPI = async (videoId) => {
        try {
            const response = await fetch(`http://localhost:3000/watchLaterAPI/${videoId}`, {
                method: 'DELETE',
                credentials: 'include', 
            });
            const data = await response.json();
            if (response.ok) {
                alert('Video removed from Watch Later!');
            } else {
                throw new Error(data.message || 'Failed to delete the video');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    const deleteVideoPrisma = async (videoId) => {
        try {
            const response = await fetch(`http://localhost:3000/watchLaterPrisma/${videoId}`, {
                method: 'DELETE',
                credentials: 'include',
            });   
            const data = await response.json();
            if (response.ok) {
                alert('Video removed from Watch Later!');
            } else {
                throw new Error(data.message || 'Failed to delete the video');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    return (
        <div className="watchLater">
            <p> videos saved to watch later</p>
        <section className="recommended">
            {
                videosAPI.map((video) => (
                    <div key={video.videoSnippet}>
                        <a
                            className="videoList"
                            target="_blank"
                            href={`https://www.youtube.com/watch?v=${video.videoSnippet}`}
                        >
                            <img
                                className="videoItem"
                                src={
                                    video.thumbnail
                                }
                                alt={video.title}
                            />
                        </a>
                        <button onClick={() => deleteVideoAPI(video.id)}> delete </button>
                    </div>
                ))
            }
        </section>
        {videosPrisma !== null && videosPrisma !== undefined &&
            videosPrisma.map((video, index) => {
                return (   
                    <div key={index}>
                        <video className="videoItem"
                            id="videoimage"
                            key={video.video.id}
                            src={video.video.videoData.url}
                            controls
                        />
                        <p>{video.video.title}</p>
                        <span> {new Date(video.video.createdAt).toLocaleString()}</span>
                        <button onClick={() => deleteVideoPrisma(video.id)}> delete </button>
                    </div>
                );
            })}
    </div>
    );
}
export default WatchLater
