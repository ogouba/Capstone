import { useState, useEffect } from "react";
import "./Profile.css";
import OtherPeopleProfile from "./Pages/OtherPeopleProfile"

function Profile() {
    const [videoFile, setVideoFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [videos, setVideos] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const handleVideoChange = (event) => {
        setVideoFile(event.target.files[0]);
    };
    const handleUpload = (event) => {
        event.preventDefault();
        setUploading(true);
        const formData = new FormData();
        formData.set("video", videoFile);
        fetch("http://localhost:3000/upload-video", {
            method: "POST",
            body: formData,
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                setUploading(false);
                userVideos();
            })
            .catch((error) => {
                console.error(error);
                setUploading(false);
            });
    };
    const handleDelete = (event) => {
        event.preventDefault();
        const videoId = videos[0].id; 
        fetch(`http://localhost:3000/delete-video/${videoId}`, {
            method: "DELETE",
            credentials: "include",
            body: JSON.stringify({ id: videoId }),
        })
            .then((response) => response.json())
            .then((data) => {
                userVideos();
            })

            .catch((error) => {
                console.error(error);
            });
    };

    const userVideos = () => {
        fetch("http://localhost:3000/getUserVideos", {
            method: "GET",
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                setVideos(data.videos);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        userVideos();
    }, []);

    const handleSearchInputChange = (event) => {
        const newSearchQuery = event.target.value;
        setSearchQuery(newSearchQuery);
    };

    return (
        <div>
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="Search for users or posts"
            />
            <ul>
                {searchQuery.length > 0 ? <OtherPeopleProfile searchQuery={searchQuery} /> : null}
                {searchResults.map((user) => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>

            <div className="videoSection"></div>
            <h1>Videos</h1>
            <p>Upload videos in MP4 format</p>
            <div className="VideoGrid">
                <form>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                    ></input>
                    <button onClick={handleUpload}>Upload Video</button>
                </form>
                {uploading ? <p>Uploading...</p> : null}
            </div>
            <div>
                {videos.map((video) => {
                    return (
                        <span>
                            <button id="deleteButton" onClick={handleDelete}>
                                Delete Video
                            </button>
                            <video
                                id="videoimage"
                                key={video.id}
                                src={video.videoData.url}
                                controls
                            />
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
export default Profile;
