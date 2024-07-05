import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import './HomePage.css'
// import { Upload, Button } from "antd";

function HomePage(){
        const [videoFile, setVideoFile]  = useState(null);
        const [uploading, setUploading] = useState(false);
        const [videos, setVideos] = useState([]);

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
                body: formData,
                credentials: "include"
            })
            .then((response) => response.json())
            .then((data) => {

                setUploading(false);
            })
            .catch((error) => {
                console.error(error);
                setUploading(false);
            });
        };

        const userVideos = () => {
            fetch('http://localhost:3000/getUserVideos', {
                method: 'GET',
                // body: formData,
                credentials: "include"
            })
            .then((response) => response.json())
            .then((data) => {
                setVideos(data.videos);
            })
            .catch((error) => {
                console.error(error);
            });
        }

        useEffect(()=>{
            userVideos()
        },[])
        

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
                ): null}
            </div>
            {videos.map((video) =>{
                console.log(video)
                return (
                    <video key={video.id} src={video.videoData.url} controls/>
                )
            })}
        </div>
    );
}
export default HomePage;