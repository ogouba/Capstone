import "./Main.css";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext.js";
import { Link, useNavigate } from "react-router-dom";
import RecomendedVideos from "./RecomendedVideos.jsx";

function Main() {
    const { user } = useContext(UserContext);
    const [form, setForm] = useState({
        title: "",
        content: "",
        credentials: "include",
    });
    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [videosAPI, setVideosAPI] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(
            `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLU0Zi53zZiB6MZWh4Nyv3HwlhEd99Earo&key=${import.meta.env.VITE_API_KEY2}`
        )
        .then((res) => res.json())
        .then((data) => {
            setIsLoading(false);
            setVideosAPI(data.items);
        })
        .catch((err) => {
            console.error("Error fetching data: ", err);
            setIsLoading(false);
            setError("Sorry, something went wrong. Please try again later.");
        });
    }, []);

    const handleLogout = async () => {
        const response = await fetch("http://localhost:3000/logout", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        const data = response.json();
        updateUser();
        navigate("/");
    };
    return (
        <div className="main">
            <header className="header">
                <div className="user-info">
                    {user ? (
                        <>
                            <span>Hi {user.username}! |</span>
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
                <p>
                    New Post <Link to="/newpost"> new post </Link>
                </p>
                <p>
                    Notifications <Link to="/notifications"> notifications </Link>
                </p>
                <p>
                    Watchlater  <Link to="/watchLater"> watchlater </Link>
                </p>
            </header>
            <div className="recommendationsBar">
                {user ? <RecomendedVideos /> : <></>}
            </div>
            <section className="recommended">
                <p id="videoTitle"> Main Feed</p>
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
                                        className="videoCard"
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
                            </div>
                        ))
                    )}
                </section>
        </div>
    );
}
export default Main;
