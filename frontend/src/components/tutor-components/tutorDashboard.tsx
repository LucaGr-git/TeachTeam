import React from "react";
import Header from "@/components/general-components/Header";
import UserNavigation from "@/components/UserNavigation";
import FooterComponent from "@/components/general-components/footerComponent";
import TutorApplyList from "./TutorApplyList";
import TutorAppliedList from "./TutorAppliedList";
import { Tabs, TabsList, TabsTrigger, TabsContent} from '../ui/tabs';
import TutorJobList from "./TutorJobList";

const TutorDashboard = () => {

  return (
    <>  
        <Tabs defaultValue="apply">
          <div className="layout">
              <Header>
                <TabsList className="w-65 sm:w-xl">
                  <TabsTrigger value="apply">Apply</TabsTrigger>
                  <TabsTrigger value="applied">Courses Applied</TabsTrigger>
                  <TabsTrigger value="tutoring">Courses Tutoring</TabsTrigger>
                </TabsList>
              </Header>
              <div className="overflow-auto max-h-screen">
                <UserNavigation />
              </div>
              
              <div className="main overflow-auto max-h-screen">
                <TabsContent value="apply">
                  <TutorApplyList></TutorApplyList>
                </TabsContent>

                <TabsContent value="applied">
                  <TutorAppliedList></TutorAppliedList>
                </TabsContent>

                <TabsContent value="tutoring">
                  <TutorJobList></TutorJobList>
                </TabsContent>

              </div>
        </div>

        </Tabs>
        
        
        <FooterComponent></FooterComponent>
    </>
  );
};

export default TutorDashboard;
