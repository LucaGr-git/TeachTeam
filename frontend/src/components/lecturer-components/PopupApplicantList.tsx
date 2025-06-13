import React from "react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import Section from "../general-components/Section";

import { useClassData } from "@/database-context-providers/classDataProvider";
import { useAuth } from "@/database-context-providers/auth";
import { useUserData } from "@/database-context-providers/userDataProvider";
import ApplicantCard from "../general-components/ApplicantCard";
import TagDisplay from "../general-components/TagDisplay";
import { Experience } from "@/types/types";
import { Badge } from "../ui/badge";

interface PopupApplicantListProps {
    // Props for popup
    buttonPopup: boolean,
    setTrigger: (value: boolean) => void,

    courseCode: string
}

interface ApplicantInfo {
    tutorName: string;
    courseName: string[];
    availability: string;
    skills: string[];
    qualifications: string[]
    experience: Experience[];
    shortListed: boolean;
    email: string;
    isLabAssistant: boolean;
}

const PopupApplicantList = ({
    buttonPopup,
    setTrigger,
    courseCode}: PopupApplicantListProps) => {

    // usestate for rerendering the component
    const [rerenderCounter, setRerenderCounter] = useState<number>(0);

    // usestate for whether only non-shortlisted applicants should be shown
    const [shortlistOnly, setShortlistOnly] = useState<boolean>(false);

    // Get the records from local storage
    const { addToShortlist, removeFromShortlist, rejectApplication, classRecords, fetchTutorApplication} = useClassData();
    const {getUser, getUserExperiences, getUserQualifications, getUserSkills} = useUserData();
    const { getCurrentUser} = useAuth();

    const [applicantList, setApplicantList] = useState<ApplicantInfo[]>([]);

    
    const getApplication = async(email: string) => {
        const data = await fetchTutorApplication(courseCode, email)
        return data;
        
    }

    useEffect(() => {
    const fetchApplicants = async () => {
        const applicants: ApplicantInfo[] = [];

        if (classRecords != null){
        for (const tutor of classRecords[courseCode].tutorsApplied) {
            const currApplicant = await getUser(tutor);
            const userExperience = await getUserExperiences(tutor);
            const userQualification = await getUserQualifications(tutor);
            const userSkills = await getUserSkills(tutor);
            const shortlisted = classRecords[courseCode].tutorsShortlist.some(tutorData => tutorData.tutorEmail === tutor);
            const application = await getApplication(tutor);

            if (application && !currApplicant.isLecturer) {
                const newApplicant: ApplicantInfo = {
                    tutorName: currApplicant.firstName,
                    courseName: [classRecords[courseCode].courseTitle],
                    availability: currApplicant.fullTime ? "Full time" : "Part time",
                    skills: userSkills.map(s => s.skill),
                    qualifications: userQualification.map(q => q.qualification),
                    experience: userExperience,
                    shortListed: shortlisted,
                    email: currApplicant.email,
                    isLabAssistant: application.isLabAssistant
                    
                };
                applicants.push(newApplicant);
            }
        }
    }

        setApplicantList(applicants);
    };

    fetchApplicants();
}, [classRecords, courseCode, rerenderCounter]);



    if (!classRecords) {
        return (
        <Section title="Error">
            <p className="text-red-500">Failed to load class records.</p>
        </Section>
        );
  }

    const currUser = getCurrentUser();

    // if the user is not logged in return a message
    if (!currUser){
        return (
        <>
            <h1> User not Logged in </h1>
        </>);
    }
    
    // See if user is lecturing the course 
    const lecturingThisCourse: boolean = classRecords[courseCode].lecturerEmails.includes(currUser?.email);
    
    // function for adding to shortlist
    const handleShortlist = async(email: string) => {
        // check if user is shortlisted
        const shortlisted = classRecords[courseCode].tutorsShortlist.some(tutor => tutor.tutorEmail === email);
        
        // if user is shortlisted remove them from the shortlist
        if (shortlisted) {
            
            if (await removeFromShortlist(courseCode, email)) {
                // rerender
                setRerenderCounter(rerenderCounter + 1);
            }
            else{
                alert ("Error: Could not remove from shortlist");
            }
        } 
        else {
            // if user is not shortlisted add them to the shortlist
            if (await addToShortlist(courseCode, email)) {
                // rerender
                setRerenderCounter(rerenderCounter + 1);
            }
            else{
                alert ("Error: Could not add to shortlist");
            }
        
        }
    }

    // function for rejecting applicants
    const handleRejection = async (email: string) => {
        // check if user is shortlisted
        const shortlisted = classRecords[courseCode].tutorsShortlist.some(tutor => tutor.tutorEmail === email);
        
        // cannot remove shorltisteed applicants without first removing form shortlist
        if (shortlisted) {
            
            alert("That applicant is shortlisted, please remove from shortlist before rejecting applicant")
        } 
        else {
            if (await rejectApplication(courseCode, email) == true){

                // rerender if rejection is successful
                setRerenderCounter(rerenderCounter + 1);
            }
            else {
                alert("There was an issue rejecting that applicant");
            }
        
        }
    }

    // only the shortlisted applicants
    const shortlist = applicantList.filter(applicant => 
        classRecords[courseCode].tutorsShortlist.some(tutor => tutor.tutorEmail === applicant.email))
    

    return (buttonPopup) ? (
        <div className="popup-overlay z-100" onClick={() => setTrigger(false)}>
        <div className="popup-content-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="popup-title">View Applicants</h2>

            <Button 
                className="mt-3 mb-3 ml-3"
                type="button" 
                variant="outline"
                onClick={() => setShortlistOnly(!shortlistOnly)} >
                    {(shortlistOnly)? "Show All Applicants": "Show Shortlisted Only"}
            </Button> 

            <div className="overflow-auto max-h-[70vh]">
            <div className="mt-4 space-y-2">
                {applicantList.map((applicant, index) => 
                    {
                        // if are not a shortlisted applicant only show if shortlistOnly state is true 
                        if (!shortlistOnly || shortlist.includes(applicant)){
                            
                            return <ApplicantCard 
                                tutorName = {applicant.tutorName}
                                courseName = {applicant.courseName}
                                availability = {applicant.availability}
                                skills = {applicant.skills}
                                qualifications = {applicant.qualifications}
                                experience = {applicant.experience}
                                key = {index}>
                        <div className="w-max">
                        <Badge className = "mt-4 mb-4">{((applicant.isLabAssistant) ? "Lab Assistant":"Tutor")}</Badge>
                        </div>
                        {(lecturingThisCourse)? 
                        // if lecturing the course show the option to shortlist
                        (
                            <>
                                <Button 
                                    key = {`shortlist-${applicant.email}`} 
                                    type="button" 
                                    onClick={() => handleShortlist(applicant.email)} 
                                    variant={(!applicant.shortListed)? "default": "destructive"}>
                                        {(!applicant.shortListed)? "Add to shortlist": "Remove from shortlist"}
                                </Button> 
                                {(!applicant.shortListed)? 
                                    // if applicant is not shortlisted show option to reject application 
                                    <Button 
                                        className="ml-5"
                                        key = {`reject-${applicant.email}`} 
                                        type="button" 
                                        onClick={() => handleRejection(applicant.email)} 
                                        variant="destructive">
                                            Reject Applicant
                                    </Button>  : 
                                    <></>
                                }
                            </>) : 
                        // otherwise show nothing
                        (<></>)}
                        

                        </ApplicantCard>
                    }})}

            {
            // if the applicant list filtered by 
            (applicantList.length === 0)? 
                <TagDisplay tags={[]}></TagDisplay> : <></>}
            </div>
            </div>
            
            <button className="close-form-button" type="button" onClick={() => setTrigger(false)}>Cancel</button>
        </div>
        </div>
    )
    : (<></>)
}

export default PopupApplicantList;