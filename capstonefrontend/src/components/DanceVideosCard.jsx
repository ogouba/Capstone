import "./DanceVideosCard.css";
import { useState } from "react";
// import Modal from "./Modal.jsx";

function DanceVideosCard(props){
    const [modalOpened, setModalOpened] = useState(false);
    const openModal = () => {
        setModalOpened(true);
    };
    const closeModal = () => {
        setModalOpened(false);
    };
    return (
        <>
            <div className="videoCard" onClick={openModal}>
                <iframe id="videoUrl" src={props.video_link} />
                <h2 className="videoTitle">{props.title}</h2>
                <h3 id="videoDate"> {props.date} </h3>
                <h3 id="videoDisplayed_link"> {props.diplayed_link}</h3>
            </div>
            {/* <div
                style={{
                    color: "white",
                    display: modalOpened ? "block" : "none",
                }}
            >
                <Modal
                    id={props.position}
                    close={closeModal}
                    movie_title={props.title}
                    movie_releaseDate={props.date}
                />
            </div> */}
        </>
    );                     
}
export default DanceVideosCard


