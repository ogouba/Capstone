import "./Main.css"
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext.js";
import { Link, useNavigate } from "react-router-dom";
import DanceVideosBoard from "./DanceVIdeosBoard.jsx";
import OtherPeopleProfile from "./Pages/OtherPeopleProfile.jsx";

function Main() {
    const { user } = useContext(UserContext);
    const [danceVideos, setdanceVideos] = useState([]);
  
    
    const [form, setForm] = useState({
        title: '',
        content: '',
        credentials: 'include'
    });
    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() =>{
        const fetchDanceVideos = async () => {
            const response = await fetch('http://localhost:3000/getVideos');
            const data = await response.json();
            setdanceVideos(data);    
        };
        fetchDanceVideos();      
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };
    const handleLogout = async () => {
        const response = await fetch('http://localhost:3000/logout', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        const data = response.json()
        updateUser()
        navigate("/")
    }
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
         New Post go to link <Link to="/newpost"> new post </Link>
        </p>
     </header>
        <DanceVideosBoard
        video_results={danceVideos}
        />
        </div>
      )
}
export default Main;