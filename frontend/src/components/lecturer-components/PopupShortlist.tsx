import React from "react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import Section from "../general-components/Section";

import { useClassData, ClassRecord } from "@/database-context-providers/classDataProvider";
import { useAuth } from "@/database-context-providers/auth";
import { UserRecord, useUserData, localStorageExperienceData } from "@/database-context-providers/userDataProvider";
import ApplicantCard from "../general-components/ApplicantCard";
import TagDisplay from "../general-components/TagDisplay";
import NavList from "../general-components/NavList";
import { ChevronDown, ChevronDownCircle, ChevronUp, ChevronUpCircle } from "lucide-react";
import LecturerViewNotes from "./LecturerViewNotes";
import { LecturerShortlist } from "@/types/types";

interface PopupShortlistProps {
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
    experience: localStorageExperienceData[];
    shortListed: boolean;
    email: string;
}

const PopupShortlist = ({
    buttonPopup,
    setTrigger,
    courseCode}: PopupShortlistProps) => {

    
    // Get the records from local storage
    const {getClassRecords, removeFromShortlist, acceptApplication, fetchAllLecturerShortlists, orderLecturerShortList, classRecords} = useClassData();
    const {getUserRecords, getUser, getUserExperiences, getUserQualifications, getUserSkills} = useUserData();
    const {getUsers, getCurrentUser, isAuthenticated, isLecturer} = useAuth();
    
    // get user data
    const [shortList, setShortlist] = useState<ApplicantInfo[]>([]);

    const [shortlistArray, setApplicantList] = useState<ApplicantInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
    const fetchApplicants = async () => {
        const applicants: ApplicantInfo[] = [];

        if (classRecords != null) {
        // Fetch the full shortlist with ranks & lecturers
            const fullShortlist: LecturerShortlist[] = await fetchAllLecturerShortlists();

            // Filter for this course and lecturer, then sort by rank ascending
            const filteredShortlist = fullShortlist
                .filter(entry => entry.courseCode === courseCode && entry.lecturerEmail === currEmail)
                .sort((a, b) => a.rank - b.rank);       

            for (const shortlistEntry of filteredShortlist) {
                const tutor = shortlistEntry.tutorEmail;
                const currApplicant = await getUser(tutor);
                const userExperience = await getUserExperiences(tutor);
                const userQualification = await getUserQualifications(tutor);
                const userSkills = await getUserSkills(tutor);
                const shortlisted = classRecords[courseCode].tutorsShortlist.some(tutorData => tutorData.tutorEmail === tutor);

                if (!currApplicant.isLecturer) {
                    const newApplicant: ApplicantInfo = {
                        tutorName: currApplicant.firstName,
                        courseName: [classRecords[courseCode].courseTitle],
                        availability: currApplicant.fullTime ? "Full time" : "Part time",
                        skills: userSkills.map(s => s.skill),
                        qualifications: userQualification.map(q => q.qualification),
                        experience: userExperience,
                        shortListed: shortlisted,
                        email: currApplicant.email,
                    };
                    applicants.push(newApplicant);
                }
            }
        }

        setApplicantList(applicants);
        setLoading(false);
    };

    fetchApplicants();
}, [classRecords, courseCode]);
    

    if (!classRecords) {
        return (
        <Section title="Error">
            <p className="text-red-500">Failed to load class records.</p>
        </Section>
        );
    }

    const userData: UserRecord = getUserRecords();
    const userList = getUsers();
    //get current user email
    const currUser = getCurrentUser();
    if (currUser == null || !isAuthenticated || !isLecturer){
        return null;
    }
    const currEmail = currUser.email;

    // shortlist that will be checked through 
    let lecturersShortlist = classRecords[courseCode].lecturerShortlist[currEmail];
    
    // See if user is lecturing the course 
    const lecturingThisCourse: boolean = classRecords[courseCode].lecturerEmails.includes(currEmail);

    // if the user is not a lecturer of this course use the default shortlist not a ranked shortlist
    if (!lecturingThisCourse){
        lecturersShortlist = classRecords[courseCode].tutorsShortlist.map((tutor) => tutor.tutorEmail);
    }
    // if the user is a lecturer ensure that their shortlist ahs been initialized
    
    
    // if (lecturersShortlist){ // if the shortlist is empty/undefined it is not iteratable
    //     for (const tutor of lecturersShortlist) {
    //         const currApplicant = userList[tutor];
    //         const currUserData = userData[tutor];

    //         if (currApplicant && !currApplicant.isLecturer) {
    //             const newApplicant: ApplicantInfo = {
    //                 tutorName: currApplicant.firstName,
    //                 courseName: [course.courseTitle],
    //                 availability: ((currUserData.fullTime)? "Full time":"Part time"),
    //                 skills: currUserData.skills,
    //                 qualifications: currUserData.qualifications,
    //                 experience: currUserData.experience,
    //                 shortListed: true,
    //                 email: currApplicant.email,
    //             }
    //             shortlistArray.push(newApplicant);
    //         } 
    //     }
    // }
    

    
    
    
    

    
    const removeShortlist = async(email: string) => {
        // check if user is shortlisted
        const shortlisted = classRecords[courseCode].tutorsShortlist.some(tutor => tutor.tutorEmail === email);
        
        // if user is shortlisted remove them from the shortlist
        if (shortlisted) {
            
            if (await removeFromShortlist(courseCode, email)) {
                // rerender via useState
                setShortlist ( shortList.filter((applicant) => {
                    return (applicant.email !== email);
                }));
            }
            else{
                alert ("Error: Could not remove from shortlist");
            }
        } 
        else {
            alert ("Error: Not part of shortlist");
        }
    }

    const acceptApplicant = async(email: string) => {
        // check if user is shortlisted
        const shortlisted = classRecords[courseCode].tutorsShortlist.some(tutor => tutor.tutorEmail === email);
        
        // if user is shortlisted accept Applicant
        if (shortlisted) {
            if (await acceptApplication(courseCode, email)){
                // rerender
                setShortlist ( shortList.filter((applicant) => {
                    return (applicant.email !== email);
                }));
            }
            else {
                alert("Error: There was an error accepting that applicant");
            }
        } 
        else {
            alert ("Error: Not part of shortlist, must be in the shortlist to accept");
        }
    }

    const toTopShortlist = async(email: string) => {
        // check if user is shortlisted
        const shortlisted = classRecords[courseCode].tutorsShortlist.some(tutor => tutor.tutorEmail === email);
        
        // if user is shortlisted move their position to top
        if (shortlisted) {
            // move the tutor email from it's position to the given position
            // get current position
            const currPos = classRecords[courseCode].lecturerShortlist[currEmail].indexOf(email);
            // if it is already at the first position no need to move it
            if (currPos === 0) {
                return;
            }
            if (currPos == -1) {
                return alert("Error: tutor not in array");
            }
            
            if (await orderLecturerShortList(courseCode, email, currEmail, 0)) {
                // rerender via useState
                // use a temporary shortList variable rather tanh shortlist itself to render properly
                const tempShortList = [...shortList];
                const [movedTutor] = tempShortList.splice(currPos, 1);
                tempShortList.splice(0, 0, movedTutor);
                setShortlist(tempShortList);
            }
            else{
                alert ("Error: Could not change order of shortlist");
            }
        } 
        else {
            alert ("Error: Not part of shortlist");
        }
    }
    
    const toBottomShortlist = async(email: string) => {
        // check if user is shortlisted
        const shortlisted = classRecords[courseCode].tutorsShortlist.some(tutor => tutor.tutorEmail === email);
        
        // if user is shortlisted move their position to top
        if (shortlisted) {
            // move the tutor email from it's position to the given position
            // get current position
            const currPos = classRecords[courseCode].lecturerShortlist[currEmail].indexOf(email);
            // get current length
            const endPos = classRecords[courseCode].lecturerShortlist[currEmail].length - 1;
            // if it is already at the first position no need to move it
            if (currPos === endPos ){
                return;
            }
            if (currPos == -1) {
                return alert("Error: tutor not in array");
            }
            
            if (await orderLecturerShortList(courseCode, email, currEmail, endPos)) {
                // rerender via useState
                // use a temporary shortList variable rather tanh shortlist itself to render properly
                const tempShortList = [...shortList];
                const [movedTutor] = tempShortList.splice(currPos, 1);
                tempShortList.splice(endPos, 0, movedTutor);
                setShortlist(tempShortList);
            }
            else{
                alert ("Error: Could not change order of shortlist");
            }
        } 
        else {
            alert ("Error: Not part of shortlist");
        }
    }
    const bumpShortlisted = async(email: string, bumpDown:boolean = false) => {
        // check if user is shortlisted
        const shortlisted = classRecords[courseCode].tutorsShortlist.some(tutor => tutor.tutorEmail === email);
        
        // if user is shortlisted move their position to top
        if (shortlisted) {
            // move the tutor email from it's position to the given position
            // get current position
            const currPos = classRecords[courseCode].lecturerShortlist[currEmail].indexOf(email);
            // get current length
            const length = classRecords[courseCode].lecturerShortlist[currEmail].length - 1;
            // get end position length
            const endPos = currPos + ((bumpDown)? 1 : -1);
            // if it is at the end or start of list nothing happens
            if (endPos > length || endPos < 0){
                return;
            }
            if (currPos == -1) {
                return alert("Error: tutor not in array");
            }
            
            if (await orderLecturerShortList(courseCode, email, currEmail, endPos)) {
                // rerender via useState
                // use a temporary shortList variable rather tanh shortlist itself to render properly
                const tempShortList = [...shortList];
                const [movedTutor] = tempShortList.splice(currPos, 1);
                tempShortList.splice(endPos, 0, movedTutor);
                setShortlist(tempShortList);
            }
            else{
                alert ("Error: Could not change order of shortlist");
            }
        } 
        else {
            alert ("Error: Not part of shortlist");
        }
    }
    

    return (buttonPopup) ? (
        <div className="popup-overlay z-100" onClick={() => setTrigger(false)}>
        <div className="popup-content-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="popup-title">Candidate Shortlist</h2>
            <div className="overflow-auto max-h-[80vh]">
            <div className="mt-4 space-y-2">
                {shortlistArray.map((applicant, index) => 
                    {return <ApplicantCard 
                        tutorName = {applicant.tutorName}
                        courseName = {applicant.courseName}
                        availability = {applicant.availability}
                        skills = {applicant.skills}
                        qualifications = {applicant.qualifications}
                        experience = {applicant.experience}
                        key = {applicant.email}
                    >
                    {(lecturingThisCourse? (
                        // if not lecturing the course extra details like notes are not rendered
                        <>
                        <div className="mb-3">
                            {/* <LecturerViewNotes courseCode={courseCode} tutorEmail={applicant.email}></LecturerViewNotes> */}
                        </div>
                        <Button 
                            key = {applicant.email + "remove"} 
                            type="button" 
                            onClick={() => removeShortlist(applicant.email)} 
                            variant={"destructive"}>
                                Remove from global shortlist
                        </Button> 
                        <Button 
                            className="ml-4"
                            key = {applicant.email + "accept"} 
                            type="button" 
                            onClick={() => acceptApplicant(applicant.email)}>
                                Accept Applicant as Tutor!
                        </Button> 
                        <div className="flex flex-row justify-evenly rounded-2xl bg-accent mt-3">
                            <div className="mt-4 mb-3">
                                <NavList title={`Position: ${index + 1}`}></NavList>
                            </div>
                            <Button 
                                className="mt-3 mb-3"
                                type="button" 
                                onClick={() => bumpShortlisted(applicant.email, true)} >
                                    <ChevronDown></ChevronDown>
                            </Button> 
                            <Button 
                                className="mt-3 mb-3"
                                type="button" 
                                onClick={() => toBottomShortlist(applicant.email)} >
                                    <ChevronDownCircle></ChevronDownCircle>
                            </Button> 
                            <Button 
                                className="mt-3 mb-3"
                                type="button" 
                                onClick={() => bumpShortlisted(applicant.email, false)} >
                                    <ChevronUp></ChevronUp>
                            </Button> 
                            <Button 
                                className="mt-3 mb-3"
                                type="button" 
                                onClick={() => toTopShortlist(applicant.email)} >
                                    <ChevronUpCircle></ChevronUpCircle>
                            </Button> 

                        </div>
                        </>): 
                        // don't render anything regarding the shortlists details to non lecturers of this course
                        (<></>
                        ))}
                    
                    </ApplicantCard>})}

            {(shortList.length === 0)? <TagDisplay tags={[]}></TagDisplay> : <></>}
            </div>
            </div>
            
            <button className="close-form-button" type="button" onClick={() => setTrigger(false)}>Cancel</button>
        </div>
        </div>
    )
    : (<></>)
}

export default PopupShortlist;