import { createContext, useEffect, useContext, ReactNode } from "react";
import { Qualification, Skill, Experience, User, NewSkill } from "@/types/types";
import { userService } from "@/services/api";

// const values for maximum number of skills, qualifications and experiences
export const MAX_NUM_SKILLS : number = 10;
export const MAX_NUM_QUALIFICATIONS : number = 15;
export const MAX_NUM_EXPERIENCES : number = 15;
// const values maximum size of skills, qualifications and experiences
export const MAX_CHAR_SKILLS : number = 15;
export const MAX_CHAR_QUALIFICATIONS : number = 35;
export const MAX_CHAR_EXPERIENCES : number = 35;


// interface for what users of the hook will be able to use
export interface UserDataProvision {
    // TODO: 10/06/2025 change all functions to DB functions
    addUserSkill: (skill: string, email: string) => Promise<boolean>;
    removeUserSkill: (skill: string, email: string) => Promise<boolean>;
    addUserExperience: (experience: experienceData, email: string) => boolean;
    removeUserExperience: (experience: experienceData, email: string) => boolean;
    addUserQualification: (newQualification: string, email: string) => Promise<boolean>;
    removeUserQualification: (qualification: string, email: string) => Promise<boolean>;
    changeAvailability: (fullTime: boolean, email: string) => boolean;
    getUserRecords: () => UserRecord ;
    getUser: (email: string) => Promise<User>;
    getUserSkills: (email: string) => Promise<Skill[]>;
    getUserQualifications: (email: string) => Promise<Qualification[]>;
    saveUserRecords: (userRecords: UserRecord) => void;
    // TODO: Rewire how get and save user records work.
    
}

// experience details
export interface experienceData {
    title: string;
    company: string;
    timeStarted: string; // this is an ISO string
    timeFinished?: string; // this is an ISO string
}

const fetchUser = async (email: string) => {
try {
    const data = await userService.getUserByEmail(email);
    return data;
} catch (error: any) {
    if (error.response && error.response.status === 404) {
    // This is expected during signup
    return null;
    }

    console.error("Unexpected error fetching user:", error);
    return null;   
    }
};

const createSkill = async (email: string, skill: NewSkill) => {
    try {
        const userWithSkill = await fetchUser(email);
        if (!userWithSkill) {
            console.warn("User not found for skill creation:", email);
            return null;
        }
        const skillData = await userService.addSkillToUser(userWithSkill.email, skill);
        return skillData;
    } catch (error) {
        console.error("Error creating skill for user:", error);
        return null;
    }
}

const createQualification = async (email: string, qualification: Qualification) => {
    try {
        const user = await fetchUser(email);
        if (!user) {
            console.warn("User not found for skill creation:", email);
            return null;
        }
        const qualificationData = await userService.addQualificationToUser(user.email, qualification);
        return qualificationData;
    } catch (error) {
        console.error("Error creating skill for user:", error);
        return null;
    }
}

const fetchUserSkills = async (email: string) => {
    try {
        const userSkillList = await fetchUser(email);
        if (!userSkillList) {
            console.warn("User not found for skill creation:", email);
            return null;
        }
        const skillData = await userService.getUserSkills(userSkillList.email);
        return skillData;
    }
    catch (error) {
        console.error("Error get getting user skills");
        return null;
    }
}

const fetchUserQualifications = async (email: string) => {
    try {
        const user = await fetchUser(email);
        if (!user) {
            console.warn("User not found for qualification creation:", email);
            return null;
        }
        const qualificationData = await userService.getUserQualifications(user.email);
        return qualificationData;
    }
    catch (error) {
        console.error("Error get getting user skills");
        return null;
    }
}

const removeSkill = async (email: string, id: number) => {
    try {
        const userSkills = await fetchUserSkills(email);
        if (userSkills) {
            // Try to find a Skill object that matches the skill string
            const matchingSkill = userSkills.find(s => s.ID === id);

            if (matchingSkill) {
                const userSkillToDelete = await userService.deleteSkill(matchingSkill?.email, matchingSkill?.ID!);
            }
        }
    }
    catch(error) {
        console.error("Error removing chosen skill");
    }
}

const removeQualification = async (email: string, id: number) => {
    try {
        const userQualifications = await fetchUserQualifications(email);
        if (userQualifications) {
            // Try to find a Qualification object that matches the qualification string
            const matchingQualification = userQualifications.find(s => s.ID === id);

            if (matchingQualification) {
                const userQualificationToDelete = await userService.deleteQualification(matchingQualification?.email, matchingQualification?.ID!);
            }
        }
    }
    catch(error) {
        console.error("Error removing chosen qualification");
    }
}


// interface for user's data details
export interface UserData {
    email: string; // ? unsure whether the key should be reused as a data member
    experience: experienceData[]; 
    skills: string[];
    qualifications: string[];
    fullTime: boolean;
}

// intended to be used with record<string, user> to put in localstorage
export type UserRecord = Record<string, UserData>;



    
// Create context
const UserDataContext = createContext<UserDataProvision | undefined>(undefined); 


export const UserDataProvider = ({ children }: { children: ReactNode }) => {

    

    useEffect(() => {   
        // !!! load dummy data 

        const userRecords: UserRecord = getUserRecords();

        userRecords["example123@gmail.com"] = {
            email: "example123@gmail.com",
            experience: [{title: "Soft Eng.",company: "Microsoft", timeStarted: new Date("2022-01-01").toISOString()}],
            skills: ["OOP", "C#", "Azure"],
            qualifications: ["Bachelor", "Cert."],
            fullTime: true,
        };
        userRecords["lecturer123@gmail.com"] = {
            email: "lecturer123@gmail.com",
            experience: [{
                title: "Soft Eng.",
                company: "Nintendo", 
                timeStarted: new Date("2020-01-01").toISOString(), 
                timeFinished: new Date("2022-01-01").toISOString()}],
            skills: ["Python", "Machine Learning"],
            qualifications: ["Master's", "Cert."],
            fullTime: true,
        };


        saveUserRecords(userRecords);

        
        // !!! end loading dummy data 

    }, []);


    // skill functions
    const addUserSkill = async (newSkill: string, email: string): Promise<boolean> => {
        // check length of skill
        if (newSkill.length > MAX_CHAR_SKILLS){
            console.warn(`Skill ${newSkill} is too long. Maximum length is ${MAX_CHAR_SKILLS} characters.`);
            return false;
        }

        const userRecord = await fetchUser(email);

        // check whether record actually exists
        if (!userRecord){return false;}
        
        if (userRecord) { 
            // Fetch the skills array for that user from the DB (it will be empty if they have no skills yet)
            const userSkills = await fetchUserSkills(userRecord.email);

            // Ensure skills array exists before operating on it
            if (!userSkills) {
                console.warn('Cannot find Skills array in the database')
                return false;
            }
            // maximum of MAX_NUM_SKILLS skills allowed
            if (userSkills.length + 1 > MAX_NUM_SKILLS){
                console.warn(`Maximum of ${MAX_NUM_SKILLS} skills allowed per user.`);
                return false;
            }
            // push the skill into the record 
            const newSkillToAdd: Skill = {
                email: email,
                skill: newSkill,
            };

            const addedSkill = await createSkill(email ,newSkillToAdd);
            if (addedSkill){
                return true;
            }
            else {
                console.warn("Error creating skill entry in the DB");
                return false;
            }
        }
        else {
            // if there is no record with that email show error 
            console.warn(`User with email ${email} not found.`);
        }

        return false;
    };

    const removeUserSkill = async (skillToRemove: string, email: string): Promise<boolean> => {    
        try {
            const currUserRecord = await getUser(email);
            if (currUserRecord) { // check whether record actually exists

                // Ensure skills array exists before operating on it
                const currUserSkills = await fetchUserSkills(currUserRecord.email); 
                if (!currUserSkills || currUserSkills.length == 0) {
                    console.warn(`User with email ${email} has no skills to remove`);
                    return false;
                }
                
                // Database conversion
                // Try to find a Skill object that matches the skill string
                const matchingSkill = currUserSkills.find(s => s.skill.trim() === skillToRemove);

                if (!matchingSkill) {
                    console.warn(`User with email ${email} has no skill called '${skillToRemove}' to remove.`);
                    return false;
                }

                // Call your backend delete function using the Skill ID
                await removeSkill(matchingSkill.email, matchingSkill.ID!);
                return true;
            }
            else {
                // if there is no record with that email show error 
                console.warn(`User with email ${email} not found.`);
            }

            return false;
        }
        catch(error) {
            console.error(`Error removing skill '${skillToRemove}' for ${email}:`, error);
            return false;
        }
    };

    // experience functions
    const addUserExperience = (experience: experienceData, email: string): boolean => {

        // check length of company and title
        if (experience.company.length > MAX_CHAR_EXPERIENCES){
            console.warn(`Company ${experience.company} is too long. Maximum length ` + 
                `is ${MAX_CHAR_EXPERIENCES} characters.`);
            return false;
        }
        if (experience.title.length > MAX_CHAR_EXPERIENCES){
            console.warn(`Title ${experience.title} is too long. Maximum length ` + 
                `is ${MAX_CHAR_EXPERIENCES} characters.`);
            return false;
        }

        const userRecords: UserRecord = getUserRecords();

        if (!userRecords){return false;}
        
        const currUserRecord = userRecords[email];

        if (currUserRecord) { // check whether record actually exists

            // Ensure experience array exists before operating on it
            if (!currUserRecord.experience) {
                currUserRecord.experience = [];
            }

            // maximum of MAX_NUM_EXPERIENCES experiences allowed
            if (currUserRecord.experience.length + 1 > MAX_NUM_EXPERIENCES){
                console.warn(`Maximum of ${MAX_NUM_EXPERIENCES} experiences allowed per user.`);
                return false;
            }

            // push the experience into the record 
            currUserRecord.experience.push(experience);
            
            // Update localStorage with new experience
            saveUserRecords(userRecords);
            return true;
        }
        else {
            // if there is no record with that email show error 
            console.warn(`User with email ${email} not found.`);
        }

        return false;
    };

    const removeUserExperience = (experience: experienceData, email: string): boolean => {
        const userRecords: UserRecord = getUserRecords();

        if (!userRecords){return false;}
        
        const currUserRecord = userRecords[email];
        if (currUserRecord) { // check whether record actually exists

            // Ensure experience array exists before operating on it
            if (!currUserRecord.experience) {
                console.warn(`User with email ${email} has no experience to remove`);
                return false;
            }
            
            // get old length of experience array
            const oldLength = currUserRecord.experience.length;

            // filter out all experience that match
            currUserRecord.experience = currUserRecord.experience.filter((recordedExperience) => {
                // if all parts of experience match filter it 
                // use toISOString() to avoid object comparison
                return  ((recordedExperience.title !== experience.title) || 
                        (recordedExperience.timeStarted !== experience.timeStarted) ||
                        (recordedExperience.timeFinished !== experience.timeFinished)
                    );
            });

            // if the length stays the same show an error that no experience matched
            if (oldLength == currUserRecord.experience.length){
                console.warn(`User with email ${email} has no experiences called ${experience} to remove`)
                return false;
            }

            // Update localStorage with new experience array
            saveUserRecords(userRecords);
            return true;
        }
        else {
            // if there is no record with that email show error 
            console.warn(`User with email ${email} not found.`);
        }

        return false;
    };

    // qualification functions
    const addUserQualification = async (newQualification: string, email: string): Promise<boolean> => {
        //  check qualification length
        if (newQualification.length > MAX_CHAR_EXPERIENCES){
            console.warn(`Qualification ${newQualification} is too long. Maximum length is ` + 
                `${MAX_CHAR_QUALIFICATIONS} characters.`);
            return false;
            
        }
        // const userRecords: UserRecord = getUserRecords();

        // if (!userRecords){return false;}
        
        // const currUserRecord = userRecords[email];
        
        const userRecord = await fetchUser(email);

        // check whether record actually exists
        if (!userRecord){return false;}

        // check whether record actually exists
        if (userRecord) {
            // Ensure quualifications array exists before operating on it
            const userQualifications = await fetchUserQualifications(userRecord.email);
            if (!userQualifications) {
                console.warn("User doesn't have a valid collection of qualifications");
                return false;
            }

            // maximum of MAX_NUM_QUALIFICATIONS qualifications allowed
            if (userQualifications.length + 1 > MAX_NUM_QUALIFICATIONS){
                console.warn(`Maximum of ${MAX_NUM_QUALIFICATIONS} qualifications allowed per user.`);
                return false;
            }

            // push the qualification into the record 
            // currUserRecord.qualifications.push(newQualification);

            
            // Update localStorage with new qualification
            // saveUserRecords(userRecords);
            // push the qualification into the record 
            const newQualificationToAdd: Qualification = {
                email: email,
                qualification: newQualification,
            };

            // Attept to create a qualification entry
            const addedQualification = await createQualification(email, newQualificationToAdd);
            if (addedQualification){
                return true;
            }
            else {
                console.warn("Error creating skill entry in the DB");
                return false;
            }
        }
        else {
            // if there is no record with that email show error 
            console.warn(`User with email ${email} not found.`);
        }

        return false;
    };
    const removeUserQualification = async(qualification: string, email: string): Promise<boolean> => {
        try {
            const currUserRecord = await getUser(email);
            if (currUserRecord) { // check whether record actually exists
                // Ensure qualifications array exists before operating on it
                const currUserQualifications = await fetchUserQualifications(currUserRecord.email); 
                if (!currUserQualifications || currUserQualifications.length == 0) {
                    console.warn(`User with email ${email} has no qualifications to remove`);
                    return false;
                }

                // Database conversion
                // Try to find a qualificaion object that matches the qualification string
                const matchingQualification = currUserQualifications.find(s => s.qualification.trim() === qualification);

                if (!matchingQualification) {
                    console.warn(`User with email ${email} has no qualification called '${qualification}' to remove.`);
                    return false;
                }

                // Calls backend delete function using the Skill ID
                await removeQualification(matchingQualification.email, matchingQualification.ID!);
                return true;
            }
            else {
                // if there is no record with that email show error 
                console.warn(`User with email ${email} not found.`);
            }

            return false;
        }
        catch(error) {
            console.error(`Error removing qualification '${qualification}' for ${email}:`, error);
            return false;
        }
    };

    const changeAvailability = (fullTime: boolean, email: string): boolean => {
        const userRecords: UserRecord = getUserRecords();

        if (!userRecords){return false;}
        
        const currUserRecord = userRecords[email];

        if (currUserRecord) { // check whether record actually exists

            // push the fullTime value into the record 
            currUserRecord.fullTime = fullTime;
            
            // Update localStorage with new data
            saveUserRecords(userRecords);
            return true;
        }
        else {
            // if there is no record with that email show error 
            console.warn(`User with email ${email} not found.`);
        }

        return false;
    };

    // returns list of user records
    const getUserRecords = (): UserRecord => {
        const userData = localStorage.getItem("userData");
        return userData ? JSON.parse(userData) : {}; // return null object if there is no records
    };

    const getUser = async (email: string): Promise<User> => {
    const userInfo = await fetchUser(email);
    return userInfo ?? { email, firstName: "", lastName: "", password: "", isLecturer: false, fullTime: false, dateJoined: "" };
    };
    
    // Returns the array of Skills that are associated with the user
    const getUserSkills = async (email: string): Promise<Skill[]> => {
        const userSkills = await fetchUserSkills(email);

        if (userSkills){
            return userSkills;
        }
        return [];
    }

    const getUserQualifications = async (email: string): Promise<Qualification[]> => {
        const userQualifications = await fetchUserQualifications(email);

        if (userQualifications){
            return userQualifications;
        }
        return [];
    }

    // save a list of user records 
    const saveUserRecords = (userRecords: UserRecord) => {
        localStorage.setItem("userData", JSON.stringify(userRecords));
    };

    return (
    <UserDataContext.Provider value={ 
        {
            addUserSkill, removeUserSkill, addUserQualification, removeUserQualification, 
            addUserExperience, removeUserExperience, changeAvailability, getUserRecords, getUser, getUserSkills, getUserQualifications, saveUserRecords
        } }>
      {children}
    </UserDataContext.Provider>
  );
};

// hook to get authentication info and methods
export const useUserData = (): UserDataProvision => {
    const context = useContext(UserDataContext);
    if (!context) {
      throw new Error("useUserData must be used within a UserDataProvider");
    }
    return context;
};

