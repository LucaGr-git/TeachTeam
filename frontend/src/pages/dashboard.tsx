// import the auth.tsx for authentication
import { useAuth } from "../database-context-providers/auth";


import React from "react"

import { Label } from "../components/ui/label";

import TutorDashboard from "../components/tutor-components/tutorDashboard";
import LecturerDashboard from "@/components/lecturer-components/lecturerDashboard";

export default function Dashboard() {
  // import context details 
  const { isAuthenticated, isLecturer} = useAuth();

  const showPage = () : React.ReactElement => {
    // returns the correct page (tutor page, lecturer page or not authenticated page)
    
    if (isAuthenticated){
      // if lecturer show lecturer page
      if (isLecturer){
        return(<>
          <LecturerDashboard></LecturerDashboard>
        </>);
      }
      // if tutor show tutor page
      else {
        return(<TutorDashboard></TutorDashboard>);
      }
    }
    // if not authenticated return error message
    else {
      return (
        <>
          <Label className="flex justify-center items-center h-screen text-6xl"> You will be redirected shortly </Label>
        </>)
    }
  }

  return (
    <>
      {showPage()}
    </>
  );
}
