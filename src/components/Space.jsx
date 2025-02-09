import { useState, useEffect } from "react";
import axios from "axios";
import { useSpace } from "../contexts/SpaceContext";

export default function Space({ SpCode }) {
    const [spaceName, setSpaceName] = useState("Loading...");
    const { userName } = useSpace();

    const BASE_URL = "https://azign-backend.onrender.com";

    useEffect(() => {
        if (!SpCode) return; // Prevent unnecessary API calls

        const fetchSpaceName = async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/api/space/${SpCode}`);
                setSpaceName(data?.name || "Unknown Space");
            } catch (error) {
                console.error("Error fetching space name:", error);
                setSpaceName("Unknown Space");
            }
        };

        fetchSpaceName();
    }, [SpCode]);

    const Greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning !";
        if (hour < 18) return "Good Afternoon !";
        return "Good Evening !";
    }

    return (
        <>
        <div className="form-container">
            <h1> Welcome to {spaceName}</h1>
            <div className="greeting"><strong>{Greeting()}</strong>,  {userName}</div>
        </div>
        </>
    );
}