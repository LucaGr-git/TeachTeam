import React from "react";

interface NavListProps {
    title: string;
}

const NavList = ({title}: NavListProps) => {
    return (
        <h2 className="nav-link">
            {title}
        </h2>
    )
}

export default NavList;
