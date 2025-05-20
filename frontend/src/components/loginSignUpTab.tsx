"use client"
import React, { useState } from 'react';
// shadcn imports for ui
import {TabsContent} from './ui/tabs';
import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle} from './ui/card';
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Switch } from './ui/switch'

import { toast } from "sonner"

import { Form, FormControl, 
    FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
// zod import for input validation 
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRouter } from 'next/router';

interface LoginSignUpTabProps {
    // functions for log in + signup
    handleLogin: (email: string, password: string) => boolean;
    handleSignup: (email: string, password: string, isLecturer: boolean, firstName: string, lastName: string) => boolean;
    // zod validation 
    emailValidation?:       z.ZodString;
    passwordValidation?:    z.ZodString;
    firstNameValidation?:   z.ZodString;
    lastNameValidation?:    z.ZodString;
}


const LoginSignUpTab = (
        {handleLogin, 
        handleSignup, 
        emailValidation =       z.string(), 
        passwordValidation =    z.string(),
        firstNameValidation =   z.string(),
        lastNameValidation =    z.string()} : LoginSignUpTabProps) => {

    // hooks for Sign up forms 
    const [isLecturer, setLecturerSwitch] = useState(false);
    // router hook
    const router = useRouter();

    // zod schema for input validation on sign up (passed via parameters)
    const signUpSchema = z.object({
        email: emailValidation,
        
        password: passwordValidation,
        confirmPassword: passwordValidation,

        firstName: firstNameValidation,
        lastName: lastNameValidation
    })

    // zod schema for input validation on log in (passed via parameters)
    const logInSchema = z.object({
        email: z.string().min(1, {message: "Email name is required"}),

        password: z.string().min(1, {message: "Password name is required"})
    })

    // use hook form for sign up
    const signUpForm = useForm({
        resolver: zodResolver(signUpSchema),
        // default values must be used (bugs can start to occur)
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: ""
          },
    })
    // use hook form for log in
    const logInForm = useForm({
        resolver: zodResolver(logInSchema),
        defaultValues: {
            // default values must be used (bugs can start to occur)
            email: "",
            password: "",
        },
    });


    // form handlers
    const onSubmitSignUp = (
        values: {
            email: string;
            password: string;
            confirmPassword: string;
            firstName: string;
            lastName: string;
        }) => {
        
        // zod error when the confirm apssword doesnt match
        if (values.password !== values.confirmPassword){
            signUpForm.setError("confirmPassword", 
                {message: "Passwords do not match"});
        }


        const SignedUp = handleSignup(values.email, values.password, isLecturer, values.firstName, values.lastName);

        if (!SignedUp){
            // error when signup is attempt sign upw
            signUpForm.setError("email", 
                { message: "That email already has an account"});
            
        }
        else { 
            // when signup is successful auto logs in 
            const loggedIn = handleLogin(values.email, values.password);
            
            // zod error when log in fails
            if (!loggedIn){
                signUpForm.setError("email", 
                    { message: "There was a problem making this account"});
            }
            else{
                // pushes to dashboard after sucessful sign in 
                router.push("/dashboard");
            }
        }
    }

    const waitFunction = async() => {
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        return sleep(1500);        
    }
      

    const onSubmitLogIn = async (values: {
        email: string;
        password: string;
    }) => {

        const loginPromise = new Promise<void>(async (resolve, reject) => {
            const loggedIn = handleLogin(values.email, values.password);
            
            await waitFunction();
            if (loggedIn) {
                resolve(); // login success
                router.push("/dashboard");
            } else {
                logInForm.setError("email", {
                    message: "The password is incorrect or that email has not been registered",
                });
                reject(); // login failed
            }
          });

          try {

            await toast.promise(loginPromise, {
              loading: "Logging in...",
              success: "Successfully logged in!",
              error: "Invalid email or password",
            });


          } catch {
          }
        }

    return (
<>
    <TabsContent value="signin">
        <Card>
        <Form {...logInForm}>
        <form onSubmit={logInForm.handleSubmit(onSubmitLogIn, (errors) => console.log(errors))}>
            <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription className='mb-2'>
                    Log in to your existing account here.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <section className="space-y-2">
                        <FormField
                            control={logInForm.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="example123@student.rmit.edu.au" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                </section>
                <section className="space-y-2">
                        <FormField
                            control={logInForm.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                <Input placeholder="password123" type="password"{...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                </section>
            </CardContent>
            <CardFooter>
                <Button type="submit" className='mt-2'>Log In</Button>
            </CardFooter>
        </form>
        </Form>
        </Card>
    </TabsContent>
    <TabsContent value="signup">
        <Card>
        <Form {...signUpForm}>
        <form onSubmit={signUpForm.handleSubmit(onSubmitSignUp, (errors) => console.log(errors))}>
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription className='mb-2'>
                    Sign up and join the growing number of people using Teach Team.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

                <section className="flex items-center space-x-2">
                    <Switch id="lecturer" checked={isLecturer} onCheckedChange={setLecturerSwitch}/>
                    <Label htmlFor="lecturer">Signing up as a Lecturer</Label>
                </section>
                    
                <section className="space-y-2">
                        <FormField
                            control={signUpForm.control}
                            name="firstName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                </section>

                <section className="space-y-2">
                        <FormField
                            control={signUpForm.control}
                            name="lastName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                </section>

                <section className="space-y-2">
                        <FormField
                            control={signUpForm.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                <Input placeholder="example123@student.rmit.edu.au" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                </section>

                <section className="space-y-2">
                        <FormField
                            control={signUpForm.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                <Input placeholder="password123" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                </section>

                <section className="space-y-2">
                        <FormField
                            control={signUpForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                <Input placeholder="password123" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                </section>
            </CardContent>
            <CardFooter>
                <Button type="submit" className='mt-2'>Sign Up</Button>
            </CardFooter>
        </form>
        </Form>
        </Card>
    </TabsContent>

</>
        
    );


};

export default LoginSignUpTab;