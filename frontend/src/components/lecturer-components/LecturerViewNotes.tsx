import React, {useState, useEffect} from "react";
import { useClassData } from "@/database-context-providers/classDataProvider";
import { useAuth } from "@/database-context-providers/auth";
import Section from "@/components/general-components/Section";
import TagDisplay from "../general-components/TagDisplay";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import LecturerAddNote from "./LecturerAddNote";
import NavList from "../general-components/NavList";
import { ShortlistNote } from "@/types/types";
import { useUserData } from "@/database-context-providers/userDataProvider";

// interface for the class card details
interface LecturerViewNotesProps {
  courseCode: string; // course code
  tutorEmail: string;
  children?: React.ReactNode;

  
}

const LecturerViewNotes = ({ courseCode, tutorEmail, children }: LecturerViewNotesProps) => {

  // manual rerender useState
  const [rerenderCounter, setRerenderCounter] = useState<number>(0);

  // visibility state 
  const [addVisibility, setAddVisibility] = useState<boolean>(false);
  // states for visibillity of viewNotes as a whole
  const [notePopup, toggleNotePopup] = useState(false);

  const [notes, setNotes] = useState<ShortlistNote[]>([])
  const [lecturerNameMap, setLecturerNameMap] = useState<LecturerShortList>({})

  // get class records
  const { getTutorNotes, deleteNote, classRecords} = useClassData();
  const { getUser } = useUserData();
  // get user records
  const { getCurrentUser, isAuthenticated, isLecturer} = useAuth();
  type LecturerShortList = Record<string, string>;

useEffect(() => {
  const fetchNotesAndNames = async () => {
    if (!classRecords || !classRecords[courseCode]) return;

    const lecturerEmails = classRecords[courseCode].lecturerEmails;

    // Parallel fetch of users
    const lecturerData = await Promise.all(
      lecturerEmails.map(email => 
        getUser(email).then(user => ({ email, user }))
      )
    );

    // Create name map
    const nameMap: Record<string, string> = {};
    for (const { email, user } of lecturerData) {
      if (user) {
        nameMap[email] = `${user.firstName} ${user.lastName}`;
      }
    }

    // Fetch notes
    const tutorNotes = await getTutorNotes(courseCode, tutorEmail);

    // Set state
    setLecturerNameMap(nameMap);
    setNotes(tutorNotes);
  };

  fetchNotesAndNames();
}, [classRecords?.[courseCode]?.lecturerEmails?.join(","), courseCode, tutorEmail, rerenderCounter]);

  // get class record
if (!classRecords) {
    return (
      <Section title="Error">
        <p className="text-red-500">Failed to load class records.</p>
      </Section>
    );
  }


  // get current user
  const currUser = getCurrentUser();

  if (!currUser || !isAuthenticated || !isLecturer) {
    return (
      <Section title="Error">
        <p className="text-destructive"> User is not authenticated.</p>
      </Section>
    )
  }

  
  // return error card if course code is wrong
  if (!classRecords[courseCode]) {
    return (
      <Section title="Error course code not found">
        <p className="text-destructive">Course code {courseCode} not found.</p>
      </Section>
    )
  }

  if (!classRecords[courseCode].tutorsShortlist.some(tutor => tutor.tutorEmail === tutorEmail)) {
    return (
      <Section title="Error tutor not in shortlist, only shortlisted tutors may have notes">
        <p className="text-destructive">Tutor {tutorEmail} not shortlisted.</p>
      </Section>);
  }
  
  // // get users record
  // const users = await getAllUsers();

  // // record for getting lecturer names from emails
  // type LecturerShortList = Record<string, string>;
  // const lecturerNameMap: LecturerShortList = {};

  // // get the lecturers for the course
  // for (const lecturerEmail of classRecords[courseCode].lecturerEmails) {

  //   if (users[lecturerEmail]) {
  //     // add the lecturs email as key and full name as value 
  //     lecturerNameMap[lecturerEmail] = users[lecturerEmail].firstName + " " + users[lecturerEmail].lastName;
  //   }
  // }
  // // get all notes for that class / tutor 
  // const notes: ShortlistNote[] = await getTutorNotes(courseCode, tutorEmail);
  

  // option to display date
  const dateBadgeFormat: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }

  const handleDelete = async(note: ShortlistNote) => {
    // delete message
    if (await deleteNote(courseCode, tutorEmail, note.lecturerEmail, note.message)){
      // rerender to display that the message is gone 
      setRerenderCounter(rerenderCounter + 1);
    }
    else{
      alert("Error, there was an error deleting that note");
    }
    
  }

  return (
    <>
    <div className="flex flex-row gap-6">
      <div className="mt-2">
          <NavList title="Notes"></NavList>
      </div>
      <Button 
          variant="secondary"
          className="mb-2"
          onClick={() => toggleNotePopup(!notePopup)}>View/Hide
      </Button>
    </div>
    <div hidden={!notePopup}>
    <Accordion type="single" collapsible>
    {
      notes.map(
      (note, index) => {
        return (
          <AccordionItem 
            value ={`${note.lecturerEmail}-${note.date}-${note.message}`} 
            key={`${note.lecturerEmail}-${note.date}-${note.message}`}>
            <AccordionTrigger>
              {lecturerNameMap[note.lecturerEmail]}
                <Badge>{new Date (note.date).toLocaleString('en-US', dateBadgeFormat)}</Badge>
              </AccordionTrigger>
            <AccordionContent>
              {note.message}

              {(note.lecturerEmail === currUser.email)? 
                <>
                  <br></br>
                  <div className="flex justify-end">
                    <Button 
                      className="mt-3 flex justify-center"
                      key = {index} 
                      type="button" 
                      onClick={() => handleDelete(note)} 
                      variant="destructive">
                          Delete Message
                    </Button>
                  </div>
              </> :
              <></>}
            </AccordionContent>
          </AccordionItem>
        );
      } 
      )
    }
    
      {(notes.length == 0)? <TagDisplay tags={[]}></TagDisplay>:<></>}
        
      <Button 
        className="mt-3 flex justify-center"
        type="button" 
        variant={(!addVisibility)? "default" : "destructive"}
        onClick={() => {setAddVisibility(!addVisibility)}}>
        {(!addVisibility)? "Add New Note" : "Forget New Note"}
          
      </Button> 

      <LecturerAddNote 
        courseCode={courseCode} 
        tutorEmail={tutorEmail} 
        visibility={addVisibility} 
        setVisibilityTrigger={setAddVisibility}
        rerenderParentCounter={rerenderCounter}
        setRerenderParentCounter={setRerenderCounter}></LecturerAddNote>

      {children}
    </Accordion>
    </div>
    </>
  );
};

export default LecturerViewNotes;
