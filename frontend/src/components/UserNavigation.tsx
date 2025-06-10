import React from "react";
import NavList from "./general-components/NavList";
import ProfileGreeter from "./general-components/ProfileGreeter";
import PopupExperience from "./PopupExperience";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { useState, useEffect } from "react";
import { useAuth } from "@/database-context-providers/auth";
import { 
  useUserData, 
  MAX_NUM_QUALIFICATIONS, 
  MAX_NUM_SKILLS, 
  MAX_CHAR_EXPERIENCES, 
  MAX_CHAR_QUALIFICATIONS, 
  experienceData} from "@/database-context-providers/userDataProvider";
import TagCustomDisplay from "./general-components/TagCustomizableDisplay";
import { z } from "zod";
import PopupProfile from "./PopupProfile";
import ExperienceCard from "./general-components/ExperienceCard";
import { Label } from "@radix-ui/react-label";
import TagDisplay from "./general-components/TagDisplay";


const UserNavigation = () => {
  // Button popup useState for experience form popup
  const [buttonPopup, toggleButtonPopup] = useState(false);

  //Button popup useState for profile popup
  const [profilePopup, toggleProfilePopup] = useState(false);

  

  const { getCurrentUser, isAuthenticated } = useAuth();
  const { 
    getUserRecords, 
    addUserSkill, 
    removeUserSkill, 
    addUserQualification, 
    removeUserQualification,
    removeUserExperience, 
    changeAvailability,
    getUser,
    getUserSkills,
    getUserQualifications,
  } = useUserData();

  // get the current user
  let currentUser = getCurrentUser();
  // get the user records
  const userRecords = getUserRecords();
  
  // defaults if the user is not authenticated
  if (!isAuthenticated || !currentUser) {
    currentUser = {
      email: "",
      password: "",
      isLecturer: false,
      firstName: "",
      lastName: "",}
    userRecords[currentUser.email] = {
      email: currentUser.email,
      skills: [],
      qualifications: [],
      fullTime: false,
      experience: [],
    };

  }

  
  // TODO: gonna have chance these useStates values be based off the database
  //get the current user skills
  const [userSkills, setUserSkills] = useState<string[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skills = await getUserSkills(currentUser.email);
        const skillNames = skills.map(skillObj => skillObj.skill);
        setUserSkills(skillNames);
      } catch (error) {
        console.error("Failed to fetch user skills:", error);
      }
    };

    fetchSkills();
  }, [currentUser.email]);

  // manual rerender useState
  const [rerenderCounter, setRerenderCounter] = useState<number>(0);

  // get the current user qualifications
  const [userQualifications, setUserQualifications] = useState<string[]>([]);

  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        const qualifications = await getUserQualifications(currentUser.email);
        const qualificationNames = qualifications.map(qualificationObj => qualificationObj.qualification);
        setUserSkills(qualificationNames);
      } catch (error) {
        console.error("Failed to fetch user qualifications:", error);
      }
    };

    fetchQualifications();
  }, [currentUser.email]);


  // get the current user availability
  const [userAvailability, setUserAvailability] = useState<boolean>(userRecords[currentUser.email].fullTime);

  const monthYearFormats: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
  };

  if (!isAuthenticated || !currentUser) {
    return null;
  }

  //function to toggle user availability
  const toggleUserAvailability = () => {
    
    // update the user availability in the database
    if (changeAvailability(!userAvailability, currentUser.email)) {
      setUserAvailability(!userAvailability);
    }
    else {
      // if there was an error show the error message
      return "There was an error changing your availability";
    }
  }

  // function to add a skill tag
  // if an error occurs a string is returned to reperesent it 
  const addSkillTag = async (skillTag: string): Promise<string> => {

    // if the skill tag is not already in the userSkills array, add it
    if (!userSkills.includes(skillTag)) {
      const addedSkill = await addUserSkill(skillTag, currentUser.email);
    	if ( addedSkill == true) {
        // Re-fetch updated skills from DB
        const updatedSkills = await getUserSkills(currentUser.email);
        const skillNames = updatedSkills.map(skill => skill.skill); // extract skill name strings
        setUserSkills(skillNames);
        return "";
      }
      else {
        return `Only a maximum of ${MAX_NUM_SKILLS} skills allowed`;
      }
    }
    // if tag exists show error
    else {
      return "Skill already exists";
    }
  }

  //function to remove experience from profile
  const removeExperienceCard = (experience:experienceData) => {
    if(userExperiences.includes(experience)) {
      if (removeUserExperience(experience, currentUser.email)) {
        setRerenderCounter(rerenderCounter + 1);
        return ""
      }
      else {
        return "ERROR"
      }
    }
    else {
      return "ERROR"
    }
  }

  // function to remove a skill tag
  // if an error occurs a string is returned to reperesent it 
  const removeSkillTag = async(skillTag: string) => {

    // if the skill tag exists remove it
    if (userSkills.includes(skillTag)) {
      const removedSkill = await removeUserSkill(skillTag, currentUser.email);
    	if (removedSkill){
        // update the userSkills array
        // cannot use localstorage as removing can take too long 
        const updatedSkills = await getUserSkills(currentUser.email);
        const skillNames = updatedSkills.map(skill => skill.skill); // extract skill name strings
        setUserSkills(skillNames);
        return "";
      }
      else {
        return "There was an error removing your skill (it doesn't exist?)";
      }
    }
    else {
      return "That skill does not exist";
    }
  }
  
  // function to add a qualification tag
  // if an error occurs a string is returned to reperesent it 
  const addQualificationTag = async (qualificationsTag: string): Promise<string> => {
    // if the qualification tag is not already in the userQualifications array, add it
    if (!userQualifications.includes(qualificationsTag)) {
      const addedQualification = await addUserQualification(qualificationsTag, currentUser.email);
    	if (addedQualification) {
        // update the userQualifications array
        // setUserQualifications([...userQualifications, qualificationsTag]);
        // Re-fetch updated skills from DB
        const updatedQualfications = await getUserQualifications(currentUser.email);
        const qualificationNames = updatedQualfications.map(qualification => qualification.qualification); // extract skill name strings
        setUserQualifications(qualificationNames);
        return "";
      }
      else {
        return `Only a maximum of ${MAX_NUM_QUALIFICATIONS} qualifications allowed`;
      }
    }
    // if tag exists show error
    else {
      return "Qualification already exists";
    }
  }

  // function to remove a qualification tag
  // if an error occurs a string is returned to reperesent it 
  const removeQualificationTag = async (qualificationTag: string): Promise<string> => {

    // if the qualification tag exists remove it
    if (userQualifications.includes(qualificationTag)) {
    	if (removeUserQualification(qualificationTag, currentUser.email)){

        // update the userQualification array
        // cannot use localstorage as removing can take too long 
        setUserQualifications(userQualifications.filter(
          (tag) => {
            return (tag !== qualificationTag);
          }));

        return "";
        
      }
      else {
        return `The qualification ${qualificationTag} does not exist`
      }
    }
    else {
      return `The qualification ${qualificationTag} does not exist`;
    }
  }

  // get array of current user experiences
  const userExperiences: experienceData[] = userRecords[currentUser.email].experience;

  return (
    <nav className="nav">
      <ul className="nav-list">
        <ProfileGreeter/>
        <NavList title="Manage Experience"/>
        <div className="flex gap-4 mb-3">
          <Button 
              className="mt-2 mb-2"
              onClick={() => toggleButtonPopup(true)}>Add Experience
          </Button>
          <PopupExperience 
            buttonPopup={buttonPopup} 
            setTrigger={toggleButtonPopup}
            titleValidation={z.string().min(1, {message: "Required"}).max(MAX_CHAR_EXPERIENCES,
              `Maximum experience title length of ${MAX_CHAR_EXPERIENCES} characters`).trim()}

            companyValidation={z.string().min(1, {message: "Required"}).max(MAX_CHAR_EXPERIENCES,
              `Maximum experience company length of ${MAX_CHAR_EXPERIENCES} characters`).trim()}

            startDateValidation={z.string().min(1, {message: "Required"})}
            
            endDateValidation={z.string().optional()}
            />
          <Button 
              variant="secondary"
              className="mt-2 mb-2"
              onClick={() => toggleProfilePopup(!profilePopup)}>View/Hide
          </Button>
          <PopupProfile buttonPopup={profilePopup} setTrigger={toggleProfilePopup}/>
        </div>
        <div hidden={profilePopup}>
        {
          userExperiences.map(
           (experience, index) => {
            return (
              <ExperienceCard experience = {experience} removeExperience={removeExperienceCard} key={index}>
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
        {
          (userExperiences.length == 0)? 
          // if experiences are empty display a tag as a notifier
          <TagDisplay tags={[]}></TagDisplay> :
          <></>
        }
        </div>

        <NavList title="Manage Skills (Press to remove)"/>
        <TagCustomDisplay 
            tags={userSkills} 
            addTag={addSkillTag} 
            removeTag={removeSkillTag} 
            placeholder="Add new skill (Press enter to add)"/>

        <NavList title="Manage Qualifications (Press to remove)"/>
        <TagCustomDisplay 
            tags={userQualifications} 
            addTag={addQualificationTag} 
            removeTag={removeQualificationTag} 
            placeholder="Add new Qualification (Press enter to add)"
            fullWidth
            inputValidation={z
                              .string()
                              .min(1, {message: "Qualification is required"})
                              .max(MAX_CHAR_QUALIFICATIONS, 
                                `Maximum qualification length of ${MAX_CHAR_QUALIFICATIONS} characters`)
                              .trim()}/>

      
      <NavList title="Manage Availability (Full or Part time)"/>
      <div className="flex mt-4 justify-center">
        <Label> {(userAvailability)? "Full-Time": "Part-Time"}</Label>
      </div>
      <div className="flex mt-4 justify-center">
        <Switch className=""id="availability" checked={userAvailability} onCheckedChange={toggleUserAvailability}/>
      </div>
      </ul>
    </nav>
  );
};


export default UserNavigation;
