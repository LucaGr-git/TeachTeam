import React from "react";
import Section from "./Section"
import { experienceData } from "@/database-context-providers/userDataProvider";

// props needed to display the nav card
interface ExperienceCardProps {
    experience: experienceData;
    removeExperience?: (experience:experienceData) => string;
    children?: React.ReactNode;
}



const ExperienceCard = ({experience, removeExperience = () => {return ""}, children} : ExperienceCardProps) => {
    
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