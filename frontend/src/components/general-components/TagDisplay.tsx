import React from "react";
import { Button } from "../ui/button";

// props needed to display the tags
interface TagDisplayProps {
    tags: string[];
    fullWidth?: boolean; // boolean for whether tags should be full line
}

const TagDisplay = ({tags, fullWidth} : TagDisplayProps) => {


    if (tags.length === 0) {
            return (
                <Button
                        className="w-full text-destructive"
                        variant="outline"
                        size="sm"
                        disabled
                        >
                        None applicable
    
                        </Button>
            )
        }

    return (
        <div className="flex flex-col mt-2 mb-2">
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <Button
                    className={fullWidth? "w-full" : ""}
                    key={index}
                    variant="outline"
                    size="sm"
                    >
                    {tag}
                    </Button>
                ))}
            </div>
        </div>

    );
};

export default TagDisplay;
