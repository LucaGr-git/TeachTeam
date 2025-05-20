import React, {useState} from "react";
import { Button } from "../ui/button";
import Section from "./Section"
import { experienceData } from "@/localStorage-context/userDataProvider";
import TagDisplay from "./TagDisplay";
import ExperienceCard from "./ExperienceCard";
import NavList from "./NavList";

// props needed to display the nav card
interface ApplicantCardProps {
    tutorName: string;
    courseName: string[];
    availability: string;
    skills: string[];
    qualifications: string[];
    experience: experienceData[];
    children?: React.ReactNode;
}



const ApplicantCard = ({tutorName, courseName, availability, skills, qualifications, experience, children} : ApplicantCardProps) => {
    // states for visibility
    const [experiencePopup, toggleExperiencePopup] = useState(false);
    const [infoPopup, toggleInfoPopup] = useState(false);
    

    const monthYearFormats: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
      };
    

    return (
        <div>
            <Section 
            className="nav-list" 
            title={tutorName} 
            >   
                <div className="mt-4 flex flex-row gap-6">
                        <div className="mt-2">
                            <NavList title="Details"></NavList>
                        </div>
                        <Button 
                            variant="secondary"
                            className="mb-2"
                            onClick={() => toggleInfoPopup(!infoPopup)}>View/Hide
                        </Button>
                </div>
                    
                
                <section>
                <div hidden={!infoPopup} className="mb-3">
                    
                    <p className="mt-4">Availability</p>
                    <TagDisplay tags={[availability]}></TagDisplay>
                    <p className="mt-4">Skills</p>
                    <TagDisplay tags={skills}></TagDisplay>
                    <p className="mt-4">Qualifications</p>
                    <TagDisplay tags={qualifications}></TagDisplay>
                    <p className="mt-4">Courses Applied to:</p>
                    <TagDisplay tags={courseName}></TagDisplay>
                </div>
                <div className=" flex flex-row gap-10">
                        <div className="mt-2">
                            <NavList title="Experience"></NavList>
                        </div>
                        <Button 
                            variant="secondary"
                            className="mb-2"
                            onClick={() => toggleExperiencePopup(!experiencePopup)}>View/Hide
                        </Button>
                </div>
                <div hidden={!experiencePopup} className="mb-3">
                {
                    experience.map(
                    (experience, index) => {
                        return (
                        <ExperienceCard experience = {experience} key={index}>
                            <h1> Title: {experience.title}</h1>
                            <h1> Start Date: {new Date (experience.timeStarted).toLocaleString('en-US', monthYearFormats)}</h1>
                            {(experience.timeFinished)? 
                            <h1> End Date: {new Date (experience.timeFinished).toLocaleString('en-US', monthYearFormats)}</h1>
                            : 
                            <></>}
                        </ExperienceCard>)
                    } 
                    


                    )
                }
                    {(experience.length == 0)? <TagDisplay tags={[]}></TagDisplay>: <></>}
                </div>

                </section>

                {children}
            </Section>
        </div>
    );
};

export default ApplicantCard;