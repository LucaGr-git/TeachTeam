import React, { useState } from "react";
import { useClassData, ClassRecord } from "@/localStorage-context/classDataProvider";
import { useAuth } from "@/localStorage-context/auth";
import { UserRecord, useUserData, experienceData } from "@/localStorage-context/userDataProvider";
import SearchBar from "./SearchBar";
import ApplicantCard from "../general-components/ApplicantCard";
import LecturerSort from "./LecturerSort";


export interface ApplicantInfo {
    tutorName: string;
    courseName: string[];
    availability: string;
    skills: string[];
    qualifications: string[]
    experience: experienceData[];
    email: string;
}


const LecturerSearch = () => {
    //useState hook to return the tutor profile information
    const [results, setResults] = useState<ApplicantInfo[]>([]);
    //useState hook to return the filtered tutor profile information
    const [filteredResults, setFilteredResults] = useState<ApplicantInfo[]>([]);

    const applicantList: ApplicantInfo[] = [];

    // Get the ClassRecords from local storage
    const {getClassRecords} = useClassData();
    const {getUserRecords} = useUserData();
    const {getUsers} = useAuth();

    const classRecords: ClassRecord = getClassRecords();
    const userData: UserRecord = getUserRecords();
    const userList = getUsers();
    
    for (const email in userList) {
        const currApplicant = userList[email];
        const currUserData = userData[email]
        const courseNames: string[] = [];
        
        for (const classcode in classRecords) {
            const currentClass = classRecords[classcode]
            if (currentClass.tutorsApplied.includes(email)) {
                courseNames.push(currentClass.courseTitle);
            }
        }

        if (!currApplicant.isLecturer) {
            const newApplicant: ApplicantInfo = {
                tutorName: currApplicant.firstName,
                courseName: courseNames,
                availability: ((currUserData.fullTime)? "Full time":"Part time"),
                skills: currUserData.skills,
                qualifications: currUserData.qualifications,
                experience: currUserData.experience,
                email: currApplicant.email,
            }
            applicantList.push(newApplicant);
        }
    }

     // Search function
     const searchItems = (applicants: ApplicantInfo[], searchTerm: string): ApplicantInfo[] => {
        return applicants.filter(applicant => 
            // Check if any string or array of strings contains the search term
            applicant.tutorName.toLowerCase().replace(/ /g, "").includes(searchTerm.toLowerCase().replace(/ /g, "")) ||
            applicant.availability.toLowerCase().replace(/ /g, "").includes(searchTerm.toLowerCase().replace(/ /g, "")) ||
            applicant.courseName.some(course => course.toLowerCase().replace(/ /g, "").includes(searchTerm.toLowerCase().replace(/ /g, ""))) ||
            applicant.skills.some(skill => skill.toLowerCase().replace(/ /g, "").includes(searchTerm.toLowerCase().replace(/ /g, "")))
        );
    }

    const handleSearch = (query: string) => {
        const results: ApplicantInfo[] = searchItems(applicantList, query)
        setResults(results);
    }

    
    
    return (
        <div>
        <div className="search-bar">
            <SearchBar onSearch={handleSearch}/>
            <LecturerSort 
                results={results} 
                setFilteredResults={setFilteredResults} 
                filteredResults={filteredResults} 
            />
            <div className="mt-4 space-y-2">
                {filteredResults.map((applicant) => 
                    {return <ApplicantCard 
                        tutorName = {applicant.tutorName}
                        courseName = {applicant.courseName}
                        availability = {applicant.availability}
                        skills = {applicant.skills}
                        qualifications = {applicant.qualifications}
                        experience = {applicant.experience}
                        key= {applicant.email}
                    />})}
            </div>
        </div>
        </div>
    );
};

export default LecturerSearch;
