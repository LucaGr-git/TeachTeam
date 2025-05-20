import React from "react";

import  { Button } from "../ui/button";
import { useAuth } from "../../localStorage-context/auth";
import { useRouter } from "next/router";
import Image from "next/image";

// interface for the header
interface HeaderProps {
  children?: React.ReactNode; // optional added children inside the header
}

const Header = ({children}: HeaderProps ) => {
  const {logout} = useAuth();

  const router = useRouter();

  // handler for logout
  const handleLogout = () => {
    // logs out user then takes them to login page
    logout();
    router.push("/");
  };

  return (
    <header className="header">
      <div className="logo-title">
        <Image src="/teachteam.png" alt="TeachTeam Logo Image" width="21" height="31"/>
        <h1 className="text-xl">TeachTeam</h1>
      </div>
      

      {children}

      <div>
        <Button className="nav-link" variant="ghost" onClick={() => handleLogout()}>Sign out</Button>
      </div>
    </header>
  );
};

export default Header;
