import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from "react";
import { useRouter } from "next/router";
import { User } from "@/types/types";
import { userService } from "@/services/api";
import bcrypt from 'bcryptjs';

// interface for user records details
export interface LocalStorageUser {
    email: string;
    password: string;
    isLecturer: boolean;
    firstName: string;
    lastName: string;
}

// interface for auth details
export interface Authentication {
    isAuthenticated: boolean,
    isLecturer: boolean
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    signup: (email: string, password: string, isLecturer: boolean, firstName: string, lastName: string) => Promise<boolean>;
    getUsers: () => Record<string, LocalStorageUser>;
    saveUsers : (users: Record<string, LocalStorageUser>) => void;
    getCurrentUser: () => LocalStorageUser | null;
    fetchUser: (email: string) => Promise<User | null>;
}

  const createUser = async (user: User) => {
    try {
      const data = await userService.createUser(user);
      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
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

// Create context
const AuthContext = createContext<Authentication | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLecturer, setIsLecturer] = useState(false);

    // import router 
    const router = useRouter();

    // sign up function
    const signup = useCallback(async(email: string, password: string, isLecturer: boolean, firstName: string, lastName: string): Promise<boolean> => {
        // Check if user already exists
        try {
            const fetchedUser = await fetchUser(email);
            if (fetchedUser) {
                console.warn("User already exists:", email);
                return false;
            }
        }
        catch {
            
        }

        const user: User = {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            isLecturer: isLecturer,
            fullTime: false,
            dateJoined: new Date().toISOString(),
        }

        try {
            await createUser(user);
            return true;
        } catch (error) {
            console.error("User creation failed:", error);
            return false;
        }
    }, []);


    // get current user
    const getCurrentUser = (): LocalStorageUser | null => {
        // checks if the window is actually rendered
        if (typeof window !== "undefined") {
            // get's info of current user
            const user = localStorage.getItem("currentUser");
            return user ? JSON.parse(user) : null;
        }
        return null;
    };

    // logs in the current user in the localStorage
    const setCurrentUser = useCallback(async(email: string) => {
        let fetchedUser = null;
        try {
            fetchedUser = await fetchUser(email);
            if (!fetchedUser) {
                return;
            }
        }
        catch {
            
        }

        if (fetchedUser) {
            localStorage.setItem("currentUser", JSON.stringify(fetchedUser));
        }
    }, []);

    // login function 
    const login = useCallback(async(email: string, password: string): Promise<boolean> => {
        let fetchedUser;
        try {
            fetchedUser = await fetchUser(email);
            if (!fetchedUser) {
                return false
            }
        }
        catch {
            
        }
        if (fetchedUser == null) {return false;}
        
        // update hooks based on matching email pass
        const match = await bcrypt.compare(password, fetchedUser.password);

        if (fetchedUser.email && (match || fetchedUser.password === password)) {

            // sets current user to the matching record
            setCurrentUser(email);

            // returns true and updates auth details
            setIsAuthenticated(true);
            setIsLecturer(fetchedUser.isLecturer);
            console.log("Authentication true");
            return true;
        } else {
            // else return false
            setIsAuthenticated(false);
            setIsLecturer(false);
            console.log("Authetication false");
            return false;
        }
    }, [setCurrentUser]);

    //  function to logout
    const logout = () => {
        // remove localStorage data and update hooks
        localStorage.removeItem("currentUser");
        setIsAuthenticated(false);
        setIsLecturer(false);
    };

    // returns user record
    const getUsers = (): Record<string, LocalStorageUser> => {
        const users = localStorage.getItem("users");
        return users ? JSON.parse(users) : {};
    };

    // save users record
    const saveUsers = (users: Record<string, LocalStorageUser>) => {
        localStorage.setItem("users", JSON.stringify(users));
    };

    


    useEffect(() => {
        // Check authentication status on mount
        const checkAuth = async() => {
            // gets current user localStorage key
            const currUser: LocalStorageUser | null = getCurrentUser();

            // if there is no key false is returned
            if (currUser == null){ 
                setIsAuthenticated(false); 
                setIsLecturer(false); 
                router.push("/");
                return;
            }
            // sets authentication 
            const loggedIn = await login(currUser.email, currUser.password);
            // if log in is successful user is pushed to dashboard
            if (loggedIn){router.push("/dashboard");}
        };

        checkAuth(); // Run the check on mount

        // // !!! loading dummy data 
        // signup(
        //     "example123@gmail.com", 
        //     "password123", 
        //     false, 
        //     "John", 
        //     "Doe");
        // signup(
        //     "lecturer123@gmail.com",
        //     "password123",
        //     true, 
        //     "Mary",
        //     "Jane");
        // signup(
        //     "trent@student.rmit.edu.au",
        //     "password123",
        //     false,
        //     "Trent",
        //     "Butter",
        // );
        // signup(
        //     "tommy@student.rmit.edu.au",
        //     "password123",
        //     false,
        //     "Tommy",
        //     "Nguyen"
        // );
        // signup(
        //     "matt@rmit.edu.au",
        //     "password123",
        //     true,
        //     "Matt", 
        //     "Hayward"
        // );
        // signup(
        //     "alysha@student.rmit.edu.au",
        //     "password123",
        //     false,
        //     "Alysha",
        //     "Khan",
        // )
        // signup(
        //     "luca@student.rmit.edu.au",
        //     "password123",
        //     false,
        //     "Luca",
        //     "Grosso"
        // )
        // signup(
        //     "brad@student.rmit.edu.au",
        //     "password123",
        //     false,
        //     "Brad",
        //     "Sea"
        // )
        // signup(
        //     "jeffrey@student.rmit.edu.au",
        //     "password123",
        //     false,
        //     "Jeffrey",
        //     "James"
        // )
        // signup(
        //     "rupert@student.rmit.edu.au",
        //     "password123",
        //     false,
        //     "Rupert",
        //     "Smith"
        // )
        // signup(
        //     "nathaniel@rmit.edu.au",
        //     "password123",
        //     true,
        //     "Nathaniel",
        //     "Jordan"
        // )

        // console.log(getUsers()); // ! send dummy data to console to see accounts
        // !!! end loading dummy data 
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLecturer, login, logout, signup, getUsers, saveUsers, getCurrentUser, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// hook to get authentication info and methods
export const useAuth = (): Authentication => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
