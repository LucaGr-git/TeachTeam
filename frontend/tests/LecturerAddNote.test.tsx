import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PopupExperience from "@/components/PopupExperience";
import { useClassData } from "@/localStorage-context/classDataProvider";
import { useAuth } from "@/localStorage-context/auth";
import { act } from  "react"
import LecturerAddNote from "@/components/lecturer-components/LecturerAddNote";

jest.mock("@/localStorage-context/auth");
jest.mock("@/localStorage-context/classDataProvider");

describe("AddNote", () => {
    test("Testing if addNote pushes the lecturer made note to localStorage, which is in classData", async () => {
        const mockAddNote= jest.fn().mockReturnValue(true);
        const mockTutor = { email: "tutor@student.rmit.edu.au" };
        const mockLecturer = {email: "lecturer@rmit.edu.au"};
        const mockSetVisibilityTrigger = jest.fn();
        const mockSetRerenderParentCounter = jest.fn();

        const mockCourseCode = "COSC1234";
        
        // Mock hooks
        (useClassData as jest.Mock).mockReturnValue({
            addNote: mockAddNote,
            getClassRecords: () => ({
                [mockCourseCode]: {
                tutorsShortlist: [
                    { tutorEmail: mockTutor.email }
                ]
                }
            }),
        });

        (useAuth as jest.Mock).mockReturnValue({
            getUsers: () => [],
            getCurrentUser: () => ({ email: mockLecturer}),
            isAuthenticated: true,
            isLecturer: true
            });

        render(
            <LecturerAddNote
                courseCode={mockCourseCode}
                tutorEmail={mockTutor.email}
                visibility={true}
                setVisibilityTrigger={mockSetVisibilityTrigger}
                rerenderParentCounter={0}
                setRerenderParentCounter={mockSetRerenderParentCounter}
            />
        );

        const noteInput = screen.getByPlaceholderText(/type your note here/i);
        fireEvent.change(noteInput, { target: { value: "This tutor is great." } });

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /submit note/i }));
        });

        expect(mockAddNote).toHaveBeenCalledWith(
            mockCourseCode,
            mockTutor.email,
            mockLecturer,
            "This tutor is great."
          );
          expect(mockSetVisibilityTrigger).toHaveBeenCalledWith(false);
          expect(mockSetRerenderParentCounter).toHaveBeenCalledWith(1);

    }
    )
})
