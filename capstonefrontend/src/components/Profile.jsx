import { useState, useEffect } from "react";
import "./Profile.css";
import OtherPeopleProfile from "./Pages/OtherPeopleProfile";
import Checkboxlist from "./Checkbox";
import { useNavigate } from "react-router-dom";
import OtherPeopleVideos from "./Pages/OtherPeopleVideos";

function Profile() {
    const [videoFile, setVideoFile] = useState(null);
    const [videoCategory, setVideoCategory] = useState([]);
    const [videoTitle, setVideoTitle] = useState("");
    const [uploading, setUploading] = useState(false);
    const [videos, setVideos] = useState([]);
    const [searchResultsUser, setSearchResultsUser] = useState([]);
    const [searchQueryUser, setSearchQueryUser] = useState("");
    const [searchResultsVideos, setSearchResultsVideos] = useState([]);
    const [searchQueryVideos, setSearchQueryVideos] = useState("");
    const navigate = useNavigate();
    const handleSelectVideoChange = (event) => {
        setVideoFile(event.target.files[0]);
    };
    const handleUpload = (event) => {
        event.preventDefault();
        setUploading(true);
        const formData = new FormData();
        formData.set("video", videoFile);
        fetch(
            "http://localhost:3000/upload-video" +
                "?categories=" +
                encodeURI(JSON.stringify(videoCategory)) +
                "&title=" +
                encodeURI(JSON.stringify(videoTitle)),
            {
                method: "POST",
                body: formData,
                credentials: "include",
            }
        )
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
                if (data.videos == undefined) {
                    navigate("/login", { replace: true });
                    return;
                } else {
                    setVideos(data.videos);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };
    useEffect(() => {
        userVideos();
    });
    const handleSearchInputChangeUser = (event) => {
        const newSearchQuery = event.target.value;
        setSearchQueryUser(newSearchQuery);
    };
    const handleSearchSubmit = () => {
        // save the search query
        fetch("http://localhost:3000/saveSearch", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: searchQueryVideos }),
        });
    };
    return (
        <div>
            <input
                type="text"
                value={searchQueryUser}
                onChange={handleSearchInputChangeUser}
                placeholder="Search for users"
            />
            <ul>
                {searchQueryUser.length > 0 ? (
                    <OtherPeopleProfile searchQuery={searchQueryUser} />
                ) : null}
                {searchResultsUser.map((user) => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
            <input
                type="text"
                value={searchQueryVideos}
                onChange={(e) => setSearchQueryVideos(e.target.value)}
                placeholder="Search for video posts"
            />
            <button onClick={handleSearchSubmit}> search </button>
            {searchQueryVideos.length > 0 ? (
                <OtherPeopleVideos searchQuery={searchQueryVideos} />
            ) : null}
            {searchResultsVideos.map((user) => (
                <li key={user.id}>{user.name}</li>
            ))}
            <div className="videoSection"></div>
            <h1>Videos</h1>
            <p>Upload videos in MP4 format</p>
            <div className="VideoGrid">
                <form>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleSelectVideoChange}
                    ></input>
                    <Checkboxlist
                        options={[
                            { id: 1, name: "HipPop" },
                            { id: 2, name: "Jazz" },
                            { id: 3, name: "Afrobeat" },
                            { id: 4, name: "Salsa" },
                            { id: 5, name: "Ballet" },
                        ]}
                        selectedOptions={videoCategory}
                        setSelectedOptions={(val) => setVideoCategory(val)}
                    />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="title goes here"
                        id="cardBoardTitle"
                        onChange={(e) => setVideoTitle(e.target.value)}
                    ></input>
                    <button onClick={handleUpload}>Upload Video</button>
                </form>
                {uploading ? <p>Uploading...</p> : null}
            </div>
            <div>
                {videos &&
                    videos.map((video, idx) => {
                        return (
                            <span key={idx}>
                                <button
                                    id="deleteButton"
                                    onClick={handleDelete}
                                >
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
            <button></button>
        </div>
    );
}
export default Profile;
