import { courseService } from "@/services/api";
import { CourseLecturer } from "@/types/types";
import { createContext, useEffect, useContext, ReactNode, useCallback, useState } from "react";

export const MAX_NUM_SKILLS: number = 10;

// Interface for what users of the hook will be able to use
export interface ClassDataProvision {
    classRecords: ClassRecord | null;
    isLoading: boolean;

    addLecturer: (courseCode: string, lecturer: string) =>  Promise<boolean>;
    removeLecturer: (courseCode: string, lecturer: string) => Promise<boolean>;

    acceptApplication: (courseCode: string, tutor: string) => Promise<boolean>;
    rejectApplication: (courseCode: string, tutor: string) => Promise<boolean>;
    addApplication: (courseCode: string, tutorEmail: string) => Promise<boolean>;

    addToShortlist: (courseCode: string, tutorEmail: string) => Promise<boolean>;
    removeFromShortlist: (courseCode: string, tutorEmail: string) => Promise<boolean>;

    changeCourseTitle: (courseCode: string, newTitle: string) => Promise<boolean>;

    addPreferredSkill: (courseCode: string, skill: string) => Promise<boolean>;
    removePreferredSkill: (courseCode: string, skill: string) => Promise<boolean>;

    initializeLecturerShortlist: (courseCode: string, lecturerEmail: string) => Promise<boolean>;
    orderLecturerShortList: (courseCode: string, tutorEmail: string, lecturerEmail: string, position: number) => Promise<boolean>;

    addNote: (courseCode: string, tutorEmail: string, lecturerEmail: string, message: string) => Promise<boolean>;
    deleteNote: (courseCode: string, tutorEmail: string, lecturerEmail: string, message: string) => Promise<boolean>;

    getTutorNotes: (courseCode: string, tutorEmail: string) => Promise<ShortlistNote[]>;

    changeAvailability: (courseCode: string, fullTime: boolean, partTime: boolean) => Promise<boolean>;

    getClassRecords: () => Promise<ClassRecord>;
    saveClassRecords: (classRecords: ClassRecord) => Promise<void>;
}

export type LecturerShortList = Record<string, string[]>;

// interface for the data type of a note
export interface ShortlistNote {
    lecturerEmail: string,
    message: string,
    date: string, // ISO format date string 
}
// interface for shortlisted applicants
export interface ShortlistedInfo {
    tutorEmail: string,
    notes: ShortlistNote[];
}

// Interface for class details
export interface ClassData {
    courseCode: string;
    courseTitle: string;
    lecturerEmails: string[];
    tutorEmails: string[];
    tutorsApplied: string[];
    tutorsShortlist: ShortlistedInfo[];
    preferredSkills: string[];
    fullTimefriendly: boolean;
    partTimeFriendly: boolean;
    lecturerShortlist: LecturerShortList;
}

export type ClassRecord = Record<string, ClassData>;

//TODO: for instead of manually make every component fit into new entity calls, hydrate entities to fit the existing ClassData
// interface, then dehydrate specific function.

const getClassRecords = async (): Promise<ClassRecord> => {
    try {
    const [
        courses,
        courseLecturers,
        courseTutors,
        tutorApplications,
        shortlistedTutors,
        lecturerShortlists,
        preferredSkills,
        shortlistNotes
    ] = await Promise.all([
        courseService.getAllCourses(),              // Course[]
        courseService.getAllCourseLecturers(),      // CourseLecturer[]
        courseService.getAllCourseTutors(),         // CourseTutor[]
        courseService.getAllTutorApplications(),    // TutorApplication[]
        courseService.getAllShortlistedTutors(),    // ShortlistedTutor[]
        courseService.getAllLecturerShortlists(),   // LecturerShortlist[]
        courseService.getAllPreferredSkills(),      // PreferredSkill[]
        courseService.getAllShortlistNotes(),       // ShortlistNote[]
    ]);
    const classRecords: ClassRecord = {};

    for (const course of courses) {
      const courseCode = course.courseCode;

      const lecturers = courseLecturers
        .filter(l => l.courseCode === courseCode)
        .map(l => l.lecturerEmail);

      const tutors = courseTutors
        .filter(t => t.courseCode === courseCode)
        .map(t => t.tutorEmail);

      const applications = tutorApplications
        .filter(a => a.courseCode === courseCode)
        .map(a => a.tutorEmail);

      const shortlisted = shortlistedTutors
        .filter(s => s.courseCode === courseCode)
        .map(s => s.tutorEmail);

      const shortlistNoteMap: Record<string, ShortlistNote[]> = {};
      for (const note of shortlistNotes) {
        if (note.courseCode === courseCode) {
          if (!shortlistNoteMap[note.tutorEmail]) {
            shortlistNoteMap[note.tutorEmail] = [];
          }
          shortlistNoteMap[note.tutorEmail].push({
            lecturerEmail: note.lecturerEmail,
            message: note.message,
            date: note.date,
          });
        }
      }

      const lecturerShortlistMap: LecturerShortList = {};
      for (const row of lecturerShortlists) {
        if (row.courseCode === courseCode) {
          if (!lecturerShortlistMap[row.lecturerEmail]) {
            lecturerShortlistMap[row.lecturerEmail] = [];
          }
          lecturerShortlistMap[row.lecturerEmail][row.rank] = row.tutorEmail;
        }
      }

      const preferredSkillList = preferredSkills
        .filter(s => s.courseCode === courseCode)
        .map(s => s.skill);

      classRecords[courseCode] = {
        courseCode: course.courseCode,
        courseTitle: course.courseTitle,
        lecturerEmails: lecturers,
        tutorEmails: tutors,
        tutorsApplied: applications,
        tutorsShortlist: shortlisted.map(tutorEmail => ({
          tutorEmail,
          notes: shortlistNoteMap[tutorEmail] || []
        })),
        preferredSkills: preferredSkillList,
        fullTimefriendly: course.fullTimeFriendly,
        partTimeFriendly: course.partTimeFriendly,
        lecturerShortlist: lecturerShortlistMap,
      };
    }
    return classRecords;
  } catch (err) {
    console.error("Error hydrating class records:", err);
    return {};
  }
}




const fetchAllCourses = async () => {
    try {
        const data = await courseService.getAllCourses();
        return data;
    }
    catch (error) {
        console.error("Error fetching all courses from DB in 'fetchAllCourses' function in classDataProvider");
    }
}

const fetchCourse = async (courseCode: string) => {
    try {
        const data = await courseService.getCourseByCode(courseCode);
        return data;
    }
    catch (error){
        console.error("Error fetching " + courseCode + " from the DB in 'fetchCourse' function in classDataProvider");
    }
}

const removeCourse = async (courseCode: string) => {
    try {
        const data = await courseService.deleteCourse(courseCode);
    }
    catch (error){
        console.error("Error delete course: " + courseCode + " from the DB in function remove course");
    }
} 

const createLecturer = async (courseCode: string, email: string) => {
    try {
        const data = await courseService.createCourseLecturer(courseCode,  {lecturerEmail: email, courseCode: courseCode});
        return data;
    } catch (error) {
        console.error("Error creating course lecturer:", error);
        return null;
    }
};

const fetchLecturer = async (CourseCode: string) => {
    try {
        const data = await courseService.getLecturerByCourseCode(CourseCode);
         return data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return null;
        }

        console.error("Unexpected error fetching user:", error);
        return null;   
     }
};

const createShortlistedTutor = async (courseCode: string, email: string) => {
    try {
        const data = await courseService.createShortlistedTutor(courseCode,  {tutorEmail: email, courseCode: courseCode});
        return data;
    } catch (error) {
        console.error("Error creating tutor lecturer:", error);
        return null;
    }
}

const createPreferredSkill = async (courseCode: string, skill: string) => {
    try {
        const data = await courseService.createPreferredSkill(courseCode,  {skill: skill, courseCode: courseCode});
        return data;
    } catch (error) {
        console.error("Error creating preferred skill", error);
        return null;
    }
}

const fetchPreferredSkills = async (courseCode: string) => {
    try {
        const experienceData = await courseService.getPreferredSkills(courseCode);
        return experienceData;
    }
    catch (error) {
        console.error("Error getting preferred skills");
        return null;
    }
}

const removePreferredSkill = async (courseCode: string, skill: string) => {
    try {
        const userSkills = await fetchPreferredSkills(courseCode);
        if (userSkills) {
            // Try to find a Skill object that matches the skill string
            const matchingSkill = userSkills.find(s => s.skill === skill);

            if (matchingSkill) {
                await courseService.deletePreferredSkill(courseCode, matchingSkill.skill)
            }
        }
    }
    catch(error) {
        console.error("Error removing chosen skill");
    }
}



// Create context
const ClassDataContext = createContext<ClassDataProvision | undefined>(undefined);

export const ClassDataProvider = ({ children }: { children: ReactNode }) => {
    // lecturer functions

    const [classRecords, setClassRecords] = useState<ClassRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecords = async () => {
        const data = await getClassRecords(); // fetch and compose your ClassRecord object
        setClassRecords(data);
        setIsLoading(false);
        };

        fetchRecords();
    }, []);

    const saveClassRecords = async (classRecords: ClassRecord): Promise<void> => {
    for (const courseCode in classRecords) {
        const record = classRecords[courseCode];
        try {
        // Update or create the course
        await courseService.updateCourse(courseCode, {
            courseTitle: record.courseTitle,
            partTimeFriendly: record.partTimeFriendly,
            fullTimeFriendly: record.fullTimefriendly,
        });

        // Delete and recreate CourseLecturers
        try {
            await removeCourse(courseCode); // assuming it clears lecturers too
        }
        catch (error) {
            console.error("SCR - Failed to remove course with given code: " + courseCode);
        }
        await courseService.createCourse({ // recreate course so we can re-add lecturers
            courseCode,
            courseTitle: record.courseTitle,
            partTimeFriendly: record.partTimeFriendly,
            fullTimeFriendly: record.fullTimefriendly,
          });

        const newCourse = await courseService.getCourseByCode(courseCode);
        if (!newCourse) {
            throw new Error(`Course ${courseCode} not found after creation`);
        }
        for (const lecturerEmail of record.lecturerEmails) {
            await courseService.createCourseLecturer(courseCode, { courseCode, lecturerEmail });
        }

        // Course Tutors
        for (const tutorEmail of record.tutorEmails) {
            await courseService.createCourseTutor(courseCode, { courseCode, tutorEmail });
        }

        // Tutor Applications
        for (const tutorEmail of record.tutorsApplied) {
            await courseService.createTutorApplication(courseCode, { courseCode, tutorEmail });
        }

        // Shortlisted Tutors
        for (const shortlistEntry of record.tutorsShortlist) {
            await courseService.createShortlistedTutor(courseCode, {
            courseCode,
            tutorEmail: shortlistEntry.tutorEmail,
            });

            for (const note of shortlistEntry.notes) {
            await courseService.createShortlistNote(
                courseCode,
                shortlistEntry.tutorEmail,
                {    
                courseCode,
                tutorEmail: shortlistEntry.tutorEmail,
                lecturerEmail: note.lecturerEmail,
                message: note.message,
                date: note.date,
                }
            );
            }
        }

        // Preferred Skills
        for (const skill of record.preferredSkills) {
            try {
                await createPreferredSkill(courseCode, skill);
            }
            catch (error) {
                console.error("SCR: Error trying to create preferred skill");
            }
        }

        // Lecturer Shortlist
        for (const [lecturerEmail, rankedList] of Object.entries(record.lecturerShortlist)) {
            for (let rank = 0; rank < rankedList.length; rank++) {
            const tutorEmail = rankedList[rank];
            if (tutorEmail) {
                await courseService.createLecturerShortlist(courseCode, lecturerEmail, {
                courseCode,
                lecturerEmail,
                tutorEmail,
                rank,
                });
            }
            }
        }
        setClassRecords(classRecords)
        } catch (err) {
        console.error(`Error dehydrating course ${courseCode}:`, err);
        }
    }
    };

    const addLecturer = async (courseCode: string, lecturerEmail: string): Promise<boolean> => {
        
        const lecturer = await createLecturer(courseCode, lecturerEmail)

        if (!lecturer) {
            console.warn(`There is no class with course code ${courseCode} or lecturer with email ${lecturerEmail}`);
            return false;
        }
        
        return true;
    };

    const removeLecturer = async (courseCode: string, lecturerEmail: string): Promise<boolean> => {
        const classRecords = await getClassRecords();
        const currClass = classRecords[courseCode];

        if (!currClass) {
            // return message if there is no class with that code
            console.warn(`There is no class with course code ${courseCode}`);
            return false;
        }

        const oldLength : number = currClass.lecturerEmails.length;

        // filter out all matching lecturer emails
        currClass.lecturerEmails = currClass.lecturerEmails.filter((lecturer) => {
            return (lecturer !== lecturerEmail);
        });

        // if no elements were filtered send an error message
        if (oldLength === currClass.lecturerEmails.length){
            console.warn(`Lecturer ${lecturerEmail} does not teach class with course code ${courseCode}`);
            return false;
        }

        // save changes

        delete classRecords[courseCode].lecturerShortlist[lecturerEmail];

        saveClassRecords(classRecords);
        return true;
    };

    // application methods
    const acceptApplication = async (courseCode: string, tutorEmail: string): Promise<boolean> => {
        const classRecords = await getClassRecords();
        
        const currClass = classRecords[courseCode];

        if (!currClass) {
            // return message if there is no class with that code
            console.warn(`There is no class with course code ${courseCode}`);
            return false
        };

        // move from tutorApplication to tutors
        currClass.tutorEmails.push(tutorEmail);
        currClass.tutorsApplied = currClass.tutorsApplied.filter((tutor) => {
            return (tutor !== tutorEmail);
        });

        const reject: boolean =  await rejectApplication(courseCode, tutorEmail);

        if (!reject){
            console.warn(`Tutor ${tutorEmail} does not teach class with course code ${courseCode}`);
            return false;
        }

        // if the applicant is in the short list remove them
        if (currClass.tutorsShortlist.some(tutor => tutor.tutorEmail === tutorEmail)) {
            removeFromShortlist(courseCode, tutorEmail);
        }

        saveClassRecords(classRecords);
        return true;
    };

    const rejectApplication = async (courseCode: string, tutorEmail: string): Promise<boolean> => {
        const classRecords = await getClassRecords();

        const currClass = classRecords[courseCode];

        if (!currClass) {
            // if there is no class with that code an error is returned 
            console.warn(`There is no class with course code ${courseCode}`);
            return false;
        }

        const oldLength : number = currClass.tutorsApplied.length;

        // filter out matching emails from tutorsApplied and short list
        currClass.tutorsApplied = currClass.tutorsApplied.filter((tutor) => {
            return tutor !== tutorEmail;
        });
        currClass.tutorsShortlist = currClass.tutorsShortlist.filter((tutorData) => {
            return tutorData.tutorEmail !== tutorEmail;
        });

        // if no elements were filtered send an error message
        if (oldLength === currClass.tutorsApplied.length){
            console.warn(`Tutor ${tutorEmail} does not teach class with course code ${courseCode}`);
            return false;
        }

        // if the applicant is in the short list remove them
        if (currClass.tutorsShortlist.some(tutor => tutor.tutorEmail === tutorEmail)) {
            removeFromShortlist(courseCode, tutorEmail);
        }

        saveClassRecords(classRecords);
        return true;
    };

    const addApplication = async (courseCode: string, tutorEmail: string): Promise<boolean> => {
        const classRecords = await getClassRecords();
        
        const currClass = classRecords[courseCode];
        
        // if the courseCode doesn't exist send an error
        if (!currClass) {
            console.warn(`There is no class with course code ${courseCode}`);
            return false;
        }
    
        // Check if tutor has already applied
        if (currClass.tutorsApplied.includes(tutorEmail)) {
            console.warn(`Tutor with email ${tutorEmail} has already applied to ${courseCode}`);
            return false;
        }
    
        // Add the tutor's email to the tutorsApplied list and save to localStorage
        currClass.tutorsApplied.push(tutorEmail);
        saveClassRecords(classRecords);
        
        return true;
    };

    const removeFromShortlist = async(courseCode: string, tutorEmail: string): Promise<boolean> => {
        const classRecords = await getClassRecords();

        const currClass = classRecords[courseCode];

        if (!currClass) {
            // if there is no class with that code an error is returned 
            console.warn(`There is no class with course code ${courseCode}`);
            return false;
        }

        const oldLength : number = currClass.tutorsApplied.length;

        // filter out matching emails from short list
        currClass.tutorsShortlist = currClass.tutorsShortlist.filter((tutorData) => {
            return tutorData.tutorEmail !== tutorEmail;
        });

        // if no elements were filtered send an error message
        if (oldLength === currClass.tutorsShortlist.length){
            console.warn(`Tutor ${tutorEmail} is not shortlisted in class ${courseCode}`);
            return false;
        }

        // filter out in all instances of that tutor in all lecturerShortLists
        for (const lecturerEmail in currClass.lecturerShortlist){
            currClass.lecturerShortlist[lecturerEmail] = currClass.lecturerShortlist[lecturerEmail].filter((tutor) => {
                return tutor !== tutorEmail;
            });
        }



        saveClassRecords(classRecords);
        return true;
    };

    const addToShortlist = async (courseCode: string, tutorEmail: string): Promise<boolean> => {

        const shortListedTutor = await createShortlistedTutor(courseCode, tutorEmail);
        
        // if the courseCode doesn't exist send an error
        if (!shortListedTutor) {
            console.warn(`There is no class with course code ${courseCode} or tutor with email ${tutorEmail}`);
            return false;
        }
    
        return true;
    };

    
    const changeCourseTitle = async (courseCode: string, newTitle: string): Promise<boolean> => {
        const classRecords = await getClassRecords();
        const currClass = classRecords[courseCode];

        if (!currClass) {
            // if there is no class with that code an error is returned 
            console.warn(`There is no class with course code ${courseCode}`);
            return false;
        }

        currClass.courseTitle = newTitle;
        saveClassRecords(classRecords);
        return true;
    };

    const addPreferredSkill = async (courseCode: string, newSkill: string): Promise<boolean> => {
        
        
        // todo maximum of MAX_NUM_SKILLS skills allowed
        // if (currClass.preferredSkills.length + 1 > MAX_NUM_SKILLS){
        //     console.warn(`Maximum of ${MAX_NUM_SKILLS} allowed per user.`);
        //     return false;
        //}

        const addedSkill = await createPreferredSkill(courseCode, newSkill);

        if (!addedSkill) {
            // if there is no class with that code an error is returned 
            console.warn(`There is no class with course code ${courseCode}`);
            return false;
        }


        

        return true;
    };

    const removePreferredSkill = async (courseCode: string, skill: string): Promise<boolean> => {
        const classRecords: ClassRecord = await getClassRecords();

        if (!classRecords){return false;}
        
        const currUserRecord = classRecords[courseCode];
        if (currUserRecord) { // check whether record actually exists

            // Ensure skills array exists before operating on it
            if (!currUserRecord.preferredSkills) {
                console.warn(`Course with code ${courseCode} does not have any skills to remove`);
                return false;
            }
            
            // get old length of skills array
            const oldLength = currUserRecord.preferredSkills.length;

            // filter out all skills that match
            currUserRecord.preferredSkills = currUserRecord.preferredSkills.filter((recordedSkill) => {
                return (recordedSkill.trim() !== skill.trim());
            });

            // if the length stays the same show an error that no skills matched
            if (oldLength == currUserRecord.preferredSkills.length){
                console.warn(`Class with code ${courseCode} has no called ${skill} to remove`)
                return false;
            }

            // Update localStorage with new skills array
            saveClassRecords(classRecords);
            return true;
        }
        else {
            // if there is no record with that code show error 
            console.warn(`Class with code ${courseCode} cannot be foundx`);
        }

        return false;
    };

    const initializeLecturerShortlist =  async (courseCode: string, lecturerEmail: string): Promise<boolean> => {
        const classRecords = await getClassRecords();
        const currClass = classRecords[courseCode];

        if (!currClass) {
            console.warn(`There is no class with course code ${courseCode}`);
            return false;
        }
        
        if (!currClass.lecturerShortlist[lecturerEmail]) {
            // add lecturer's short list
            currClass.lecturerShortlist[lecturerEmail] = currClass.tutorsShortlist.map(tutor => tutor.tutorEmail);
            saveClassRecords(classRecords);
            return true;
        }
        // If that lecturer already has a shortlist skip initalization
        return false;
    };

    const orderLecturerShortList = async(courseCode: string, tutorEmail: string, lecturerEmail: string, position: number):  Promise<boolean> => {
        const classRecords = await getClassRecords();
        const currClass = classRecords[courseCode];

        // initialize array if not done so already
        initializeLecturerShortlist(courseCode, lecturerEmail);

        // error checking
        if (!currClass) {
            console.warn(`There is no class with course code ${courseCode}`);
            return false;
        }
        if (!currClass.lecturerEmails.includes(lecturerEmail)) {
            console.warn(`There is no lecturer with email of ${lecturerEmail}`);
            return false;
        }
        if (!currClass.tutorsShortlist.some(tutor => tutor.tutorEmail === tutorEmail)) {
            console.warn(`There is no tutor shortlisted with email of ${tutorEmail}`);
            return false;
        }
        if (position > currClass.lecturerShortlist[lecturerEmail].length || position < 0) {
            console.warn(`That is an invalid position to place ${tutorEmail}`);
            return false;
        }
        
        if (currClass.lecturerShortlist[lecturerEmail]) {
            // move the tutor email from it's position to the given position
            // get current position
            const currPos = currClass.lecturerShortlist[lecturerEmail].indexOf(tutorEmail);

            // use splice to remove and move position
            if (currPos !== -1) {
                const [movedTutor] = currClass.lecturerShortlist[lecturerEmail].splice(currPos, 1);
                currClass.lecturerShortlist[lecturerEmail].splice(position, 0, movedTutor);
            }

            saveClassRecords(classRecords);
            return true;
        }
        // If that lecturer does not have a shortlist return error
        console.warn(`There is no shortlist for ${lecturerEmail}`);
        return false;
    }

    const addNote = useCallback (async(courseCode: string, tutorEmail: string, lecturerEmail: string, message: string): Promise<boolean> => {
        const classRecords = await getClassRecords();
        const currClass = classRecords[courseCode];

        // error checking
        if (!currClass) {
            console.warn(`There is no class with course code ${courseCode}`);
            return false;
        }
        if (!currClass.lecturerEmails.includes(lecturerEmail)) {
            console.warn(`There is no lecturer with email of ${lecturerEmail}`);
            return false;
        }
        if (!currClass.tutorsShortlist.some(tutor => tutor.tutorEmail === tutorEmail)) {
            console.warn(`There is no tutor shortlisted with email of ${tutorEmail}`);
            return false;
        }
        
        for (const tutorShortlisted of currClass.tutorsShortlist){
            if (tutorShortlisted.tutorEmail === tutorEmail){
                tutorShortlisted.notes.push({
                    lecturerEmail: lecturerEmail,
                    message: message,
                    date: new Date().toISOString(), // ISO format date string 
                });
                saveClassRecords(classRecords);
                return true;
            }
        }
        
        console.warn(`There is no tutor shortlisted with email of ${tutorEmail}`);
        return false;

    }, []);

    const deleteNote = async (
        courseCode: string,
        tutorEmail: string,
        lecturerEmail: string,
        message: string
      ): Promise<boolean> => {
        const classRecords = await getClassRecords();
        const currClass = classRecords[courseCode];
      
        // error checking
        if (!currClass) {
            console.warn(`There is no class with course code ${courseCode}`);
            return false;
        }
        if (!currClass.lecturerEmails.includes(lecturerEmail)) {
            console.warn(`There is no lecturer with email of ${lecturerEmail}`);
            return false;
        }
        const tutor = currClass.tutorsShortlist.find(t => t.tutorEmail === tutorEmail);
        if (!tutor) {
            console.warn(`There is no tutor shortlisted with email of ${tutorEmail}`);
            return false;
        }
        
        // get position of note in list
        const noteIndex = tutor.notes.findIndex(
          note => note.lecturerEmail === lecturerEmail && note.message === message
        );
      
        if (noteIndex === -1) {
            console.warn(`There is no note matching that description`);
            return false;
        }
        
        // splice note to remove 
        tutor.notes.splice(noteIndex, 1);
        saveClassRecords(classRecords);
        return true;
    };

    // returns an empty array if there is an error or simply no notes to display
    const getTutorNotes = async (
        courseCode: string,
        tutorEmail: string
      ): Promise<ShortlistNote[]> => {
        const classRecords = await getClassRecords();
        const currClass = classRecords[courseCode];
      
        // Error checking
        if (!currClass) {
          console.warn(`No class found with course code: ${courseCode}`);
          return [];
        }
        
        // find entry for specific tutor
        const tutorEntry = currClass.tutorsShortlist.find(
          (tutor) => tutor.tutorEmail === tutorEmail
        );
      
        if (!tutorEntry) {
          console.warn(`Tutor with email ${tutorEmail} not found in shortlist`);
          return [];
        }
        
        //return the notes array
        return tutorEntry.notes || [];
    };
      

    const changeAvailability = async (courseCode: string, fullTime: boolean, partTime: boolean): Promise<boolean> => {
        const classRecords = await getClassRecords();
        const currClass = classRecords[courseCode];

        if (!currClass) {
            // if there is no class with that code an error is returned 
            console.warn(`There is no class with course code ${courseCode}`);
            return false;
        }

        // update the availability
        currClass.fullTimefriendly = fullTime;
        currClass.partTimeFriendly = partTime;
        
        saveClassRecords(classRecords);
        return true;
    };


    // const saveClassRecords = (classRecords: ClassRecord) => {
    //     localStorage.setItem("classData", JSON.stringify(classRecords));
    // };

    useEffect(() => {
        // !!! Load dummy data
        let shortlist: LecturerShortList = {};
        shortlist["lecturer123@gmail.com"] = ["example123@gmail.com", "luca@student.rmit.edu.au", "brad@student.rmit.edu.au"];
        const classRecord = classRecords;
        if (classRecord) {
        classRecord["COSC2804"] = {
            courseCode: "COSC2804",
            courseTitle: "Introduction to Programming",
            lecturerEmails: ["lecturer123@gmail.com"],
            tutorEmails: [],
            tutorsApplied: ["luca@student.rmit.edu.au", "example123@gmail.com", "brad@student.rmit.edu.au"],
            tutorsShortlist: [
                {tutorEmail: "example123@gmail.com", notes: []},
                {tutorEmail: "luca@student.rmit.edu.au", notes: []},
                {tutorEmail: "brad@student.rmit.edu.au", notes: []}
            ],
            preferredSkills: ["JavaScript", "Python"],
            partTimeFriendly: true,
            fullTimefriendly: false,
            lecturerShortlist: shortlist,
        };
        shortlist = {};
        shortlist["lecturer123@gmail.com"] = [
            "jeffrey@student.rmit.edu.au",
            "trent@student.rmit.edu.au",
            "example123@gmail.com",
            "brad@student.rmit.edu.au",
            "luca@student.rmit.edu.au"
          ];
        shortlist["nathaniel@rmit.edu.au"] = [
            "luca@student.rmit.edu.au",
            "example123@gmail.com",
            "brad@student.rmit.edu.au",
            "jeffrey@student.rmit.edu.au",
            "trent@student.rmit.edu.au"
        ];
        shortlist["matt@rmit.edu.au"] = [
            "trent@student.rmit.edu.au",
            "brad@student.rmit.edu.au",
            "luca@student.rmit.edu.au",
            "jeffrey@student.rmit.edu.au",
            "example123@gmail.com"
          ];
        classRecord["COSC2801"] = {
            courseCode: "COSC2801",
            courseTitle: "Java Programming Bootcamp",
            lecturerEmails: ["lecturer123@gmail.com", "nathaniel@rmit.edu.au", "matt@rmit.edu.au"],
            tutorEmails: [],
            tutorsApplied: ["example123@gmail.com", "luca@student.rmit.edu.au", "trent@student.rmit.edu.au", "brad@student.rmit.edu.au", "jeffrey@student.rmit.edu.au"],
            tutorsShortlist: [
                {tutorEmail: "example123@gmail.com", notes: []},
                {tutorEmail: "luca@student.rmit.edu.au", notes: []},
                {tutorEmail: "trent@student.rmit.edu.au", notes: []},
                {tutorEmail: "brad@student.rmit.edu.au", notes: []},
                {tutorEmail: "jeffrey@student.rmit.edu.au", notes: []}
            ],
            preferredSkills: ["Java"],
            partTimeFriendly: true,
            fullTimefriendly: false,
            lecturerShortlist: shortlist,
        }
        shortlist = {};
        classRecord["COSC2888"] = {
            courseCode: "COSC2888",
            courseTitle: "Java Programming Studio",
            lecturerEmails: ["lecturer123@gmail.com"],
            tutorEmails: [],
            tutorsApplied: ["tommy@student.rmit.edu.au"],
            tutorsShortlist: [],
            preferredSkills: ["Java", "MCPP", "LC3"],
            partTimeFriendly: true,
            fullTimefriendly: false,
            lecturerShortlist: shortlist,
        }
        shortlist["lecturer123@gmail.com"] = [
            "jeffrey@student.rmit.edu.au",
            "alysha@student.rmit.edu.au",
            "example123@gmail.com",
            "brad@student.rmit.edu.au",
            "rupert@student.rmit.edu.au"
          ];
        shortlist["nathaniel@rmit.edu.au"] = [
        "jeffrey@student.rmit.edu.au",
        "alysha@student.rmit.edu.au",
        "brad@student.rmit.edu.au",
        "example123@gmail.com",
        "rupert@student.rmit.edu.au"
        ];
        classRecord["COSC2274"] = {
            courseCode: "COSC2274",
            courseTitle: "Software Requirements Engineering",
            lecturerEmails: ["lecturer123@gmail.com", "nathaniel@rmit.edu.au"],
            tutorEmails: [],
            tutorsApplied: [
                "jeffrey@student.rmit.edu.au",
                "alysha@student.rmit.edu.au",
                "example123@gmail.com",
                "brad@student.rmit.edu.au",
                "rupert@student.rmit.edu.au"
              ],
            tutorsShortlist: [
                {tutorEmail: "jeffrey@student.rmit.edu.au", notes: []},
                {tutorEmail: "alysha@student.rmit.edu.au", notes: []},
                {tutorEmail: "example123@gmail.com", notes: []},
                {tutorEmail: "brad@student.rmit.edu.au", notes: []},
                {tutorEmail: "rupert@student.rmit.edu.au", notes: []}
            ],
            preferredSkills: ["Python"],
            partTimeFriendly: true,
            fullTimefriendly: false,
            lecturerShortlist: shortlist,
        }
        saveClassRecords(classRecord);
    }

        console.log("Dummy class data loaded");
        addNote("COSC2801", "example123@gmail.com", "lecturer123@gmail.com", "Seems like a good fit, need interview to confirm");
        addNote("COSC2801", "example123@gmail.com", "lecturer123@gmail.com", "after interview, John has my approval to tutor the class");        
        // !!! end loading dummy data
    }, [addNote]);

    return (
        <ClassDataContext.Provider
            value={{
                classRecords,
                isLoading,
                addLecturer,
                removeLecturer,
                acceptApplication,
                rejectApplication,
                addApplication,
                addToShortlist,
                removeFromShortlist,
                changeCourseTitle,
                addPreferredSkill,
                removePreferredSkill,
                initializeLecturerShortlist,
                orderLecturerShortList,
                addNote,
                deleteNote,
                getTutorNotes,
                changeAvailability,
                getClassRecords,
                saveClassRecords,
            }}
        >
            {children}
        </ClassDataContext.Provider>
    );
};

export const useClassData = (): ClassDataProvision => {
    const context = useContext(ClassDataContext);
    if (!context) {
        throw new Error("useClassData must be used within a ClassDataProvider");
    }
    return context;
};
