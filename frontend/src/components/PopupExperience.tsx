import React, { useEffect } from "react";
import { useState } from "react";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Switch } from "./ui/switch";
import { Form, FormControl, 
    FormField, FormItem, FormMessage, } from "@/components/ui/form";
import { Input } from "./ui/input"; 
import { useUserData, MAX_NUM_EXPERIENCES } from "@/database-context-providers/userDataProvider";   
import { useAuth } from "@/database-context-providers/auth";

interface PopupExperienceProps {
    // Props for popup
    buttonPopup: boolean,
    setTrigger: (value: boolean) => void
    // Zod validation
    titleValidation?: z.ZodString;
    companyValidation?: z.ZodString;
    startDateValidation?: z.ZodString;
    endDateValidation?: z.ZodOptional<z.ZodString>;
}

const PopupExperience = ({
    buttonPopup,
    setTrigger, 
    titleValidation = z.string().min(1, {message: "Required"}), 
    companyValidation = z.string().min(1, {message: "Required"}), 
    startDateValidation = z.string().min(1, {message: "Required"}),
    endDateValidation = z.string().optional()}: PopupExperienceProps) => {

    // useState hook for checking if the switch is ticked
    const [isCurrentJob, setCurrentJob] = useState(false);

    // userdata hook
    const {addUserExperience} = useUserData();

    // authentication hook
    const { getCurrentUser } = useAuth();

    // zod scheme for the qualification validation
    const experienceSchema = z.object({
        title: titleValidation,
        company: companyValidation,
        timeStarted: startDateValidation,
        timeFinished: endDateValidation
    })

    // use hook form for experience form
    const experienceForm = useForm({
        resolver: zodResolver(experienceSchema),
        // default values must be used (bugs can start to occur)
        defaultValues: {
            title: "",
            company: "",
            timeStarted: "",
            timeFinished: ""
            },
    })
    // whenever switch changes, clear timeFinished
    useEffect(() => {experienceForm.resetField("timeFinished");}, [isCurrentJob, experienceForm]);


    // form handlers
    const onSubmitExperienceForm = (
        values: {
            title: string;
            company: string;
            timeStarted: string;
            timeFinished?: string;
        }) => {
        const user = getCurrentUser();
        // there is no current user
        if (!user){
            return alert("No user found");
        }
        // no start date inputted 
        if (!values.timeStarted){
            return alert("Please select a start date");
        }        

        const timeStartedDate = new Date(values.timeStarted);
        values.timeStarted = timeStartedDate.toISOString();
        let error = false;
        const currentDate = new Date();

        // if the user is not currently working there, check if the end date is inputted
        if (values.timeFinished){
            const timeFinishedDate = new Date(values.timeFinished);

            values.timeFinished = timeFinishedDate.toISOString();
            if (timeFinishedDate < timeStartedDate) {
                experienceForm.setError("timeFinished", {message: "Time finished cannot be before time started"});
                error = true;
            }

            if (timeFinishedDate > currentDate) {
                experienceForm.setError("timeFinished", {message: "Time finished cannot be in the future"});
                error = true;
            }
    
    
        }

        if (timeStartedDate > currentDate) {
            experienceForm.setError("timeStarted", {message: "Time started cannot be in the future"});
            error = true;
        }

        if (error) {
            return;
        }




        

        if (!addUserExperience(values, user.email)){
            return alert(`You have reached the maximum number of experiences: ${MAX_NUM_EXPERIENCES}`);
        }

        setTrigger(false);

    }
        
    return (buttonPopup) ? (
        <div className="popup-overlay" onClick={() => setTrigger(false)}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Experience</h2>
            <Form {...experienceForm}>
            <form className="qualification-form" onSubmit={experienceForm.handleSubmit(onSubmitExperienceForm, (errors) => console.log(errors))}>
                <FormField
                    control={experienceForm.control}
                    name="title"
                    render={({ field }) => (
                    <FormItem>
                        <label className="form-label">Title:</label>
                        <FormControl>
                        <Input className="focus:ring-primary" type="text" placeholder="Ex: Software Engineer" {...field} />
                        
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={experienceForm.control}
                    name="company"
                    render={({ field }) => (
                    <FormItem>
                        <label className="form-label">Company:</label>
                        <FormControl>
                        <Input className="" type="text" placeholder="Ex: Microsoft" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={experienceForm.control}
                    name="timeStarted"
                    render={({ field }) => (
                    <FormItem>
                        <label className="form-label">Start Date:</label>
                        <FormControl>
                        <Input className="" data-testid="timeStarted" type="month" {...field} />
                        
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <label className="form-label">Are you currently working here?</label>
                <Switch data-testid="currentJob" checked={isCurrentJob} onCheckedChange={setCurrentJob}/>

                {!isCurrentJob ? (
                    <>
                        <FormField
                            control={experienceForm.control}
                            name="timeFinished"
                            render={({ field }) => (
                            <FormItem>
                                <label className="form-label">End Date:</label>
                                <FormControl>
                                {/* If I have time after implementing functionalities, make icons for calender */}
                                <Input data-testid="timeFinished" className="" type="month" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </>) 
                : (<></>)}

                <button className="submit-form-button" type="submit">Save</button>
                <button className="close-form-button" type="button" onClick={() => setTrigger(false)}>Cancel</button>
            </form>
            </Form>
        </div>
        </div>
    )
    : (<></>)
}

export default PopupExperience;