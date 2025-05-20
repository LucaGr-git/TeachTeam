import React, {useState} from "react";
import { Button } from "../ui/button";
import LecturerClassCard from "./LecturerClassCard";
import PopupShortlist from "./PopupShortlist";
import PopupApplicantList from "./PopupApplicantList";


// interface for the class card details
interface LecturerClassPopupProps {
  courseCode: string; // course code
}

const LecturerClassPopup = ({ courseCode }: LecturerClassPopupProps) => {
  // Button popup useState for showing applicants and shortlist
  // must be defined within map otherwise popups would share states
  const [applicantPopup, toggleApplicantPopup] = useState(false);
  const [shortlistPopup, toggleShortlistPopup] = useState(false);
  
  return (
      <LecturerClassCard courseCode={courseCode} key={courseCode}>
          <div className="flex">
          <p className="mt-4 mb-4">Click to <b>View Candidates</b></p>
          <Button 
              className="mt-2 mb-2 ml-auto"
              onClick={() => toggleApplicantPopup(true)}>View Applicants
          </Button>
          </div>
          
          {(applicantPopup)? <PopupApplicantList 
              buttonPopup={applicantPopup} 
              setTrigger={toggleApplicantPopup}
              courseCode={courseCode}></PopupApplicantList> : <></>}

          <div className="flex">
          <p className="mt-4 mb-4">Click to <b>View Shortlist</b></p>
          <Button 
              className="mt-2 mb-2 ml-auto"
              onClick={() => toggleShortlistPopup(true)}>View Shortlist
          </Button>
          </div>
          
          {(shortlistPopup)?
          <PopupShortlist 
              buttonPopup={shortlistPopup} 
              setTrigger={toggleShortlistPopup}
              courseCode={courseCode}></PopupShortlist> : <></>}
          
      </LecturerClassCard>
  );

  
  

};

export default LecturerClassPopup;
