import React from "react";
import { useClassData} from "@/database-context-providers/classDataProvider";
import { useAuth } from "@/database-context-providers/auth";
import Section from "@/components/general-components/Section";
import { Button } from "../ui/button";
// zod import for input validation 
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, 
  FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";

import { Textarea } from "../ui/textarea";

// interface for the class card details
interface LecturerAddNoteProps {
  courseCode: string; // course code
  tutorEmail: string;
  visibility: boolean;
  setVisibilityTrigger: (visibility: boolean) => void;
  rerenderParentCounter?: number;
  setRerenderParentCounter?: (count: number) => void;

  
}

const LecturerAddNote = (
  { courseCode, 
    tutorEmail, 
    visibility, 
    setVisibilityTrigger, 
    rerenderParentCounter = 0,
    setRerenderParentCounter = () => {}}: LecturerAddNoteProps) => {


  // get class records
  const { getClassRecords, addNote, isLoading, classRecords} = useClassData();
  // get user records
  const {getCurrentUser, isAuthenticated, isLecturer} = useAuth();

  // get class record
  if (!classRecords){
    if (!classRecords) {
    return (
      <Section title="Error">
        <p className="text-red-500">Failed to load class records.</p>
      </Section>
    );
  }
  }
  const lecturerCLass = classRecords[courseCode];

  // get current user
  const currUser = getCurrentUser();


  // zod schema for input validation on log in (passed via parameters)
  const noteSchema = z.object({
    noteBody: z.string().min(1, {message: "A message is required"}).max(250, {message: "Maximum of 250 characters"}),
})

// use hook form for sign up
const noteForm = useForm({
  resolver: zodResolver(noteSchema),
  // default values must be used (bugs can start to occur)
  defaultValues: {
      noteBody: ""
    },
})

  if (!currUser || !isAuthenticated || !isLecturer) {
    return (
      <Section title="Error">
        <p className="text-destructive"> User is not authenticated.</p>
      </Section>
    )
  }

  
  // return error card if course code is wrong
  if (!lecturerCLass) {
    return (
      <Section title="Error course code not found">
        <p className="text-destructive">Course code {courseCode} not found.</p>
      </Section>
    )
  }

  if (!lecturerCLass.tutorsShortlist.some(tutor => tutor.tutorEmail === tutorEmail)) {
    return (
      <Section title="Error tutor not in shortlist, only shortlisted tutors may have notes">
        <p className="text-destructive">Tutor {tutorEmail} not shortlisted.</p>
      </Section>);
  }

  
  


  const handleAdd = async(values: {noteBody: string}) => {

    if (await addNote(courseCode, tutorEmail, currUser.email, values.noteBody)){
      // if successful in adding note hide add note section
      setVisibilityTrigger(false);
      setRerenderParentCounter(rerenderParentCounter + 1);
      // reset form afterwards
      noteForm.reset()
    }
    else {
      alert("Error: There was an error adding your note");
    }

  }

  return (
    <div hidden={!visibility}>
      <Form {...noteForm}>
        <form  onSubmit={noteForm.handleSubmit(handleAdd, (errors) => console.log(errors))}>

        <FormField
          control={noteForm.control}
          name="noteBody"
          render={({ field }) => (
          <FormItem>
              <FormLabel className="mt-4">Your Note</FormLabel>
              <FormControl>
                <Textarea placeholder="Type your note here ...."{...field} />
              </FormControl>
              <p className="text-sm text-muted-foreground"> This will be visible to all other lecturers </p>
              <FormMessage />
          </FormItem>
          )}
      />

        <Button 
          className="mt-3 flex justify-center"
          type="submit" 
          variant="secondary">
            Submit Note
        </Button> 
        </form>
      </Form>
    </div>
  );
};

export default LecturerAddNote;
