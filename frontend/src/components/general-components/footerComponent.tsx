import React from "react";

const FooterComponent = () => {
  return (
    <>
      <footer className="footer w-full bg-primary p-4 bottom-0 left-0 flex flex-row">
            <p>&copy; {new Date().getFullYear()} TeachTeam. All rights reserved.</p>
      </footer>
    </>
  );
};

export default FooterComponent;
