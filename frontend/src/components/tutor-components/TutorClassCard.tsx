import React from "react";
import { useClassData } from "@/localStorage-context/classDataProvider";
import { useAuth } from "@/localStorage-context/auth";
import Section from "@/components/general-components/Section";
import TagDisplay from "../general-components/TagDisplay";

// interface for the class card details
interface TutorClassCardProps {
  courseCode: string; // course code
  children?: React.ReactNode; // optional added children inside the card
}

const TutorClassCard = ({ courseCode, children }: TutorClassCardProps) => {
  // get class records
  const { getClassRecords } = useClassData();
  // get user records
  const { getUsers } = useAuth();

  // get class record
  const classRecords = getClassRecords();
  const tutorClass = classRecords[courseCode];

  // get users record
  const users = getUsers();

  
  // return error card if course code is wrong
  if (!tutorClass) {
    return (
      <Section title="Error course code not found">
        <p className="text-destructive">Course code {courseCode} not found.</p>
      </Section>
  )
  }

  const lecturerNames: string[] = [];
  // get the lecturers for the course
  for (const lecturerEmail of tutorClass.lecturerEmails) {

    if (users[lecturerEmail]) {
      lecturerNames.push(users[lecturerEmail].firstName + " " + users[lecturerEmail].lastName);
    }
  }

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

      


      {children}
      
    </Section>
  );
};

export default TutorClassCard;
