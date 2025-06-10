"use client"
import React, { ReactElement } from 'react';
import  LoginSignUpTab  from "./loginSignUpTab"
import { useAuth } from "../database-context-providers/auth";
import { z } from "zod"
import { Tabs, TabsList, TabsTrigger} from './ui/tabs';
import InfoTab from './general-components/infoTab';

import Image from 'next/image';
 
const LoginPage = (): ReactElement => {
 
    // import context details 
    const { login, signup} = useAuth();

    // handlers for login and singup
    const handleLogin = (email: string, password: string) : Promise<boolean> => {
        // emails are not case sensitive
        email = email.toLowerCase();
        return login(email, password);
    }

    const handleSignup = (
        email: string, password: string, isLecturer: boolean, 
        firstName: string, lastName: string) : Promise<boolean> => {
        // emails are not case sensitive
        email = email.toLowerCase();

        return signup(email, password, isLecturer, firstName, lastName);
    }

    

    return (
        <div className='spacer'>
            <Tabs defaultValue="signin">
            <header className="header">
                <div className="logo-title">
                    <Image src="/teachteam.png" alt="TeachTeam Logo Image" width="21" height="31"/>
                    <h1 className="text-xl">TeachTeam</h1>
                </div>
                
                <TabsList className="w-65 sm:w-xl">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        <TabsTrigger value="info">More Info</TabsTrigger>
                </TabsList>
            </header>

                <h1 className="flex justify-center text-4xl sm:text-5xl mb-10 font-bold">
                    Welcome to TeachTeam 
                </h1>
                <div className="flex justify-center align-middle">
                    <div className='w-[300px] sm:w-[400px]'>
                        <LoginSignUpTab 
                        handleLogin={handleLogin} 
                        handleSignup={handleSignup}
                        emailValidation={z
                            .string()
                            .min(1, {message: "Email is required"})
                            .email({message:"Invalid email format"})
                            .endsWith("rmit.edu.au", {message: "Must be an RMIT email address"})
                            .trim()
                            }
                        passwordValidation={z
                            .string({message: "Password is required"})
                            .min(8, {message: "Password must be at least 8 characters long"})
                            .max(25, {message: "Password must not be longer than 25 characters"})
                            .regex(/[A-Z]/, {message: "Password must contain at least one uppercase letter"})
                            .regex(/[a-z]/, {message: "Password must contain at least one lowercase letter"})
                            .regex(/[\W_]/, {message: "Password must contain at least one special character"})}
                        firstNameValidation={z
                            .string()
                            .min(1, {message: "First Name is required"})
                            .max(50, "Maximum first name of 32 characters")
                            .regex(/^[A-Za-z\s'-]+$/, "Invalid first name format")
                            .trim()}
                        lastNameValidation={z
                            .string()
                            .min(1, {message: "Last Name is required"})
                            .max(50, "Maximum last name of 32 characters")
                            .regex(/^[A-Za-z\s'-]+$/, "Invalid last name format")
                            .trim()}
                        
                        ></LoginSignUpTab>
                        <InfoTab></InfoTab>
                    </div>
                </div>
            </Tabs>
        
        </div>
        
    );
};

export default LoginPage;