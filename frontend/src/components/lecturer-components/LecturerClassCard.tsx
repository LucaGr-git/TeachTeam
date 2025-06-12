import React, {useEffect, useState} from "react";
import { useClassData, MAX_NUM_SKILLS} from "@/database-context-providers/classDataProvider";
import { useAuth } from "@/database-context-providers/auth";
import Section from "@/components/general-components/Section";
import TagDisplay from "../general-components/TagDisplay";
import TagCustomDisplay from "../general-components/TagCustomizableDisplay";
import { Switch } from "../ui/switch";
import LecturerListChart from "./LecturerListChart";
import { Button } from "../ui/button";
import { set } from "react-hook-form";

// interface for the class card details
interface LecturerClassCardProps {
  courseCode: string; // course code
  children?: React.ReactNode; // optional added children inside the card
}

const LecturerClassCard = ({ courseCode, children }: LecturerClassCardProps) => {

  // manual rerender useState
  const [rerenderCounter, setRerenderCounter] = useState<number>(0);
  // state for whether course information is visible
  const [viewCourseInfo, setViewCourseInfo] = useState<boolean>(true);

  // get class records
  const { getClassRecords, addPreferredSkill, removePreferredSkill, changeAvailability, isLoading, classRecords, fetchCourse} = useClassData();
  // get user records
  const { getUsers, getCurrentUser, isAuthenticated, isLecturer, fetchUser} = useAuth();

  // get class record
if (!classRecords) {
    return (
      <Section title="Error">
        <p className="text-red-500">Failed to load class records.</p>
      </Section>
    );
  }
    const lecturerClass = classRecords[courseCode];

  // get users record
  const users = getUsers();

  // get current user
  const currUser = getCurrentUser();

  // get the preferred availabilities
  const [fullTimeFriendly, setFullTimeFriendly] = useState<boolean>(lecturerClass.fullTimefriendly);
  const [partTimeFriendly, setPartTimeFriendly] = useState<boolean>(lecturerClass.partTimeFriendly);

  if (!currUser || !isAuthenticated || !isLecturer) {
    return (
      <Section title="Error">
        <p className="text-destructive"> User is not authenticated.</p>
      </Section>
    )
  }

  

  // return error card if course code is wrong
  if (!lecturerClass) {
    return (
      <Section title="Error course code not found">
        <p className="text-destructive">Course code {courseCode} not found.</p>
      </Section>
    )
  }

  const [lecturerNames, setLecturerNames] = useState<string[]>([]);

  // get the lecturers for the course
  useEffect(() => {
    const fetchLecturerNames = async () => {
      const names: string[] = [];

      // Await full loop 
      await Promise.all(
        lecturerClass.lecturerEmails.map(async (lecturerEmail) => {
          try {
            const user = await fetchUser(lecturerEmail);
            if (user) {
              names.push(`${user.firstName} ${user.lastName}`);
            } else {
              names.push(lecturerEmail); // fallback 
            }
          } catch (error) {
            console.error("Error fetching user:", error);
            names.push(lecturerEmail); // fallback
          }
        })
      );

      setLecturerNames(names);
    };

    fetchLecturerNames();
  }, [lecturerClass.lecturerEmails]);


  // function to add a skill tag
  // if an error occurs a string is returned to reperesent it 
  const addSkillTag = async(skillTag: string): Promise<string> => {
    if (lecturerClass.preferredSkills.length >= MAX_NUM_SKILLS) {
      return `Only a maximum of ${MAX_NUM_SKILLS} skills allowed`;

    }
    // if the skill tag is not already in the userSkills array, add it
    if (!lecturerClass.preferredSkills.includes(skillTag)) {
      const checkAddPreferredSkill = await addPreferredSkill(courseCode, skillTag);
      console.log (checkAddPreferredSkill);
      if (checkAddPreferredSkill == true) {
        // manual rerender to show the changes
        setRerenderCounter(rerenderCounter + 1);
        return "";
      }
      else {
        return `Only a maximum of ${MAX_NUM_SKILLS} skills allowed!`;
      }
    }
    // if tag exists show error
    else {
      return "Skill already exists";
    }
  }

  // function to add a skill tag
  // if an error occurs a string is returned to reperesent it 
  const removeSkillTag = async(skillTag: string): Promise<string> => {
 
    // if the skill tag is already in the userSkills array, remove it
    if (lecturerClass.preferredSkills.includes(skillTag)) {
      
      if (await removePreferredSkill(courseCode, skillTag)) {
        // manual rerender to show the changes
        setRerenderCounter(rerenderCounter + 1);
        return "";
      }
      else {
        return `There was an error removing your skill (it doesn't exist?)`;
      }
    }
    // if tag exists show error
    else {
      return "Skill doesn't exists";
    }
  }

  // functions for changing availability
  

  // function to change the full time preferred availability
  const toggleFullTimeFriendly = async() => {
    await changeAvailability(courseCode, !fullTimeFriendly, partTimeFriendly);
    setFullTimeFriendly(!fullTimeFriendly);
    
  }
  // function to change the part time preferred availability
  const togglePartTimeFriendly = async() => {
    await changeAvailability(courseCode, fullTimeFriendly, !partTimeFriendly);
    setPartTimeFriendly(!partTimeFriendly);
    
  }

    useEffect(() => {
      // fetches date joined and avaiability
      const fetchCourseInfo = async () => {
        try {
          const course = await fetchCourse(lecturerClass.courseCode);

          setFullTimeFriendly(course?.fullTimeFriendly || false);
          setPartTimeFriendly(course?.partTimeFriendly || false);
     
        } catch (error) {
          console.error("Failed to fetch class info:", error);
        }
      };
  
      fetchCourseInfo();

    }, [currUser.email]);
  
  
  return (
    <Section title={lecturerClass.courseTitle}>
      <br></br>
      <div className="flex">
        <p className="mt-1">Course code: {courseCode}</p>
        <Button 
          className="ml-auto"
          type="button" 
          variant="secondary"
          onClick={() => setViewCourseInfo(!viewCourseInfo)} >
              View/Hide course details
        </Button> 
      </div>

      

      <section hidden={!viewCourseInfo}>
        <p>Preferred skills:</p>
        <TagCustomDisplay tags={lecturerClass.preferredSkills} addTag={addSkillTag} removeTag={removeSkillTag}></TagCustomDisplay>
      </section>
      <section hidden={!viewCourseInfo}>
        <div className="flex flex-col gap-2">
          <div>
            <p>Full-Time Friendly</p>
            <Switch 
              className=""
              id="Full-Time Availability" 
              checked={fullTimeFriendly} 
              onCheckedChange={toggleFullTimeFriendly}/>

          </div>
          <div>
            <p>Part-Time Friendly</p>
            <Switch 
              className=""
              id="Part-Time Availability" 
              checked={partTimeFriendly} 
              onCheckedChange={togglePartTimeFriendly}/>

          </div>
        </div>
      </section>
      <section hidden={!viewCourseInfo}>
        <p>Lecturers:</p>
        <TagDisplay tags={lecturerNames}></TagDisplay>
      </section>

      <section className="mt-4">
        <p>Shortlisted Ranking Chart</p>
        {/* <LecturerListChart courseCode={courseCode}/> */}
      </section>

      


      {children}
      
    </Section>
  );
};

export default LecturerClassCard;
