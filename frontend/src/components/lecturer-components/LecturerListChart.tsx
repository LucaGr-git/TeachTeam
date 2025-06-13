import React, {useEffect, useState} from "react";
import { useClassData} from "@/database-context-providers/classDataProvider";
import { useUserData } from "@/database-context-providers/userDataProvider";
import { useAuth } from "@/database-context-providers/auth";
import Section from "@/components/general-components/Section";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";

// rechats Axis and chart
import { Bar, BarChart } from "recharts"
import { XAxis, YAxis } from "recharts";
// shadcn chart imports
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

// interface for the class card details
interface LecturerListChartProps {
  courseCode: string; // course code
}

// constant value for number of shortlisted applicants shown when the toggle is selected
const MAX_LIMIT_SHORTLIST = 10;

const LecturerListChart = (
    { courseCode }: LecturerListChartProps) => {

    // useState for the color of the chart
    const [chartColor, setChartColor] = useState("#FF0000"); // red if the css cannot be red

    // get class records
    const {classRecords} = useClassData();
    // get user records
    const {getCurrentUser, isAuthenticated, isLecturer} = useAuth();

    const {getUser} = useUserData();
    

    

    // get class record
    if (!classRecords) {
    return (
        <Section title="Error">
        <p className="text-red-500">Failed to load class records.</p>
        </Section>
    );
    }


    // get current user
    const currUser = getCurrentUser();

    


    // useState for the graph data array
    const [shortlistScoreArr, setShortlistScoreArr] = useState<ShortlistedTutor[]>([]);
    // useState for whether the array should be sorted lowest-highest vs highest-lowest
    const [viewMostSelected, setviewMostSelected] = useState<boolean>(true);

    // useState for whether the graph sshoudl display max applicants or just a 
    const [visibility, setVisibility] = useState<boolean>(false);

    // useState for whether the graph should be visible
    const [limitApplicants, setLimitApplicants] = useState<boolean>(true);


    // useEffect for loading chart data on component mount
    // useEffect(() => {

    //     const fetchingShortlistedTutors = async() => {
    //         const shortlistedTutors: ShortlistedTutor[] = [];
    //         // change colour based on global css var
    //         const primaryColorCode = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
    //         // if primaryColorCode exists then set the chart colour to that code 
    //         if (primaryColorCode) setChartColor(primaryColorCode);

    //         // iterate through all shortlidted tutors emails
    //         for (const applicant of classRecords[courseCode].tutorsShortlist){

    //             // find corresponding full name
    //             const applicantUserData = await getUser(applicant.tutorEmail);

    //             // get their ranking 
    //             let rankingScore: number = 0;
    //             // iterate over all lecturers ranking and add indexes of current applicant
    //             const shortlistMap: LecturerShortList = classRecords[courseCode].lecturerShortlist;

    //             for (const lecturerEmail in shortlistMap){
    //                 // gets the position relative to the end not the start by subtracting from  length
    //                 rankingScore += 
    //                     (shortlistMap[lecturerEmail].length - 
    //                         shortlistMap[lecturerEmail].indexOf(applicant.tutorEmail) + 1)
    //             }

    //             // create entry in array 
    //             shortlistedTutors.push({
    //                 email: applicant.tutorEmail,
    //                 fullName: applicantUserData.firstName + " " + applicantUserData.lastName,
    //                 rankingScore: rankingScore,
    //             })
    //             // Sort by highest score first
    //             shortlistedTutors.sort((applicantA, applicantB) => {
    //                 if (applicantA.rankingScore < applicantB.rankingScore) return 1;
    //                 if (applicantA.rankingScore > applicantB.rankingScore) return -1;
    //                 return 0;
    //             });
    //             setShortlistScoreArr(shortlistedTutors);
    //         }
    //     }
    //     fetchingShortlistedTutors();
        
        
    // }, [courseCode, users, classRecords]);

    useEffect(() => {
    const fetchingShortlistedTutors = async () => {
        if (!classRecords[courseCode]) return;

        const shortlistedTutorsRaw = classRecords[courseCode].tutorsShortlist;
        const shortlistMap = classRecords[courseCode].lecturerShortlist;

        // fetch all user data in parallel
        const userPromises = shortlistedTutorsRaw.map(applicant =>
        getUser(applicant.tutorEmail).then(user => ({
            email: applicant.tutorEmail,
            fullName: `${user.firstName} ${user.lastName}`,
        }))
        );

        const userInfos = await Promise.all(userPromises);

        // now calculate rankingScore for each
        const shortlistTutors = userInfos.map(user => {
        let rankingScore = 0;
        for (const lecturerEmail in shortlistMap) {
            const index = shortlistMap[lecturerEmail].indexOf(user.email);
            if (index !== -1) {
            rankingScore += shortlistMap[lecturerEmail].length - index + 1;
            }
        }
        return {
            ...user,
            rankingScore,
        };
        });

    // sort once outside the loop
    shortlistTutors.sort((a, b) => b.rankingScore - a.rankingScore);
    setShortlistScoreArr(shortlistTutors);

    // chart color (do this once)
    const primaryColorCode = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim();
    if (primaryColorCode) setChartColor(primaryColorCode);
  };

  fetchingShortlistedTutors();
}, [courseCode, classRecords, getUser]);    

    if (!currUser || !isAuthenticated || !isLecturer) {
    return (
        <Section title="Error">
            <p className="text-destructive"> User is not authenticated.</p>
        </Section>
    )
    }


    // return error card if course code is wrong
    if (!classRecords[courseCode]) {
        return (
            <Section title="Error course code not found">
                <p className="text-destructive">Course code {courseCode} not found.</p>
            </Section>
        )
    }


    // get a list of shortlisted tutors with their email + full name and rank
    interface ShortlistedTutor {
        email: string,
        fullName: string,
        rankingScore: number,
    }
    

    

    // config for chart
    const chartConfig = {
        tutor: {
        label: "tutor",
        // get colour from css --primary variable 
        color: chartColor, // use chart colour state as using the document on top level was causing issues
        },
    } satisfies ChartConfig
    


    const changeViewOrder = (highestFirst: boolean): void => {
        // if the viewMostSelected state will be updated update array subsequently
        if (viewMostSelected != highestFirst){
            // reverse array so it is in the selected order
            let shortlistedTutors: ShortlistedTutor[] = [...shortlistScoreArr];
            shortlistedTutors = shortlistedTutors.reverse();

            setShortlistScoreArr(shortlistedTutors);
        }

        setviewMostSelected(highestFirst);
    }

    
    

    return (
        <>
            <Button 
                className="mt-3 mb-3"
                type="button" 
                variant="secondary"
                onClick={() => setVisibility(!visibility)} >
                    View/Hide 
            </Button> 
            {   visibility &&
            <div>
                
                {(shortlistScoreArr.length != 0)?
                // only display chart if there is at least one shortlisted applicant 
                <>
                <section className="flex gap-4 mb-4">
                    <p className={(viewMostSelected)? 
                        "text-sm text-muted-foreground":
                        "text-sm text-primary"}>See Least Selected First</p>
                    <Switch 
                        className=""
                        id="view-most-selected" 
                        checked={viewMostSelected} 
                        onCheckedChange={changeViewOrder}/>
                    <p className={(viewMostSelected)? 
                        "text-sm text-primary":
                        "text-sm text-muted-foreground"}>See Most Selected First</p>

                    <section className="ml-auto flex">
                        <p className={(limitApplicants)? 
                            "text-sm text-primary ml-auto":
                            "text-sm text-muted-foreground"}>Show max of {MAX_LIMIT_SHORTLIST} shortlisted tutors</p>
                        <Switch className="ml-4" onCheckedChange={setLimitApplicants} checked={limitApplicants}/>
                    </section>
                </section>

                <ChartContainer config={chartConfig} className="min-h-[20vh] w-full max-h-[50vh] ">
                    <BarChart data={(limitApplicants || shortlistScoreArr.length <= MAX_LIMIT_SHORTLIST)? 
                                    // If max applicants selected show full array or 
                                    shortlistScoreArr : 
                                    // If max applicants not selected show only a certain amount 
                                    shortlistScoreArr.slice(0, MAX_LIMIT_SHORTLIST)}>
                        <XAxis dataKey="fullName" />
                        <YAxis />
                        <Bar dataKey="rankingScore" fill="var(--primary)" radius={8} />
                    </BarChart>
                </ChartContainer>
                
                <p className="text-sm text-muted-foreground"> This score is an aggregate that represents how many other 
                    applicants a particular applicant has been ranked higher than in <b>the opinions of all lecturers 
                        of this course</b></p>
                </>

                // use tagDisplay to display there are no shortlisted tutors
                : <h1 className="text-destructive"> <b> There are no shortlisted applicants. 
                    Start shortlisting to see a visualization of their ranking</b></h1>}

                
            </div>}
        </>
        
    );
};

    export default LecturerListChart;
