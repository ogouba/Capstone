import { useState, useEffect, useContext } from "react";

function Reccommended() {
    const [recommendedVideos, setRecommendedVideos] = useState([]);

    useEffect(() =>{
        const fetchRecommendedVideos = async () => {
            const response = await fetch('http://localhost:3000/getRecommendedVideos');
            const data = await response.json();
            setRecommendedVideos(data);    
        };
        fetchRecommendedVideos();      
    }, []);
}
export default Reccommended()
