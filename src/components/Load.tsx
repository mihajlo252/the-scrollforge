import { useEffect } from "react";
import { useUserStore } from "../zustand/stores";

export const Load = () => {
 

    const { user, setUser }: UserStore = useUserStore();

    const currentUser: any = localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN);

    const setCurrentUser = () => {
        setUser(currentUser);
        console.log(JSON.parse(user));

    };

    useEffect(() => {
        setCurrentUser();
    }, []);

    return <div>Loading...</div>;
};
