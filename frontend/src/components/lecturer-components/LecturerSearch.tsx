import React, { useState, useEffect } from "react";
import { useClassData } from "@/database-context-providers/classDataProvider";
import { useUserData } from "@/database-context-providers/userDataProvider";
import SearchBar from "./SearchBar";
import ApplicantCard from "../general-components/ApplicantCard";
import LecturerSort from "./LecturerSort";
import { Experience } from "@/types/types";
import LoadingIcons from 'react-loading-icons'




export interface ApplicantInfo {
    tutorName: string;
    courseName: string[];
    availability: string;
    skills: string[];
    qualifications: string[]
    experience: Experience[];
    isLabAssistant: boolean[];
    roles: ("Tutorial" | "Lab")[];
    email: string;
}


const LecturerSearch = () => {
    //useState hook to return the tutor profile information
    const [results, setResults] = useState<ApplicantInfo[]>([]);
    const [applicants, setApplicants] = useState<ApplicantInfo[]>([]);
    //useState hook to return the filtered tutor profile information
    const [filteredResults, setFilteredResults] = useState<ApplicantInfo[]>([]);

    // Get the ClassRecords from local storage
    const {classRecords, isLoading, fetchTutorApplication} = useClassData();
    const { getUserExperiences, getUserQualifications, getUserSkills, getAllUsers, getUser} = useUserData();



useEffect(() => {
  const fetchApplicants = async () => {
    const applicants: ApplicantInfo[] = [];

    const userList = await getAllUsers();

    if (!classRecords) return;

    for (const user of userList) {
        const email = user.email;
      const currApplicant = await getUser(email);
      if (currApplicant.isLecturer) continue;

      const userExperience = await getUserExperiences(email);
      const userQualification = await getUserQualifications(email);
      const userSkills = await getUserSkills(email);


      // Collect all course titles they've applied to, if any
      const courseNames: string[] = [];
      const applicationTypes: boolean[] = [];
      for (const classCode in classRecords) {

        if (classRecords[classCode].tutorsApplied.includes(email)) {
            courseNames.push(classRecords[classCode].courseTitle);
            const application = await fetchTutorApplication(classRecords[classCode].courseCode, email);
            if (application){
                applicationTypes.push(application.isLabAssistant);
            }
        }
      }

      const newApplicant: ApplicantInfo = {
        tutorName: currApplicant.firstName,
        courseName: courseNames, // can be an empty array now
        availability: currApplicant.fullTime ? "Full time" : "Part time",
        skills: userSkills.map(s => s.skill),
        qualifications: userQualification.map(q => q.qualification),
        experience: userExperience,
        email: currApplicant.email,
        isLabAssistant: applicationTypes,
        roles: Array.from(new Set(applicationTypes.map(type => type ? "Lab" : "Tutorial")))
      };

      applicants.push(newApplicant);
    }

    setApplicants(applicants);
  };

    fetchApplicants();
}, [classRecords]);    

    if (isLoading || applicants.length === 0) {
    return <div>Loading applicants...
        <div><LoadingIcons.SpinningCircles /></div>
    </div>
    ;

    }

// Search function
     const searchItems = (applicants: ApplicantInfo[], searchTerm: string): ApplicantInfo[] => {
        return applicants.filter(applicant => 
            // Check if any string or array of strings contains the search term
            applicant.tutorName.toLowerCase().replace(/ /g, "").includes(searchTerm.toLowerCase().replace(/ /g, "")) ||
            applicant.availability.toLowerCase().replace(/ /g, "").includes(searchTerm.toLowerCase().replace(/ /g, "")) ||
            applicant.courseName.some(course => course.toLowerCase().replace(/ /g, "").includes(searchTerm.toLowerCase().replace(/ /g, ""))) ||
            applicant.skills.some(skill => skill.toLowerCase().replace(/ /g, "").includes(searchTerm.toLowerCase().replace(/ /g, ""))) ||
            applicant.roles.some(role => role.toLowerCase().replace(/ /g, "").includes(searchTerm.toLowerCase().replace(/ /g, "")))

        );
    }

    const handleSearch = (query: string) => {
        const results: ApplicantInfo[] = searchItems(applicants, query)
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
