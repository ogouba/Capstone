import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './DanceVideosBoard.css'
import DanceVideosCard from './DanceVideosCard.jsx'

function DanceVideosBoard(props) {
    useEffect(() => {
        console.log("HEY");
        console.log(props.video_results.video_results);
    }, []);

    return (
        <>
        {
            props.video_results == null || props.video_results.video_results == null ?
            <></> :
            <div className="videoList">
                {
                    props.video_results.video_results.map((dancevideo, index) => (
                            <DanceVideosCard
                                key={index}
                                id={dancevideo.position}
                                video_link={dancevideo.video_link}
                                title={dancevideo.title}
                                date={dancevideo.date}
                                displayed_link ={dancevideo.displayed_link}
                            />
                        ))
                    }
            </div>
        }
        </>
    )
}
export default DanceVideosBoard
    