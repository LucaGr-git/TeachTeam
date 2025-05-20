import React, { useEffect } from "react";
import { ApplicantInfo } from "./LecturerSearch";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface LecturerSortProps {
    results: ApplicantInfo[];
    filteredResults: ApplicantInfo[];
    setFilteredResults: React.Dispatch<React.SetStateAction<ApplicantInfo[]>>;
}

const LecturerSort = ({results, setFilteredResults}: LecturerSortProps) => {

    // Use states for whether the sorts are checked
    const [sortByAvailability, setSortByAvailability] = useState(false);
    const [sortByAtoZ, setSortByAtoZ] = useState(false);
    const [sortByZtoA, setSortByZtoA] = useState(false);

    useEffect(() => {
        // Updates the sort depending on which value is chosen 
        if (sortByAvailability) {
            sortResultsByAvailability();
        } else if (sortByAtoZ) {
            sortResultsByAtoZ();
        } else if (sortByZtoA) {
            sortResultsByZtoA();
        }
        else {
            setFilteredResults(results);
        }
    }, [results])

    const handleSortChange = (value: string) => {
        // Sets all sorts to false
        setSortByAvailability(false);
        setSortByAtoZ(false);
        setSortByZtoA(false);

        // Updates the sort depending on which value is chosen 
        if (value === "availability") {
            setSortByAvailability(true);
            sortResultsByAvailability();
        } else if (value === "atoz") {
            setSortByAtoZ(true);
            sortResultsByAtoZ();
        } else if (value === "ztoa") {
            setSortByZtoA(true);
            sortResultsByZtoA();
        }
        else if (value === "nosort"){
            setFilteredResults(results);
        }
    }

    const sortResultsByAvailability = () => {
        const tempResults: ApplicantInfo[] = results;
        const sorted = [...tempResults].sort((a, b) => {
            const aFull = a.availability.toLowerCase() === "full time";
            const bFull = b.availability.toLowerCase() === "full time";
        
            if (aFull === bFull) return 0;
            return aFull ? -1 : 1;
        });
        setFilteredResults(sorted);
    }

    const sortResultsByAtoZ = () => {
        const tempResults: ApplicantInfo[] = results;
        const sorted = [...tempResults].sort((a, b) => {
            //sorts each of the tutors' courses alphabetically
            const aCourses = a.courseName.map(name => name.toLowerCase()).sort();
            const bCourses = b.courseName.map(name => name.toLowerCase()).sort();
        
            // Reverse the comparison
            return aCourses[0].localeCompare(bCourses[0]);
        });
        
        setFilteredResults(sorted);
    }

    const sortResultsByZtoA = () => {
        const tempResults: ApplicantInfo[] = results;
        const sorted = [...tempResults].sort((a, b) => {
            //sorts each of the tutors' courses alphabetically
            const aCourses = a.courseName.map(name => name.toLowerCase()).sort();
            const bCourses = b.courseName.map(name => name.toLowerCase()).sort();
        
            // Reverse the comparison
            return bCourses[0].localeCompare(aCourses[0]);
        });
        
        setFilteredResults(sorted);
    }

    return (
    <RadioGroup defaultValue="nosort" onValueChange={handleSortChange}>
      <div className="flex items-center space-x-2 pt-[1rem]">
        <RadioGroupItem value="nosort" id="r1"/>
        <Label htmlFor="r1">No Sort</Label>

        <RadioGroupItem value="availability" id="r2"/>
        <Label htmlFor="r2">Sort by Availability (Full time to Part Time)</Label>

        <RadioGroupItem value="atoz" id="r3" />
        <Label htmlFor="r3">Sort by course name (A to Z)</Label>

        <RadioGroupItem value="ztoa" id="r4" />
        <Label htmlFor="r4">Sort by course name (Z to A)</Label>
      </div>
    </RadioGroup>
    )
}

export default LecturerSort;