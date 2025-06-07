import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from "react";
import { useRouter } from "next/router";

// interface for user records details
export interface User {
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
    login: (email: string, password: string) => boolean;
    logout: () => void;
    signup: (email: string, password: string, isLecturer: boolean, firstName: string, lastName: string) => boolean;
    getUsers: () => Record<string, User>;
    saveUsers : (users: Record<string, User>) => void;
    getCurrentUser: () => User | null;
}

// Create context
const AuthContext = createContext<Authentication | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLecturer, setIsLecturer] = useState(false);

    // import router 
    const router = useRouter();

    

    // sign up function
    const signup = useCallback((email: string, password: string, isLecturer: boolean, firstName: string, lastName: string): boolean => {
        // get users record object
        const users = getUsers();

        // if user email exists process is cancelled
        if (users[email]) {
            return false; // Username already taken
        }

        // Add new user 
        users[email] = { email, password, isLecturer, firstName, lastName };
        // save to localStorage
        saveUsers(users);

        const userData = localStorage.getItem("userData");
        const userRecords = userData ? JSON.parse(userData) : {}; 

        userRecords[email] = {
            email : email,
            experience : [], 
            skills :  [],
            qualifications : [],
        }

        localStorage.setItem("userData", JSON.stringify(userRecords));
        return true;
    }, []);


    // get current user
    const getCurrentUser = (): User | null => {
        // checks if the window is actually rendered
        if (typeof window !== "undefined") {
            // get's info of current user
            const user = localStorage.getItem("currentUser");
            return user ? JSON.parse(user) : null;
        }
        return null;
    };

    // logs in the current user in the localStorage
    const setCurrentUser = useCallback((email: string) => {
        const users = getUsers();

        if (users[email]) {
            const currUser = users[email];
            localStorage.setItem("currentUser", JSON.stringify(currUser));
        }
    }, []);

    // login function 
    const login = useCallback((email: string, password: string): boolean => {
        const users = getUsers();

        if (users[email] == null) {return false;}
        
        // update hooks based on matching email pass
        if (users[email].email && users[email].password === password) {
            const user = users[email];

            // sets current user to the matching record
            setCurrentUser(email);

            // returns true and updates auth details
            setIsAuthenticated(true);
            setIsLecturer(user.isLecturer);

            return true;
        } else {
            // else return false
            setIsAuthenticated(false);
            setIsLecturer(false);
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
    const getUsers = (): Record<string, User> => {
        const users = localStorage.getItem("users");
        return users ? JSON.parse(users) : {};
    };

    // save users record
    const saveUsers = (users: Record<string, User>) => {
        localStorage.setItem("users", JSON.stringify(users));
    };

    


    useEffect(() => {
        // Check authentication status on mount
        const checkAuth = () => {
            // gets current user localStorage key
            const currUser: User | null = getCurrentUser();

            // if there is no key false is returned
            if (currUser == null){ 
                setIsAuthenticated(false); 
                setIsLecturer(false); 
                router.push("/");
                return;
            }
            // sets authentication 
            const loggedIn = login(currUser.email, currUser.password);
            // if log in is successful user is pushed to dashboard
            if (loggedIn){router.push("/dashboard");}
        };

        checkAuth(); // Run the check on mount

        // !!! loading dummy data 
        signup(
            "example123@gmail.com", 
            "password123", 
            false, 
            "John", 
            "Doe");
        signup(
            "lecturer123@gmail.com",
            "password123",
            true, 
            "Mary",
            "Jane");
        signup(
            "trent@student.rmit.edu.au",
            "password123",
            false,
            "Trent",
            "Butter",
        );
        signup(
            "tommy@student.rmit.edu.au",
            "password123",
            false,
            "Tommy",
            "Nguyen"
        );
        signup(
            "matt@rmit.edu.au",
            "password123",
            true,
            "Matt", 
            "Hayward"
        );
        signup(
            "alysha@student.rmit.edu.au",
            "password123",
            false,
            "Alysha",
            "Khan",
        )
        signup(
            "luca@student.rmit.edu.au",
            "password123",
            false,
            "Luca",
            "Grosso"
        )
        signup(
            "brad@student.rmit.edu.au",
            "password123",
            false,
            "Brad",
            "Sea"
        )
        signup(
            "jeffrey@student.rmit.edu.au",
            "password123",
            false,
            "Jeffrey",
            "James"
        )
        signup(
            "rupert@student.rmit.edu.au",
            "password123",
            false,
            "Rupert",
            "Smith"
        )
        signup(
            "nathaniel@rmit.edu.au",
            "password123",
            true,
            "Nathaniel",
            "Jordan"
        )

        console.log(getUsers()); // ! send dummy data to console to see accounts
        // !!! end loading dummy data 
    });

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLecturer, login, logout, signup, getUsers, saveUsers, getCurrentUser }}>
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
