import React, { useEffect, useState, useContext } from "react";

function Notifications() {
    const [notifications, setNotification] = useState({});
    useEffect(() => {
        let sse = new EventSource(`http://localhost:3000/sse/1`);
        sse.onmessage = (e) => {
            getUpdatedData(e);
        };

        sse.onerror = (e) => {
            console.error(e);
            sse.close();
            sse = new EventSource(`http://localhost:3000/sse/1`);
        };

        const getUpdatedData = async (e) => {
            const data = JSON.parse(e.data);
            setNotification(data);
        };
        return () => {
            sse.close();
        };
    }, []);
    return (
        <div>
            <h2> notifications </h2>
            <section className="notifications">
                {notifications !== null &&
                    notifications.video !== undefined && notifications.job !== undefined &&
                        <div key={notifications.video.videoSnippet}>
                            <p> {notifications.job}</p>
                            <a
                                className="videoList"
                                target="_blank"
                                href={`https://www.youtube.com/watch?v=${notifications.video.videoSnippet}`}
                            >
                                <img
                                    className="videoItem"
                                    src={notifications.video.thumbnail}
                                    alt={notifications.video.title}
                                />
                            </a>
                        </div>
                    }
            </section>
        </div>
    );
}
export default Notifications;
