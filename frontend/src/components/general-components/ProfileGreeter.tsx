import React from "react";
import { useAuth, User } from "@/localStorage-context/auth";

const ProfileGreeter = () => {
    const {getCurrentUser} = useAuth();
    const userData: User | null= getCurrentUser();

    const getGreeting = () => {
        const hour: number = new Date().getHours();

        if (hour <= 12) {
            return "Good Morning"
        }
        else if (hour <= 17) {
            return "Good Afternoon"
        }
        else {
            return "Good Evening"
        }
    }
    if (userData === null) {return (<></>)}

    return (

        <h2>
            {getGreeting() + ", "}
            {userData.firstName}
        </h2>
    )

}

export default ProfileGreeter;