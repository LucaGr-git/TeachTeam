import React from "react";
import Header from "@/components/general-components/Header";
import UserNavigation from "@/components/UserNavigation";
import FooterComponent from "@/components/general-components/footerComponent";

import { Button } from "../ui/button";
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent} from '../ui/tabs';
import LecturerNavigation from "./LecturerNavigation";
import LecturerSearch from "./LecturerSearch";
import LecturerViewClasses from "./LecturerViewClasses";

const LecturerDashboard = () => {
  //Button popup useState for profile popup
  const [showUserDetails, toggleUserDetails] = useState(false);

  return (
    <>  
        <Tabs defaultValue="view">
          <div className="layout">
              <Header>
                <TabsList className="w-65 sm:w-xl">
                  <TabsTrigger value="view">View Your Classes</TabsTrigger>
                  <TabsTrigger value="search">Search Applicants</TabsTrigger>
                  {/* <TabsTrigger value="viewAll">View All Classes</TabsTrigger> */}
                </TabsList>
              </Header>
              <div className="overflow-auto max-h-screen">
                <LecturerNavigation />
                  <nav className="nav flex justify-center items-center ">
                    <Button
                        className=""
                        onClick={() => toggleUserDetails(!showUserDetails)}>
                        {showUserDetails ? "Show User Details" : "Hide User Details"}
                    </Button>
                  </nav>
                  <div hidden={showUserDetails}>
                    <UserNavigation></UserNavigation>
                  </div>
              </div>
              
              <div className="main overflow-auto max-h-screen">
                <TabsContent value="view">
                  <LecturerViewClasses></LecturerViewClasses>
                </TabsContent>

                <TabsContent value="search">
                  <LecturerSearch></LecturerSearch>
                </TabsContent>

                {/* <TabsContent value="viewAll">
                  <LecturerViewClasses viewAll></LecturerViewClasses>
                </TabsContent> */}

              </div>
        </div>

        </Tabs>
        
        
        <FooterComponent></FooterComponent>
    </>
  );
};

export default LecturerDashboard;
