import React, { useEffect, useState } from "react";
import { useClassData } from "@/database-context-providers/classDataProvider";
import { useAuth } from "@/database-context-providers/auth";
import Section from "@/components/general-components/Section";
import TagDisplay from "../general-components/TagDisplay";
import { Badge } from "../ui/badge";

// interface for the class card details
interface TutorClassCardProps {
  courseCode: string; // course code
  children?: React.ReactNode; // optional added children inside the card
}

const TutorClassCard = ({ courseCode, children }: TutorClassCardProps) => {
  // get class records
  const { classRecords, fetchTutorApplication } = useClassData();
  // get user records
  const { fetchUser, getCurrentUser } = useAuth();

  // get class record
  if (!classRecords) {
    return (
      <Section title="Error">
        <p className="text-red-500">Failed to load class records.</p>
      </Section>
    );
  }
  const tutorClass = classRecords[courseCode];


  
  // return error card if course code is wrong
  if (!tutorClass) {
    return (
      <Section title="Error course code not found">
        <p className="text-destructive">Course code {courseCode} not found.</p>
      </Section>
  )
  }

   const [lecturerNames, setLecturerNames] = useState<string[]>([]);
   const [isLabAssistant, setIsLabAssistant] = useState<boolean>(false);
  
  // get the lecturers for the course
  useEffect(() => {
    const fetchLecturerNames = async () => {
      const names: string[] = [];

      // Await full loop 
      await Promise.all(
        tutorClass.lecturerEmails.map(async (lecturerEmail) => {
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
  }, [tutorClass.lecturerEmails]);

  // get the current tutors application
  useEffect(() => {
    const fetchApplcation = async () => {
      const user = getCurrentUser();

      if (user){
        const application = await fetchTutorApplication(courseCode, user.email);

        if (application){
          setIsLabAssistant(application.isLabAssistant);
        }
      }

      
    };

    fetchApplcation();
  }, []);

  // get the preferred availability 
  const preferredAvailabilities: string[] = [];
  if (classRecords[courseCode].partTimeFriendly) {
    preferredAvailabilities.push("Part-Time friendly");
  }
  if (classRecords[courseCode].fullTimefriendly) {
    preferredAvailabilities.push("Full-Time friendly");
  }

  return (
    <Section title={tutorClass.courseTitle}>
      <br></br>
      <p>Course code: {courseCode}</p>
      <br></br>
      <section>
        <p>Preferred skills:</p>
        <TagDisplay tags={tutorClass.preferredSkills}></TagDisplay>
      </section>
      <section>
        <p>Preferred Availability</p>
        <TagDisplay tags={preferredAvailabilities}></TagDisplay>
      </section>
      <section>
        <p>Lecturers:</p>
        <TagDisplay tags={lecturerNames}></TagDisplay>
      </section>
      <Badge>{((isLabAssistant)? "Lab Assistant":"Tutor")}</Badge>

      


      {children}
      
    </Section>
  );
};

export default TutorClassCard;
