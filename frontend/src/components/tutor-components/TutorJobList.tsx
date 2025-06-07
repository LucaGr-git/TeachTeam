import React from "react";
import { useClassData, ClassRecord } from "@/localStorage-context/classDataProvider";
import { useAuth } from "@/localStorage-context/auth";
import Section from "@/components/general-components/Section";
import TutorClassCard from "./TutorClassCard";


const TutorJobList = () => {

    const  { isAuthenticated, getCurrentUser } = useAuth();
    // get current user
    const currUser = getCurrentUser();

    const { getClassRecords } = useClassData();
    
    // return error card if not authenticated 
    if (!isAuthenticated || !currUser) {
        return (
        <Section title="Not Authenticated">
            <p className="text-red-500"> User is not authenticated.</p>
        </Section>
        )
    }
    
    // get user email 
    const email = currUser.email;

    
    // get class records
    const classRecords: ClassRecord = getClassRecords();
    // create a list of course codes for classes they are tutoring 
    const courseCodes: string[] = [];  

    // loop through the class records course codes
    for (const courseCode in classRecords) {
        // check if the user is tutoring  
        if (classRecords[courseCode].tutorEmails.includes(email)) {
            // if user is tutoring add it to the list
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
        <>
            {
                courseCodes.map((courseCode) => {
                    return (
                        <TutorClassCard courseCode={courseCode} key={courseCode}>
                            <p className="mt-4 mb-4"><i> You are tutoring this course </i> </p>
                        </TutorClassCard>
                    );
                })


            }
        
        </>
    );
};

export default TutorJobList;
