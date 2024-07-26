import { useState, useEffect } from "react";

function RecommendedVideos() {
    const [videosPrisma, setVideosPrisma] = useState([]);
    useEffect(() => {
        const fetchRecommendedVideos = async () => {
            const response = await fetch(
                "http://localhost:3000/getRecommendedVideosPrisma",
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const data = await response.json();
            setVideosPrisma(data);
        };
        fetchRecommendedVideos();
    }, []);
    const [videosAPI, setVideosAPI] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        // Delay the fetch call by 3 seconds
        const timer = setTimeout(() => {
            fetch(
                `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=UUGzGbfhdFsjP1yfJUEpSvWg&key=${import.meta.env.VITE_API_KEY2}`
            )
                .then((res) => res.json())
                .then((data) => {
                    setIsLoading(false);
                    setVideosAPI(data.items);
                })
                .catch((err) => {
                    console.error("Error fetching data: ", err);
                    setIsLoading(false);
                    setError(
                        "Sorry, something went wrong. Please try again later."
                    );
                });
        }, 30);
        return () => clearTimeout(timer);
    }, []);
    const addToWatchLaterPrisma = (videoId) => {
        fetch("http://localhost:3000/notifications/watchLaterPrisma", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ videoId: videoId }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert("Added to Watch Later!");
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    const addToWatchLaterAPI = (videoSnippet, title, thumbnail) => {
        fetch("http://localhost:3000/notifications/watchLaterAPI", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                videoSnippet,
                title,
                thumbnail
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert("Added to Watch Later!");
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    return (
        <div className="recommendationsSection">
            <h2>Recommended Videos</h2>
            <div className="videoList">
                <section className="recommended">
                    {isLoading ? (
                        <div className="loader-box">Loading...</div>
                    ) : error ? (
                        <h3>{error}</h3>
                    ) : (
                        videosAPI.map((video) => (
                            <div key={video.snippet.resourceId.videoId}>
                                <a
                                    className="videoList"
                                    target="_blank"
                                    href={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
                                >
                                    <img
                                        className="videoItem"
                                        src={
                                            video.snippet.thumbnails.standard
                                                .url
                                        }
                                        alt={video.snippet.title}
                                    />
                                    <h3 className="videoItem">
                                        {video.snippet.title}
                                    </h3>
                                </a>
                                <button
                                    onClick={() =>
                                        addToWatchLaterAPI(
                                            video.snippet.resourceId.videoId,
                                            video.snippet.title,
                                            video.snippet.thumbnails.standard.url
                                        )
                                    }
                                >
                                    Watch Later
                                </button>
                            </div>
                        ))
                    )}
                </section>
                <div className="recommended">
                    {videosPrisma &&
                        videosPrisma.map((video, index) => {
                            return (
                                <div key={index}>
                                    <video
                                        className="videoItem"
                                        id="videoimage"
                                        key={video.id}
                                        src={video.videoData.url}
                                        controls
                                    />
                                    <p>{video.title}</p>
                                    <span>
                                        {" "}
                                        {new Date(
                                            video.createdAt
                                        ).toLocaleString()}
                                    </span>
                                    <button
                                        onClick={() =>
                                            addToWatchLaterPrisma(video.id)
                                        }
                                    >
                                        Watch Later
                                    </button>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
export default RecommendedVideos;
