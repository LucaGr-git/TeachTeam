import React from "react";
import { useClassData, ClassRecord } from "@/localStorage-context/classDataProvider";
import { useAuth } from "@/localStorage-context/auth";
import Section from "@/components/general-components/Section";
import LecturerClassPopup from "./LecturerClassPopup";


// props needed to view lecturer classes
interface LecturerViewClassesProps {
    viewAll?: boolean; // boolean for whether all classes should be shown or just lecturers classes
}

const LecturerViewClasses = ({viewAll=false}:LecturerViewClassesProps) => {
    
    const { getClassRecords } = useClassData();


    const  { isAuthenticated, isLecturer, getCurrentUser } = useAuth();
    // get current user
    const currUser = getCurrentUser();
    
    // return error card if not authenticated 
    if (!isAuthenticated || !currUser || !isLecturer) {
        return (
        <Section title="Not Authenticated">
            <p className="text-destructive"> User is not authenticated.</p>
        </Section>
        )
    }

    // create a list of course codes for classes they are lecturing
    const courseCodes: string[] = [];

    // get user email 
    const email = currUser.email;

    
    // get class records
    const classRecords: ClassRecord = getClassRecords();
    

    // loop through the class records course codes
    for (const courseCode in classRecords) {
        // if the user is lecturing add the course code or if all classes are viewed add the course
        if (viewAll || classRecords[courseCode].lecturerEmails.includes(email)) {
            // if user is lecturing add the course code 
            courseCodes.push(courseCode);
        }
    }

    
    



    // if there are no course codes return an error message
    if (courseCodes.length === 0) {
        return (
            <Section title="No classes available">
                <p className="text-red-500"> No classes available.</p>
            </Section>
        )
    };


    // returns a list of cards for each matching course 
    return (
        <div>
            {
                courseCodes.map((courseCode) => {
                    return (<LecturerClassPopup courseCode={courseCode} key={courseCode}/>);
                })
            }
        
        </div>
    );
};

export default LecturerViewClasses;
