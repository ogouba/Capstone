import { useState, useEffect } from "react";

function RecommendedVideos() {
    const [recommendedVideos, setRecommendedVideos] = useState([]);
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
                "https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=UUGzGbfhdFsjP1yfJUEpSvWg&key=AIzaSyAD22FxXGqu8Ph3k9_XHzJChuLTJ2Bujbo"
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
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="recommendationsSection">
            <h2>Recommended Videos</h2>
            <div classname="videoList"> 
            <section classname="recommended">
                {isLoading ? (
                    <div className="loader-box">Loading...</div>
                ) : error ? (
                    <h3>{error}</h3>
                ) : (
                    videosAPI.map((video) => (
                      <a className="videoList"
                            key={video.snippet.resourceId.videoId}
                            target="_blank"
                            href={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
                        >
                            <img className="videoItem"
                                src={video.snippet.thumbnails.standard.url}
                                alt={video.snippet.title}
                            />
                            <h3 classname="videoItem">{video.snippet.title}</h3>
                        </a>
                    ))
                )}
            </section>
            <div classname="recommended">
                {videosPrisma &&
                    videosPrisma.map((video, index) => {
                        return (   
                            <div key={index}>
                                <video className="videoItem"
                                    id="videoimage"
                                    key={video.id}
                                    src={video.videoData.url}
                                    controls
                                />
                                <p>{video.title}</p>
                                <span> {new Date(video.createdAt).toLocaleString()}</span>
                            </div>
                        );
                    })}
            </div>
            </div>
        </div>
    );
}
// get recommended vidoes  by score with time crerated and popularity
export default RecommendedVideos;
