import { useState, useEffect } from "react";

function RecommendedVideos() {
    const [recommendedVideos, setRecommendedVideos] = useState([]);
    const [videos, setVideos] = useState([]);
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
            setVideos(data);
        };
        fetchRecommendedVideos();
    }, []);

    return (
        <div className="recommendationsSection">
            <h2>Recommended Videos</h2>
            <div>
                {videos &&
                    videos.map((video, index) => {
                        return (
                            <div key={index}>
                                <video
                                    id="videoimage"
                                    key={video.id}
                                    src={video.videoData.url}
                                    controls
                                />
                                <p>Category: {video.categories}</p>
                                <span> {video.createdAt.toLocaleString()}</span>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
export default RecommendedVideos;
