import { courseService } from "@/services/api";
import { CourseLecturer, ShortlistedTutor, ShortlistNote } from "@/types/types";
import { get } from "http";
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
export interface RecordShortlistNote {
    lecturerEmail: string,
    message: string,
    date: string, // ISO format date string 
}
// interface for shortlisted applicants
export interface ShortlistedInfo {
    tutorEmail: string,
    notes: RecordShortlistNote[];
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

      const shortlistNoteMap: Record<string, RecordShortlistNote[]> = {};
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
    console.log(classRecords);
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
    console.log("Fetching lecturer for course code:", CourseCode);
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

const removeLecturer = async (courseCode: string, lecturerEmail: string) => {
    try {
        await courseService.deleteCourseLecturer(courseCode, lecturerEmail);
    }
    catch (error) {
        console.error("Error removing user in class data provider: " + error);
    }
}

const createShortlistedTutor = async (courseCode: string, email: string) => {
    try {
        const data = await courseService.createShortlistedTutor(courseCode,  {tutorEmail: email, courseCode: courseCode});
        return data;
    } catch (error) {
        console.error("Error creating tutor lecturer:", error);
        return null;
    }
}

const fetchShortlistedTutor = async () => {
    try {
        const data = await courseService.getAllShortlistedTutors();
        return data;
    }
    catch(error){
        console.error("Unable to fetch ALL shortlisted tutor entities in classDataProvider: " + error);
    }
}

const removeShortlistedTutor = async (courseCode: string, tutorEmail: string) => {
    try {
        const data = await courseService.deleteShortlistedTutor(courseCode, tutorEmail);
        return data;
    }
    catch(error){
        console.error("Unable to remove Shortlisted Tutor entry in classDataProvider");
    }
}

const fetchAllShortlistNotes = async () => {
    try {
        const data = await courseService.getAllShortlistNotes();
        return data;
    }
    catch (error){
        console.error("Unable to fetch shortlist notes in classDataProvider: " + error);
    }
}

// const fetchShortlistNote = async () => {
//     try {
//         const data = await courseService.get
//     }
// }

const removeShortlistNote = async (noteID: string) => {
    try {
        const data = await courseService.deleteShortlistNote(noteID);
        return data;
    }
    catch (error) {
        console.error("Unable to remove shortlistNote with ID: " + noteID + ". Error: " + error);
    }
}

const createShortlistNote = async (courseCode: string, tutorEmail: string, lecturerEmail: string, note: string) => {
    try {
        const data = await courseService.createShortlistNote(courseCode, tutorEmail, {courseCode: courseCode, lecturerEmail: lecturerEmail, tutorEmail: tutorEmail, message: note, date: new Date().toISOString()});
        return data
    }
    catch (error){
        console.error("Unable to create shortlistNote entry in classDataProvider");
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

const removePrefSkill = async (courseCode: string, skill: string) => {
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

const fetchTutorApplications = async (courseCode: string) => {
    try {
        const data = await courseService.getTutorApplicationsByCourseCode(courseCode);
        return data;
    }
    catch(error) {
        console.error("Error fetching tutorApplications entity entries in classDataProvider");
    }
}

const removeTutorApplication = async (tutorEmail: string, courseCode: string) => {
    try {
        await courseService.deleteTutorApplication(tutorEmail, courseCode);
    }
    catch {
        console.error("Error removing tutor application in classDataProvider with these params: " + tutorEmail + " " + courseCode);
    }
}

const createTutorApplication = async (courseCode: string, tutorEmail: string) => {
    try {
        const data = await courseService.createTutorApplication(courseCode, {courseCode: courseCode, tutorEmail: tutorEmail});
        return data;
    }
    catch (error) {
        console.error("Error creating TutorApplication entry in classDataProvider: " + error);
    }
}

const createCourseTutor = async (courseCode: string, tutorEmail: string) => {
    try {
        const data = await courseService.createCourseTutor(courseCode, {courseCode: courseCode, tutorEmail: tutorEmail});
        return data
    }
    catch (error){
        console.error("Error creating courseTutor entity in classDataProvider");
    }
}



// Create context
const ClassDataContext = createContext<ClassDataProvision | undefined>(undefined);

export const ClassDataProvider = ({ children }: { children: ReactNode }) => {
    // lecturer functions

    const [classRecords, setClassRecords] = useState<ClassRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [version, setVersion] = useState(0);

    const refreshRecords= () => {
        const fetchRecords = async () => {
        const data = await getClassRecords(); // fetch and compose your ClassRecord object
        setClassRecords(data);
        setIsLoading(false);
        };

        fetchRecords();
    }

    useEffect (() => {
        refreshRecords();
    }, [])

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
        refreshRecords();
        return true;
    };

    const removeLecturer = async (courseCode: string, lecturerEmail: string): Promise<boolean> => {
        const classRecords = await getClassRecords();
        const currClass = await fetchCourse(courseCode);

        if (!currClass) {
            // return message if there is no class with that code
            console.warn(`There is no class with course code ${courseCode}`);
            return false;
        }   

        // Check if the courseLecturer entity exists before deleting it
        const lecturer = await fetchLecturer(courseCode);
        if (lecturer){
            const matchingLecturer = lecturer.find(lec => lec.lecturerEmail === lecturerEmail);
            if (matchingLecturer) {
                await removeLecturer(courseCode, lecturerEmail);
            }
        }
        refreshRecords();
        return true;
    };

    // application methods
    const acceptApplication = async (courseCode: string, tutorEmail: string): Promise<boolean> => {        
        const currClass = await fetchCourse(courseCode);

        if (!currClass) {
            // if there is no class with that code an error is returned 
            console.warn(`There is no class with course code ${courseCode}`);
            return false;
        }

        // move from tutorApplication to tutors
        // create courseTutor entity
        await createCourseTutor(courseCode, tutorEmail);

        // this removes the tutorApplication field
        const reject: boolean =  await rejectApplication(courseCode, tutorEmail);

        if (!reject){
            console.warn(`Tutor ${tutorEmail} does not teach class with course code ${courseCode}`);
            return false;
        }

        // checking if needing to remove from tutorShortlist entity
        // if the applicant is in the short list remove them
        const shortlistedTutors = await fetchShortlistedTutor();
        if (shortlistedTutors) {
            const matchingTutor = shortlistedTutors.find(app => app.tutorEmail === tutorEmail && app.courseCode === courseCode);
            if (matchingTutor) {
                await removeShortlistedTutor(courseCode, tutorEmail);
            }
        }

        refreshRecords();
        return true;
    };

    const rejectApplication = async (courseCode: string, tutorEmail: string): Promise<boolean> => {
        const currClass = await fetchCourse(courseCode);

        if (!currClass) {
            // if there is no class with that code an error is returned 
            console.warn(`There is no class with course code ${courseCode}`);
            return false;
        }

        // Check if the application field exists
        const tutorApplication = await fetchTutorApplications(courseCode);
        if (tutorApplication) {
            const matchingApplication = tutorApplication.find(app => app.tutorEmail === tutorEmail);
            if (matchingApplication) {
                await removeTutorApplication(tutorEmail, courseCode);
            }
        }

        refreshRecords();
        



        // const oldLength : number = currClass.tutorsApplied.length;

        // // filter out matching emails from tutorsApplied and short list
        // currClass.tutorsApplied = currClass.tutorsApplied.filter((tutor) => {
        //     return tutor !== tutorEmail;
        // });
        // currClass.tutorsShortlist = currClass.tutorsShortlist.filter((tutorData) => {
        //     return tutorData.tutorEmail !== tutorEmail;
        // });

        // // if no elements were filtered send an error message
        // if (oldLength === currClass.tutorsApplied.length){
        //     console.warn(`Tutor ${tutorEmail} does not teach class with course code ${courseCode}`);
        //     return false;
        // }

        // // if the applicant is in the short list remove them
        // if (currClass.tutorsShortlist.some(tutor => tutor.tutorEmail === tutorEmail)) {
        //     removeFromShortlist(courseCode, tutorEmail);
        // }

        // saveClassRecords(classRecords);
        return true;
    };

    const addApplication = async (courseCode: string, tutorEmail: string): Promise<boolean> => {
        const currClass = await fetchCourse(courseCode);

        if (!currClass) {
            // if there is no class with that code an error is returned 
            console.warn(`There is no class with course code ${courseCode}`);
            return false;
        }
        

        // Check if tutor has already applied
        // Check if the application field exists
        const tutorApplication = await fetchTutorApplications(courseCode);
        if (tutorApplication) {
            const matchingApplication = tutorApplication.find(app => app.tutorEmail === tutorEmail);
            if (matchingApplication) {
                console.warn('The user already has an application');
                return false;
            }
        }
    
        // Add the tutor's email to the tutorsApplied list and save to localStorage
        await createTutorApplication(courseCode, tutorEmail);

        refreshRecords();
        
        return true;
    };

    const removeFromShortlist = async(courseCode: string, tutorEmail: string): Promise<boolean> => {
        const currClass = await fetchCourse(courseCode);

        if (!currClass) {
            // if there is no class with that code an error is returned 
            console.warn(`There is no class with course code ${courseCode}`);
            return false;
        }
        
        // Checking if the tutor is in shortlist
        const shortlistedTutors = await fetchShortlistedTutor();

        // Gonna check if the email and courseCode match
        if (shortlistedTutors) {
            const matchingTutor = shortlistedTutors.find(app => app.tutorEmail === tutorEmail && app.courseCode === courseCode);
            if (matchingTutor) {
                await removeShortlistedTutor(courseCode, tutorEmail);
            }
            else {
                console.warn(`Tutor ${tutorEmail} is not shortlisted in class ${courseCode}`);
                return false;
            }
        }

        refreshRecords();
        return true;
    };

    const addToShortlist = async (courseCode: string, tutorEmail: string): Promise<boolean> => {

        const shortListedTutor = await createShortlistedTutor(courseCode, tutorEmail);
        
        // if the courseCode doesn't exist send an error
        if (!shortListedTutor) {
            console.warn(`There is no class with course code ${courseCode} or tutor with email ${tutorEmail}`);
            return false;
        }
        
        refreshRecords();
        return true;
    };

    // TODO: REMOVE DEFUCT FUNCTION
    const changeCourseTitle = async (courseCode: string, newTitle: string): Promise<boolean> => {
        // const classRecords = await getClassRecords();
        // const currClass = classRecords[courseCode];

        // if (!currClass) {
        //     // if there is no class with that code an error is returned 
        //     console.warn(`There is no class with course code ${courseCode}`);
        //     return false;
        // }

        // currClass.courseTitle = newTitle;
        // saveClassRecords(classRecords);
        return true;
    };

    const addPreferredSkill = async (courseCode: string, newSkill: string): Promise<boolean> => {
        
        const preferredSkills = await fetchPreferredSkills(courseCode);
        console.log(preferredSkills);
        // todo maximum of MAX_NUM_SKILLS skills allowed
        if (preferredSkills && preferredSkills.length + 1 > MAX_NUM_SKILLS){
            console.warn(`Maximum of ${MAX_NUM_SKILLS} allowed per user.`);
            return false;
        }

        await createPreferredSkill(courseCode, newSkill);

        refreshRecords();
        return true;
    };

    const removePreferredSkill = async (courseCode: string, skill: string): Promise<boolean> => {
        console.log("Remove preferred skill function call");
        // check if the preferred skill entry exists
        const preferredSkills = await fetchPreferredSkills(courseCode);
        console.log(preferredSkills);

        if (preferredSkills){
            const matchingPreferredSkill = preferredSkills.find((app => app.courseCode === courseCode && app.skill === skill));
            if (matchingPreferredSkill) {
                await removePrefSkill(courseCode, skill);
                refreshRecords();
                return true;
            }
            else {
                console.warn("removePreferredSkill function has found no matching skills to delete");
            }
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
        const courses = await fetchCourse(courseCode);

        // error checking
        // Checking if the course exists
        if (!courses) {
            console.warn(`There is no class with course code ${courseCode}`);
            return false;
        }

        // Checking if the lecturer lectures that course
        const lecturer = await fetchLecturer(courseCode);

        let matchingLec: CourseLecturer | undefined;
        if (lecturer) {
            matchingLec = lecturer.find(match => match.lecturerEmail === lecturerEmail);
        }

        if (!matchingLec) {
            console.warn(`There is no lecturer with email of ${lecturerEmail}`);
            return false;
        }

        // Checking if there is a tutor shortlisted
        const shortlistedTutors = await fetchShortlistedTutor();
        let matchingTutor: ShortlistedTutor | undefined;
        if (shortlistedTutors) {
            matchingTutor = shortlistedTutors.find(match => match.courseCode === courseCode && match.tutorEmail === tutorEmail);
        }
        if (!matchingTutor) {
            console.warn(`There is no tutor shortlisted with email of ${tutorEmail}`);
            return false;
        }


        // Add note to the DB
        try {
            const data = await createShortlistNote(courseCode, tutorEmail, lecturerEmail, message);
            refreshRecords();
            return true;
        }
        catch {
            console.warn(`There is no tutor shortlisted with email of ${tutorEmail}`);
            return false;
        }
    }, []);

    const deleteNote = async (
        courseCode: string,
        tutorEmail: string,
        lecturerEmail: string,
        message: string
      ): Promise<boolean> => {
        const courses = await fetchCourse(courseCode);

        // error checking
        // Checking if the course exists
        if (!courses) {
            console.warn(`There is no class with course code ${courseCode}`);
            return false;
        }

        // Checking if the lecturer lectures that course
        const lecturer = await fetchLecturer(courseCode);

        let matchingLec: CourseLecturer | undefined;
        if (lecturer) {
            matchingLec = lecturer.find(match => match.lecturerEmail === lecturerEmail);
        }

        if (!matchingLec) {
            console.warn(`There is no lecturer with email of ${lecturerEmail}`);
            return false;
        }

        // Checking if there is a tutor shortlisted
        const shortlistedTutors = await fetchShortlistedTutor();
        let matchingTutor: ShortlistedTutor | undefined;
        if (shortlistedTutors) {
            matchingTutor = shortlistedTutors.find(match => match.courseCode === courseCode && match.tutorEmail === tutorEmail);
        }
        if (!matchingTutor) {
            console.warn(`There is no tutor shortlisted with email of ${tutorEmail}`);
            return false;
        }
        
        // Checking if matching note exists
        const shortListNotes = await fetchAllShortlistNotes();
        let matchingNote: ShortlistNote | undefined;
        if (shortListNotes){
            matchingNote = shortListNotes.find(match => match.courseCode === courseCode && match.message === message && match.lecturerEmail === lecturerEmail && match.tutorEmail === tutorEmail);
            if (matchingNote) {
                await removeShortlistNote(matchingNote.id?.toString()!);
            }
        }
        refreshRecords();
        return true;
    };

    // returns an empty array if there is an error or simply no notes to display
    const getTutorNotes = async (
        courseCode: string,
        tutorEmail: string
      ): Promise<ShortlistNote[]> => {
        const courses = await fetchCourse(courseCode);

        // error checking
        // Checking if the course exists
        if (!courses) {
            console.warn(`There is no class with course code ${courseCode}`);
            return [];
        }
        
        const shortlistedTutors = await fetchShortlistedTutor();
        let matchingTutor: ShortlistedTutor | undefined;
        if (shortlistedTutors) {
            matchingTutor = shortlistedTutors.find(match => match.courseCode === courseCode && match.tutorEmail === tutorEmail);
        }
        if (!matchingTutor) {
            console.warn(`There is no tutor shortlisted with email of ${tutorEmail}`);
            return [];
        }
        
        //return the notes array
        const shortlistNotes = await fetchAllShortlistNotes();
        if (shortlistNotes) {
            const matchingNotes = shortlistNotes.filter(
                note => note.courseCode === courseCode && note.tutorEmail === tutorEmail
            );
            refreshRecords();
            return matchingNotes;
        }
        return [];
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
        
        // saveClassRecords(classRecords);
        return true;
    };


    // const saveClassRecords = (classRecords: ClassRecord) => {
    //     localStorage.setItem("classData", JSON.stringify(classRecords));
    // };


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
