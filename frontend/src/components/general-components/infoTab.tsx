"use client"
import React from 'react';
// shadcn imports for ui
import {TabsContent} from '../ui/tabs';
import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle} from '../ui/card';


const InfoTab = () => {

    return (
<>
    <TabsContent value="info">
        <Card>
            <CardHeader>
                <CardTitle>More Info</CardTitle>
                <CardDescription className='mb-2'>
                    Learn more about TeachTeam.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <section className='space-y-2'>
                    <CardTitle>What is Teachteam?</CardTitle>
                        <li>
                            <CardDescription className='inline'>Teach team is a web application designed 
                                to help tutors and lecturers connect easier</CardDescription>
                        </li>
                        <li>
                            <CardDescription className='inline'>This is an RMIT web app designed esxclusively 
                                for RMIT</CardDescription>
                        </li>
                </section>
                <section className='space-y-2'>
                    <CardTitle>Who are we?</CardTitle>
                        <li>
                            <CardDescription className='inline'>We are two second year students at RMIT</CardDescription>
                        </li>
                        <li>
                            <CardDescription className='inline'>Our names are <b>&apos;Luca Grosso&apos; and
                            &apos;Alysha Khan&apos;</b></CardDescription>
                        </li>
                </section>

                <section className='space-y-2'>
                    <CardTitle>Why was Teachteam created?</CardTitle>
                        <CardDescription> When looking at how RMIT handles finding tutors we noticed one 
                            important thing, <b>the process hadn&apos;t changed in more than a decade.</b></CardDescription>
                            
                            <CardDescription>This is what we aimed to fix with TeachTeam, 
                                to modernize hiring tutors.</CardDescription>
                </section>
            </CardContent>
            <CardFooter>
            </CardFooter>

        </Card>
    </TabsContent>

</>
        
    );


};

export default InfoTab;