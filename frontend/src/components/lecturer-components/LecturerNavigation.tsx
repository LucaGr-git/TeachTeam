import React from "react";
import NavList from "../general-components/NavList";
import ProfileGreeter from "../general-components/ProfileGreeter";
import { useAuth } from "@/database-context-providers/auth";
import { useClassData, ClassRecord} from "@/database-context-providers/classDataProvider";
import TagDisplay from "../general-components/TagDisplay";


const LecturerNavigation = () => {

  const { getCurrentUser, isAuthenticated, isLecturer} = useAuth();
  
  const { getClassRecords } = useClassData();

  // get the current user
  const currentUser = getCurrentUser();

  // check if user is authenticated 
  if (!isAuthenticated || !currentUser || !isLecturer) {
    return null;
  }

  // get array of classes that the lecturer is lecturing
  const lecturerClasses: string[] = [];

  // get the class records
  const classesLecturing: ClassRecord = getClassRecords();

  // loop through all courseCodes
  for (const courseCode in classesLecturing) {
    // if the course is being lectured by the current lecturer it is added to the array
    if (classesLecturing[courseCode].lecturerEmails.includes(currentUser.email)) {
      const classData = classesLecturing[courseCode];
      const classInfo = classData.courseCode + " | " + classData.courseTitle;
      // if the classInfo is too long, snip off the end
      if (classInfo.length > 30) {
        lecturerClasses.push(classInfo.substring(0, 30) + "...");
      } 
      else {
        lecturerClasses.push(classInfo);
      }

    }
  }
  

  

  return (
    <nav className="nav">
      <ul className="nav-list">
        <ProfileGreeter/>
        <NavList title="Your Classes"/>
        <TagDisplay tags={lecturerClasses} fullWidth></TagDisplay>

      </ul>
    </nav>
  );
};


export default LecturerNavigation;
