import { createContext, useEffect, useContext, ReactNode } from "react";

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
    addUserSkill: (skill: string, email: string) => boolean;
    removeUserSkill: (skill: string, email: string) => boolean;
    addUserExperience: (experience: experienceData, email: string) => boolean;
    removeUserExperience: (experience: experienceData, email: string) => boolean;
    addUserQualification: (newQualification: string, email: string) => boolean;
    removeUserQualification: (qualification: string, email: string) => boolean;
    changeAvailability: (fullTime: boolean, email: string) => boolean;
    getUserRecords: () => UserRecord ;
    saveUserRecords: (userRecords: UserRecord) => void;
    
}

// experience details
export interface experienceData {
    title: string;
    company: string;
    timeStarted: string; // this is an ISO string
    timeFinished?: string; // this is an ISO string
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
    const addUserSkill = (newSkill: string, email: string): boolean => {
        // check length of skill
        if (newSkill.length > MAX_CHAR_SKILLS){
            console.warn(`Skill ${newSkill} is too long. Maximum length is ${MAX_CHAR_SKILLS} characters.`);
            return false;
        }

        const userRecords: UserRecord = getUserRecords();

        if (!userRecords){return false;}
        
        const currUserRecord = userRecords[email];
        if (currUserRecord) { // check whether record actually exists

            // Ensure skills array exists before operating on it
            if (!currUserRecord.skills) {
                currUserRecord.skills = [];
            }
            // maximum of MAX_NUM_SKILLS skills allowed
            if (currUserRecord.skills.length + 1 > MAX_NUM_SKILLS){
                console.warn(`Maximum of ${MAX_NUM_SKILLS} skills allowed per user.`);
                return false;
            }
            // push the skill into the record 
            currUserRecord.skills.push(newSkill);
            
            // Update localStorage with new skill
            saveUserRecords(userRecords);
            return true;
        }
        else {
            // if there is no record with that email show error 
            console.warn(`User with email ${email} not found.`);
        }

        return false;
    };

    const removeUserSkill = (skill: string, email: string): boolean => {
        const userRecords: UserRecord = getUserRecords();

        if (!userRecords){return false;}
        
        const currUserRecord = userRecords[email];
        if (currUserRecord) { // check whether record actually exists

            // Ensure skills array exists before operating on it
            if (!currUserRecord.skills) {
                console.warn(`User with email ${email} has no skills to remove`);
                return false;
            }
            
            // get old length of skills array
            const oldLength = currUserRecord.skills.length;

            // filter out all skills that match
            
            currUserRecord.skills = currUserRecord.skills.filter((recordedSkill) => {
                return (recordedSkill.trim() !== skill.trim());
            });

            // if the length stays the same show an error that no skills matched
            if (oldLength == currUserRecord.skills.length){
                console.warn(`User with email ${email} has no skill called ${skill} to remove`)
                return false;
            }

            // Update localStorage with new skills array
            saveUserRecords(userRecords);
            return true;
        }
        else {
            // if there is no record with that email show error 
            console.warn(`User with email ${email} not found.`);
        }

        return false;
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
    const addUserQualification = (newQualification: string, email: string): boolean => {
        //  check qualification length
        if (newQualification.length > MAX_CHAR_EXPERIENCES){
            console.warn(`Qualification ${newQualification} is too long. Maximum length is ` + 
                `${MAX_CHAR_QUALIFICATIONS} characters.`);
            return false;
            
        }
        const userRecords: UserRecord = getUserRecords();

        if (!userRecords){return false;}
        
        const currUserRecord = userRecords[email];

        if (currUserRecord) { // check whether record actually exists

            // Ensure quualifications array exists before operating on it
            if (!currUserRecord.qualifications) {
                currUserRecord.qualifications = [];
            }

            // maximum of MAX_NUM_QUALIFICATIONS qualifications allowed
            if (currUserRecord.qualifications.length + 1 > MAX_NUM_QUALIFICATIONS){
                console.warn(`Maximum of ${MAX_NUM_QUALIFICATIONS} qualifications allowed per user.`);
                return false;
            }

            // push the qualification into the record 
            currUserRecord.qualifications.push(newQualification);
            
            // Update localStorage with new qualification
            saveUserRecords(userRecords);
            return true;
        }
        else {
            // if there is no record with that email show error 
            console.warn(`User with email ${email} not found.`);
        }

        return false;
    };
    const removeUserQualification = (qualification: string, email: string): boolean => {
        const userRecords: UserRecord = getUserRecords();

        if (!userRecords){return false;}
        
        const currUserRecord = userRecords[email];
        if (currUserRecord) { // check whether record actually exists

            // Ensure qualifications array exists before operating on it
            if (!currUserRecord.qualifications) {
                console.warn(`User with email ${email} has no qualifications to remove`);
                return false;
            }
            
            // get old length of qualifications array
            const oldLength = currUserRecord.qualifications.length;

            // filter out all qualifications that match
            currUserRecord.qualifications = currUserRecord.qualifications.filter((recordedQualification) => {
                return (recordedQualification.trim() !== qualification.trim());
            });

            // if the length stays the same show an error that no qualification matched
            if (oldLength == currUserRecord.qualifications.length){
                console.warn(`User with email ${email} has no qualifications called ${qualification} to remove`)
                return false;
            }

            // Update localStorage with new qualifications array
            saveUserRecords(userRecords);
            return true;
        }
        else {
            // if there is no record with that email show error 
            console.warn(`User with email ${email} not found.`);
        }

        return false;
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
    // save a list of user records 
    const saveUserRecords = (userRecords: UserRecord) => {
        localStorage.setItem("userData", JSON.stringify(userRecords));
    };

    return (
    <UserDataContext.Provider value={ 
        {
            addUserSkill, removeUserSkill, addUserQualification, removeUserQualification, 
            addUserExperience, removeUserExperience, changeAvailability, getUserRecords, saveUserRecords
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

