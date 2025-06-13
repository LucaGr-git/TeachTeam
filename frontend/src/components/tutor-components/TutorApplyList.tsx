import React, { useState } from "react";
import { useClassData } from "@/database-context-providers/classDataProvider";
import { useAuth } from "@/database-context-providers/auth";
import Section from "@/components/general-components/Section";
import TutorClassCard from "./TutorClassCard";
import { Button } from "../ui/button";

const TutorApplyList = () => {
    
    // useState solely used to force re-render of component 
    const [rerenderCounter, setrerenderCounter] = useState(0)

    const  { isAuthenticated, getCurrentUser } = useAuth();

    const { addApplication, classRecords} = useClassData();
    
    // get current user
    const currUser = getCurrentUser();
    
    // return error card if not authenticated 
    if (!isAuthenticated || !currUser) {
        return (
        <Section title="Not Authenticated">
            <p className="text-destructive"> User is not authenticated.</p>
        </Section>
        )
    }
    if (!classRecords) {
    return (
      <Section title="Error">
        <p className="text-red-500">Failed to load class records.</p>
      </Section>
    );
  }


    // get user email 
    const email = currUser.email;

    
    // get class records
    // create a list of course codes for classes they are not tutoring or have not already applied to 
    const courseCodes: string[] = [];  

    // loop through the class records course codes
    for (const courseCode in classRecords) {
        // check if the user is not tutoring already 
        if (!classRecords[courseCode].tutorEmails.includes(email)) {
            // check if the user has not already applied
            if (!classRecords[courseCode].tutorsApplied.includes(email)) {
                // if it is a valid class to apply for add it ot 
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

    

    const handleApply = async(courseCode: string, isLabAssistant: boolean) => {
        if (!courseCodes.includes(courseCode)) {
            return alert("Course code not found");
        }

        // check if the user has already applied
        if (classRecords[courseCode].tutorsApplied.includes(email)) {
            return alert("You have already applied for this course");
        }
        // check if the user is already tutoring
        if (classRecords[courseCode].tutorEmails.includes(email)) {
            return alert("You are already tutoring this course");
        }

        // get application

        // finally add application 
        const noError: boolean = await addApplication(courseCode, email, isLabAssistant);

        // if an error within the addApplication function occurs display an error message
        if (!noError) {
            return alert("Error applying for course");
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
                        <TutorClassCard courseCode={courseCode} key={courseCode}>
                            <p className="mt-4 mb-4">Click to <b>quick apply</b></p>
                            <Button className="mr-2" onClick={() => handleApply(courseCode, false)}> Quick Apply (Tutor) </Button>
                            <Button className="ml-2" onClick={() => handleApply(courseCode, true)}> Quick Apply (Lab Assistant) </Button>
                        </TutorClassCard>
                        
                    );
                })


            }
        
        </>
    );
};

export default TutorApplyList;
