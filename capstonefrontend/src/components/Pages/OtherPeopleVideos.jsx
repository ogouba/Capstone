import { useState, useEffect } from "react";

function OtherPeopleVideos({ searchQuery }) {
    const [videos, setVideos] = useState([]);
    const otherUserVideos = async (searchQuery) => {
        const response = await fetch(
            "http://localhost:3000/OtherUserVideos?q=" + searchQuery,
            {
                method: "GET",
                credentials: "include",
            }
        );
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        setVideos(data);
    };
    useEffect(() => {
        otherUserVideos(searchQuery);
    }, [searchQuery]);
    return (
        <div>
            {videos.map((video, idx) => (
                <video key={idx} src={video.videoData.secure_url} controls />
            ))}
        </div>
    );
}
export default OtherPeopleVideos;
