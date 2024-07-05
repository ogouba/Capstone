import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import './HomePage.css'
// import { Upload, Button } from "antd";

function HomePage(){
        const [videoFile, setVideoFile]  = useState(null);
        const [uploading, setUploading] = useState(false);
        const [videoUrl, setVideoUrl] = useState(null);
        const handleVideoChange = (event) => {
            setVideoFile(event.target.files[0]);
        }
        const handleUpload = (event) => {
            event.preventDefault()
            setUploading(true);
            const formData = new FormData();
            console.log(videoFile)
            formData.set("video", videoFile);
            // console.log(formData.get("video"));
            fetch('http://localhost:3000/upload-video', {
                method: 'POST',
                headers: {
                    'Cookie': document.cookie,
                },
                body: formData,
            })
            .then((response) => console.log(response))
            .then((data) => {
                console.log(data);
                setVideoUrl(data.videoUrl);
                setUploading(false);
            })
            .catch((error) => {
                console.error(error);
                setUploading(false);
            });
        };

    return (
        <div className="videoSection">
            <h1> Videos</h1>
            <p> Upload videos in MP4 format</p>
            <div className="VideoGrid">
                <form>
                    <input
                    type="file"
                    accept="video/*" 
                    onChange={handleVideoChange}
                    ></input>
                    <button onClick={handleUpload}> Upload Video</button>
                </form>
                {uploading ? (
                    <p> Uploading...</p>
                ): (
                    <video src={videoUrl} controls/>
                )}
            </div>
        </div>
    );

    // const [danceVideos, setDanceVideos] = useState([]);
    // const navigate = useNavigate();

    // const handleCreateDanceVideos = () =>{
    //     fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/danceVideos`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(newKudosBoard),
    //     })
    //     .then((response) => {
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         return response.json();
    //     })
    //     .then((data) => {
    //         fetchKudoBoards();
    //     })
    //     .catch((error) => {
    //         console.error("Error fetching kudosBoard:", error);
    //     });
    // };  
}
export default HomePage;