import { useState, useEffect } from "react";
function OtherPeopleProfile({ searchQuery }) {
    const [users, setUsers] = useState([]);
    const otherUserVideos = async (searchQuery) => {
        const response = await fetch(
            "http://localhost:3000/OtherUserVideos?q=" + searchQuery,
            {
                method: "GET",
                credentials: "include",
            }
        );
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setUsers(data);
    };
    useEffect(() => {
        otherUserVideos(searchQuery);
    }, [searchQuery]);

    return (
        <div>
            {users.map((user) => {
                return (
                    <div key={user.email}>
                        <h1>{user.username}</h1>
                        <ul>
                            {user.videos.map((video) => (
                                <li key={video.id}>
                                    <video
                                        src={video.videoData.url}
                                        controls
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}

export default OtherPeopleProfile;
