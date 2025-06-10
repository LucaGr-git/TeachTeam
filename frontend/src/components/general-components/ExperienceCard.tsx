import React from "react";
import Section from "./Section"
import { localStorageExperienceData } from "@/database-context-providers/userDataProvider";
import { Experience } from "@/types/types";

// props needed to display the nav card
interface ExperienceCardProps {
    experience: Experience;
    removeExperience?: (experience:Experience) => Promise<string>;
    children?: React.ReactNode;
}



const ExperienceCard = ({experience, removeExperience = async() => {return ""}, children} : ExperienceCardProps) => {
    
    return (
        <div onClick={() => removeExperience(experience)}>
            <Section 
            className="experience-section hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50" 
            title={experience.company}>
            {children}
            </Section>
        
        </div>
    );
};

export default ExperienceCard;