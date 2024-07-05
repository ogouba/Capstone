import { useEffect, useState } from "react";

export const useAuth = () => {
    const [user, setUser] = useState();

    const updateUser = () => {
        fetch("http://localhost:3000/getUser", {
            method: "GET",
            credentials: "include",
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if (data.isLoggedIn) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        updateUser()
    }, []);
    return [user, updateUser];
};
