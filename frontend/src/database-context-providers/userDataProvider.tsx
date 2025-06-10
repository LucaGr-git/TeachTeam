import { createContext, useEffect, useContext, ReactNode } from "react";
import { Qualification, Skill, Experience, User} from "@/types/types";
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
    addUserExperience: (experience: Experience, email: string) => Promise<boolean>;
    removeUserExperience: (experience: Experience, email: string) => Promise<boolean>;
    addUserQualification: (newQualification: string, email: string) => Promise<boolean>;
    removeUserQualification: (qualification: string, email: string) => Promise<boolean>;
    changeAvailability: (fullTime: boolean, email: string) => Promise<boolean>;
    getUserRecords: () => UserRecord ;
    getUser: (email: string) => Promise<User>;
    getUserSkills: (email: string) => Promise<Skill[]>;
    getUserQualifications: (email: string) => Promise<Qualification[]>;
    getUserExperiences: (email: string) => Promise<Experience[]>;
    saveUserRecords: (userRecords: UserRecord) => void;
    // TODO: Rewire how get and save user records work.
    
}

// experience details
export interface localStorageExperienceData {
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

const updateUser = async (email: string, newUpdatedUser: Partial<User>) => {
    try {
        const userToUpdate = await fetchUser(email);
        if (userToUpdate) {
            const changedUser = await userService.updateUser(email, newUpdatedUser);
        }
    }
    catch (error){
        return null;
    }
}

const createSkill = async (email: string, skill: Skill) => {
    try {
        const userWithSkill = await fetchUser(email);
        if (!userWithSkill) {
            console.warn("User not found for skill creation:", email);
            return null;
        }
        const skillData = await userService.addSkillToUser(userWithSkill.email!, skill);
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
            console.warn("User not found for qualification creation:", email);
            return null;
        }
        console.log(qualification.qualification + " string data for passed qualification. " + qualification.userEmail + " user email.")
        const qualificationData = await userService.addQualificationToUser(user.email!, qualification);
        return qualificationData;
    } catch (error) {
        console.error("Error creating qualification for user:", error);
        return null;
    }
}

const createExperience = async (email: string, experience: Experience) => {
    try {
        const user = await fetchUser(email);
        if (!user) {
            console.warn("User not found for experience creation:", email);
            return null;
        }
        const experienceData = await userService.addExperienceToUser(email, experience);
        return experienceData;
    } catch (error) {
        console.error("Error creating experience for user:", error);
        return null;
    }
}

const fetchUserSkills = async (email: string) => {
    try {
        const userSkillList = await fetchUser(email);
        console.log(userSkillList + " email " + email);
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
            console.warn("User not found for qualifications:", email);
            return null;
        }
        const qualificationData = await userService.getUserQualifications(user.email);
        return qualificationData;
    }
    catch (error) {
        console.error("Error getting user qualifications");
        return null;
    }
}

const fetchUserExperiences = async (email: string) => {
    try {
        const user = await fetchUser(email);
        if (!user) {
            console.warn("User not found for experiences:", email);
            return null;
        }
        const experienceData = await userService.getUserExperiences(user.email);
        return experienceData;
    }
    catch (error) {
        console.error("Error getting user experiences");
        return null;
    }
}

const removeSkill = async (email: string, id: number) => {
    try {
        const userSkills = await fetchUserSkills(email);
        console.log(userSkills);
        if (userSkills) {
            // Try to find a Skill object that matches the skill string
            const matchingSkill = userSkills.find(s => s.id === id);
            console.log(matchingSkill?.id + " TEST, REMOVE SKILL ID");
            if (matchingSkill) {
                const userSkillToDelete = await userService.deleteSkill(email, matchingSkill.id!);
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
            const matchingQualification = userQualifications.find(s => s.id === id);

            if (matchingQualification) {
                const userQualificationToDelete = await userService.deleteQualification(matchingQualification?.userEmail, matchingQualification?.id!);
            }
        }
    }
    catch(error) {
        console.error("Error removing chosen qualification");
    }
}

const removeExperience = async (email: string, id: number) => {
    try {
        const userExperiences = await fetchUserExperiences(email);
        if (userExperiences) {
            // Try to find an experience object that matches the experience id
            const matchingExperience = userExperiences.find(s => s.id === id);

            if (matchingExperience) {
                const userExperienceToDelete = await userService.deleteExperience(matchingExperience?.userEmail, matchingExperience?.id!);
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
    experience: localStorageExperienceData[]; 
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

        // const userRecords: UserRecord = getUserRecords();

        // userRecords["example123@gmail.com"] = {
        //     email: "example123@gmail.com",
        //     experience: [{title: "Soft Eng.",company: "Microsoft", timeStarted: new Date("2022-01-01").toISOString()}],
        //     skills: ["OOP", "C#", "Azure"],
        //     qualifications: ["Bachelor", "Cert."],
        //     fullTime: true,
        // };
        // userRecords["lecturer123@gmail.com"] = {
        //     email: "lecturer123@gmail.com",
        //     experience: [{
        //         title: "Soft Eng.",
        //         company: "Nintendo", 
        //         timeStarted: new Date("2020-01-01").toISOString(), 
        //         timeFinished: new Date("2022-01-01").toISOString()}],
        //     skills: ["Python", "Machine Learning"],
        //     qualifications: ["Master's", "Cert."],
        //     fullTime: true,
        // };


        // saveUserRecords(userRecords);

        
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
                userEmail: email,
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
            console.log(email + " remove user skill start of function: " + skillToRemove);
            const currUserRecord = await getUser(email);
            if (currUserRecord) { // check whether record actually exists

                // Ensure skills array exists before operating on it
                const currUserSkills = await fetchUserSkills(currUserRecord.email); 
                currUserSkills?.map((skill: Skill) => {console.log(skill.skill + "- skill name, " + skill.id + "- skill id, " + skill.userEmail + "- skill email");
                });
                console.log("Printing currUserSkills Array" + currUserSkills);
                if (!currUserSkills || currUserSkills.length == 0) {
                    console.warn(`User with email ${email} has no skills to remove`);
                    return false;
                }
                
                // Database conversion
                // Try to find a Skill object that matches the skill string
                const matchingSkill = currUserSkills.find(s => s.skill === skillToRemove);

                if (!matchingSkill) {
                    console.warn(`User with email ${email} has no skill called '${skillToRemove}' to remove.`);
                    return false;
                }

                // Call your backend delete function using the Skill ID
                console.log(matchingSkill.userEmail + " log in removeUserSkill and ID is:" + matchingSkill.id!);
                await removeSkill(matchingSkill.userEmail, matchingSkill.id!);
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
    const addUserExperience = async(experience: Experience, email: string): Promise<boolean> => {

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
        
        const userRecord = await fetchUser(email);

        // check whether record actually exists
        if (!userRecord){return false;}
        
        if (userRecord) { 
            // Ensure experience array exists before operating on it
            // Fetch the experiences array for that user from the DB (it will be empty if they have no experiences yet)
            const userExperiences = await fetchUserExperiences(userRecord.email);

            // Ensure skills array exists before operating on it
            if (!userExperiences) {
                console.warn('Cannot find Experiences array in the database')
                return false;
            }

            // maximum of MAX_NUM_EXPERIENCES experiences allowed
            if (userExperiences.length + 1 > MAX_NUM_EXPERIENCES){
                console.warn(`Maximum of ${MAX_NUM_EXPERIENCES} experiences allowed per user.`);
                return false;
            }


            const addedExperience = await createExperience(email, experience);
            if (addedExperience){
                return true;
            }
            else {
                console.warn("Error creating experience entry in the DB");
                return false;
            }
        }
        else {
            // if there is no record with that email show error 
            console.warn(`User with email ${email} not found.`);
        }

        return false;
    };

    const removeUserExperience = async(experience: Experience, email: string): Promise<boolean> => {
        try {
            const currUserRecord = await getUser(email);
            if (currUserRecord) { // check whether record actually exists
                // Ensure experience array exists before operating on it
                const currUserExperiences = await fetchUserExperiences(currUserRecord.email); 
                if (!currUserExperiences || currUserExperiences.length == 0) {
                    console.warn(`User with email ${email} has no experiences to remove`);
                    return false;
                }

                // Database conversion
                // Try to find a Skill object that matches the skill string
                const matchingExperience = currUserExperiences.find(s => s.id === experience.id);

                if (!matchingExperience) {
                    console.warn(`User with email ${email} has no experience that matches the param to remove.`);
                    return false;
                }

                // Call your backend delete function using the Skill ID
                await removeExperience(currUserRecord.email, matchingExperience.id!);
                return true;
            }
            else {
                // if there is no record with that email show error 
                console.warn(`User with email ${email} not found.`);
            }

            return false;
        }
        catch (error){
            console.error("Error removing experience");
            return false;
        }
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
                userEmail: email,
                qualification: newQualification,
            };

            // Attept to create a qualification entry
            const addedQualification = await createQualification(email, newQualificationToAdd);
            if (addedQualification){
                return true;
            }
            else {
                console.warn("Error creating qualification entry in the DB");
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
                await removeQualification(matchingQualification.userEmail, matchingQualification.id!);
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

    const changeAvailability = async(fullTime: boolean, email: string): Promise<boolean> => {
        try {
            const user = await fetchUser(email);        
            if (user) { // check whether record actually exists
                // push the fullTime value into the record 
                await updateUser(email, {fullTime: fullTime})
                return true;
            }
            else {
                // if there is no record with that email show error 
                console.warn(`User with email ${email} not found.`);
            }
            return false;
        }
        catch (error) {
            console.warn("Error updating user availability");
            return false;
        }
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

    const getUserExperiences = async (email: string): Promise<Experience[]> => {
        const userExperiences = await fetchUserExperiences(email);

        if (userExperiences){
            return userExperiences;
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
            addUserExperience, removeUserExperience, changeAvailability, getUserRecords, getUser, getUserSkills, getUserQualifications, getUserExperiences, saveUserRecords
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

