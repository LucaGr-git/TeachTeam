import React, { useEffect, useState } from "react";
import { useClassData } from "@/database-context-providers/classDataProvider";
import { useAuth } from "@/database-context-providers/auth";
import Section from "@/components/general-components/Section";
import TutorClassCard from "./TutorClassCard";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface ApplicationEntry {
  courseCode: string;
  isLabAssistant: boolean;
}

const TutorJobList = () => {
  const [rerenderCounter, setRerenderCounter] = useState(0);
  const [applications, setApplications] = useState<ApplicationEntry[]>([]);

  const { isAuthenticated, getCurrentUser } = useAuth();
  const currUser = getCurrentUser();
  const { rejectApplication, classRecords, fetchTutorApplication } = useClassData();

  useEffect(() => {
    const fetchApplications = async () => {
      if (!currUser || !classRecords) return;

      const email = currUser.email;
      const results: ApplicationEntry[] = [];

      for (const courseCode in classRecords) {
        const record = classRecords[courseCode];

        if (!record.tutorEmails.includes(email) && record.tutorsApplied.includes(email)) {
          const application = await fetchTutorApplication(courseCode, email);

          if (application) {
            results.push({
              courseCode,
              isLabAssistant: application.isLabAssistant,
            });
          }
        }
      }

      setApplications(results);
    };

    fetchApplications();
  }, [rerenderCounter]);

  if (!isAuthenticated || !currUser) {
    return (
      <Section title="Not Authenticated">
        <p className="text-red-500">User is not authenticated.</p>
      </Section>
    );
  }

  if (!classRecords) {
    return (
      <Section title="Error">
        <p className="text-red-500">Failed to load class records.</p>
      </Section>
    );
  }

  if (applications.length === 0) {
    return (
      <Section title="No classes available">
        <p className="text-red-500">No classes available.</p>
      </Section>
    );
  }

  const handleCancellation = async (courseCode: string) => {
    const email = currUser.email;
    const record = classRecords[courseCode];
    if (!record) return alert("Course not found");

    if (!record.tutorsApplied.includes(email)) {
      return alert("You have not applied for this course");
    }

    if (record.tutorEmails.includes(email)) {
      return alert("You are already tutoring this course");
    }

    const success = await rejectApplication(courseCode, email);
    if (!success) {
      return alert("Error cancelling application");
    }

    setRerenderCounter((r) => r + 1); // Re-fetch application data
  };

  return (
    <>
      {applications.map((app) => (
        
        <TutorClassCard courseCode={app.courseCode} key={app.courseCode}>
          <p className="mt-4 mb-4 mr-10">
            <i>You have applied to this course</i>
            
          </p>
          <Badge>{app.isLabAssistant ? "Lab Assistant" : "Tutor"}</Badge>
          <p className="mt-4 mb-4">Click to <b>cancel application</b></p>
          <Button onClick={() => handleCancellation(app.courseCode)}>Cancel Application</Button>
          
        </TutorClassCard>
      ))}
    </>
  );
};

export default TutorJobList;
