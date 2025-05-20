import React, { useState } from "react";
import { useClassData, ClassRecord } from "@/localStorage-context/classDataProvider";
import { useAuth } from "@/localStorage-context/auth";
import Section from "@/components/general-components/Section";
import TutorClassCard from "./TutorClassCard";
import { Button } from "../ui/button";

const TutorJobList = () => {
    
    // useState solely used to force re-render of component 
    const [rerenderCounter, setrerenderCounter] = useState(0)

    const  { isAuthenticated, getCurrentUser } = useAuth();
    // get current user
    const currUser = getCurrentUser();
    
    // return error card if not authenticated 
    if (!isAuthenticated || !currUser) {
        return (
        <Section title="Not Authenticated">
            <p className="text-red-500"> User is not authenticated.</p>
        </Section>
        )
    }

    //TODO fix conditional react hook usage

    // get user email 
    const email = currUser.email;

    const { getClassRecords, rejectApplication } = useClassData();
    // get class records
    const classRecords: ClassRecord = getClassRecords();
    // create a list of course codes for classes they have applied for 
    const courseCodes: string[] = [];  

    // loop through the class records course codes
    for (const courseCode in classRecords) {
        // check if the user is not tutoring
        if (!classRecords[courseCode].tutorEmails.includes(email)) {
            // check if the user has applied
            if (classRecords[courseCode].tutorsApplied.includes(email)) {
                // if the user has applied add it to the list
                courseCodes.push(courseCode);
            }
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


    const handleCancellation = (courseCode: string) => {
        if (!courseCodes.includes(courseCode)) {
            return alert("Course code not found");
        }

        // check if the user has already applied
        if (!classRecords[courseCode].tutorsApplied.includes(email)) {
            return alert("You have not applied for this course");
        }
        // check if the user is already tutoring
        if (classRecords[courseCode].tutorEmails.includes(email)) {
            return alert("You are already tutoring this course");
        }
        // finally remove application 
        const noError: boolean = rejectApplication(courseCode, email);

        // if an error within the addApplication function occurs display an error message
        if (!noError) {
            return alert("Error cancelling application for course");
        }

        // use useState to force a re-render
        setrerenderCounter(rerenderCounter + 1);
    }


    // returns a list of cards for each matching course 
    return (
        <>
            {
                courseCodes.map((courseCode) => {
                    return (
                        <TutorClassCard courseCode={courseCode} key = {courseCode}>
                            <p className="mt-4 mb-4"><i> You have applied to this course</i> </p>
                            <p className="mt-4 mb-4">Click to <b>cancel appliation</b></p>
                            <Button onClick={() => handleCancellation(courseCode)}> Cancel Application </Button>
                        </TutorClassCard>
                    );
                })
            }
        
        </>
    );
};

export default TutorJobList;
