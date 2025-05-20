import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, 
    FormField, FormItem, FormMessage, } from "@/components/ui/form";

// props needed to display the tags
interface TagCustomDisplay {
    tags: string[];
    addTag: (tag: string) => string; // return a string error message
    removeTag: (tag: string) => string; // return a string errror message
    placeholder?: string;
    fullWidth?: boolean; // boolean for whether tags should be full line
    inputValidation?: z.ZodString;
}

const TagCustomDisplay = (
    {
        tags, 
        addTag, 
        removeTag, 
        placeholder = "Add new", 
        fullWidth = false,
        inputValidation = z
            .string()
            .min(1, {message: "Tag is required"})
            .trim()
            .max(20, {message: "Tag must be less than 20 characters"})
    } : TagCustomDisplay) => {

    // zod schema for input validation on sign up (passed via parameters)
    const inputSchema = z.object({
        input: inputValidation,
    });

    // use hook form for input up
    const inputForm = useForm({
        resolver: zodResolver(inputSchema),
        // default values must be used (bugs can start to occur)
        defaultValues: {input: ""}
    })

    // form handler
    const inputFormSubmit = (values: {input: string;}) => {

        const errorMsg = addTag(values.input);
        // if there is an error, set zod error message
        if (errorMsg !== "") {
            inputForm.setError("input", {message: errorMsg});
        }
        // if no error message, reset form 
        else {
            inputForm.reset(); // reset the form
        }
    }

    // remove tag handler
    const removeTagHandler = (tag: string) => {
        const errorMsg = removeTag(tag);

        // if there is an error, set zod error message
        if (errorMsg !== "") {
            inputForm.setError("input", {message: errorMsg});
        }
    }

    return (
        <div className="flex flex-col mt-2 mb-2">
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <Button
                    className={fullWidth? "w-full" : ""} // full width if fullWidth is true
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => removeTagHandler(tag)} // Click to remove the tag
                    >
                    {tag}
                    </Button>
                ))}
            </div>
            <div className="mt-4">
                <Form {...inputForm}>
                    <form data-testid="customTagForm" onSubmit={inputForm.handleSubmit(inputFormSubmit, (errors) => console.log(errors))}>

                        <FormField
                                control={inputForm.control}
                                name="input"
                                render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder={placeholder} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                    </form>
                </Form>
                


            </div>
        </div>

    );
};

export default TagCustomDisplay;
