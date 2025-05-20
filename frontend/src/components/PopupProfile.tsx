import React from "react";

interface PopupProfileProps {
    // Props for popup
    buttonPopup: boolean,
    setTrigger: (value: boolean) => void
}

const PopupProfile = ({
    buttonPopup
    }: PopupProfileProps) => {
        
    return (buttonPopup) ? (
        <div>
        
        </div>   
    )
    : (<></>)
}

export default PopupProfile;