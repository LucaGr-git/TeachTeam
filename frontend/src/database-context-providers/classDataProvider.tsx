import { courseService } from "@/services/api";
import { CourseLecturer } from "@/types/types";
import { createContext, useEffect, useContext, ReactNode, useCallback } from "react";

export const MAX_NUM_SKILLS: number = 10;

// Interface for what users of the hook will be able to use
export interface ClassDataProvision {
    addLecturer: (courseCode: string, lecturer: string) =>  Promise<boolean>;
    removeLecturer: (courseCode: string, lecturer: string) => boolean;

    acceptApplication: (courseCode: string, tutor: string) => boolean;
    rejectApplication: (courseCode: string, tutor: string) => boolean;
    addApplication: (courseCode: string, tutorEmail: string) => boolean;

    addToShortlist: (courseCode: string, tutorEmail: string) => Promise<boolean>;
    removeFromShortlist: (courseCode: string, tutorEmail: string) => boolean;

    changeCourseTitle: (courseCode: string, newTitle: string) => boolean;

    addPreferredSkill: (courseCode: string, skill: string) => Promise<boolean>;
    removePreferredSkill: (courseCode: string, skill: string) => Promise<boolean>;

    initializeLecturerShortlist: (courseCode: string, lecturerEmail: string) => boolean;
    orderLecturerShortList: (courseCode: string, tutorEmail: string, lecturerEmail: string, position: number) => boolean;

    addNote: (courseCode: string, tutorEmail: string, lecturerEmail: string, message: string) => boolean;
    deleteNote: (courseCode: string, tutorEmail: string, lecturerEmail: string, message: string) => boolean;

    getTutorNotes: (courseCode: string, tutorEmail: string) => ShortlistNote[];

    changeAvailability: (courseCode: string, fullTime: boolean, partTime: boolean) => boolean;

    getClassRecords: () => ClassRecord;
    saveClassRecords: (classRecords: ClassRecord) => void;
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

const createPreferredSkill = async (courseCode: string, email: string) => {
    try {
        const data = await courseService.createPreferredSkill(courseCode,  {skill: email, courseCode: courseCode});
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
    const addLecturer = async (courseCode: string, lecturerEmail: string): Promise<boolean> => {
        
        const lecturer = await createLecturer(courseCode, lecturerEmail)

        if (!lecturer) {
            console.warn(`There is no class with course code ${courseCode} or lecturer with email ${lecturerEmail}`);
            return false;
        }
        
        return true;
    };

    const removeLecturer = (courseCode: string, lecturerEmail: string): boolean => {
        const classRecords = getClassRecords();
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
    const acceptApplication = (courseCode: string, tutorEmail: string): boolean => {
        const classRecords = getClassRecords();
        
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

        const reject: boolean =  rejectApplication(courseCode, tutorEmail);

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

    const rejectApplication = (courseCode: string, tutorEmail: string): boolean => {
        const classRecords = getClassRecords();

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

    const addApplication = (courseCode: string, tutorEmail: string): boolean => {
        const classRecords = getClassRecords();
        
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

    const removeFromShortlist = (courseCode: string, tutorEmail: string): boolean => {
        const classRecords = getClassRecords();

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

    
    const changeCourseTitle = (courseCode: string, newTitle: string): boolean => {
        const classRecords = getClassRecords();
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
        const classRecords: ClassRecord = getClassRecords();

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

    const initializeLecturerShortlist =  (courseCode: string, lecturerEmail: string): boolean => {
        const classRecords = getClassRecords();
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

    const orderLecturerShortList = (courseCode: string, tutorEmail: string, lecturerEmail: string, position: number):  boolean => {
        const classRecords = getClassRecords();
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

    const addNote = useCallback((courseCode: string, tutorEmail: string, lecturerEmail: string, message: string): boolean => {
        const classRecords = getClassRecords();
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

    const deleteNote = (
        courseCode: string,
        tutorEmail: string,
        lecturerEmail: string,
        message: string
      ): boolean => {
        const classRecords = getClassRecords();
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
    const getTutorNotes = (
        courseCode: string,
        tutorEmail: string
      ): ShortlistNote[] => {
        const classRecords = getClassRecords();
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
      

    const changeAvailability = (courseCode: string, fullTime: boolean, partTime: boolean): boolean => {
        const classRecords = getClassRecords();
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

    const getClassRecords = (): ClassRecord => {
        const classData = localStorage.getItem("classData");
        return classData ? JSON.parse(classData) : {};
    };

    const saveClassRecords = (classRecords: ClassRecord) => {
        localStorage.setItem("classData", JSON.stringify(classRecords));
    };

    useEffect(() => {
        // !!! Load dummy data
        let shortlist: LecturerShortList = {};
        shortlist["lecturer123@gmail.com"] = ["example123@gmail.com", "luca@student.rmit.edu.au", "brad@student.rmit.edu.au"];
        const classRecords: ClassRecord = getClassRecords();
        classRecords["COSC2804"] = {
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
        classRecords["COSC2801"] = {
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
        classRecords["COSC2803"] = {
            courseCode: "COSC2803",
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
        classRecords["COSC2274"] = {
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

        localStorage.setItem("classData", JSON.stringify(classRecords));
        console.log("Dummy class data loaded");
        addNote("COSC2801", "example123@gmail.com", "lecturer123@gmail.com", "Seems like a good fit, need interview to confirm");
        addNote("COSC2801", "example123@gmail.com", "lecturer123@gmail.com", "after interview, John has my approval to tutor the class");        
        // !!! end loading dummy data
    }, [addNote]);

    return (
        <ClassDataContext.Provider
            value={{
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
