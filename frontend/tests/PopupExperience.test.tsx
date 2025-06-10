import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PopupExperience from "@/components/PopupExperience";
import { useUserData } from "@/database-context-providers/userDataProvider";
import { useAuth } from "@/database-context-providers/auth";
import { act } from  "react"

// Mock the hooks
jest.mock("@/localStorage-context/userDataProvider");
jest.mock("@/localStorage-context/auth");

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("PopupExperience", () => {
  test("should set end date to undefined if user checks 'currently working' switch", async () => {
    const mockSetTrigger = jest.fn();
    const mockAddUserExperience = jest.fn().mockReturnValue(true);
    const mockUser = { email: "test@example.com" };

    // Mock hooks
    (useUserData as jest.Mock).mockReturnValue({
      addUserExperience: mockAddUserExperience,
    });
    (useAuth as jest.Mock).mockReturnValue({
      getCurrentUser: () => mockUser,
    });

    render(
      <PopupExperience
        buttonPopup={true}
        setTrigger={mockSetTrigger}
      />
    );

    // Fill in title
    fireEvent.change(screen.getByPlaceholderText(/software engineer/i), {
      target: { value: "Frontend Dev" },
    });

    // Fill in company
    fireEvent.change(screen.getByPlaceholderText(/microsoft/i), {
      target: { value: "Microsoft" },
    });

    // Fill in start date
    fireEvent.change(screen.getByTestId("timeStarted"), {
      target: { value: "2022-01" },
    });

    // Check "currently working" switch (this removes the end date)
    const switchToggle = screen.getByTestId("currentJob");
    fireEvent.click(switchToggle);
    

    // Submit form
    await act(async () => {
      // Submit form
      fireEvent.click(screen.getByRole("button", { name: /save/i }));
    });

    // Validate submission
    expect(mockAddUserExperience).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Frontend Dev",
        company: "Microsoft",
        timeStarted: expect.any(String),
        timeFinished: "",
      }),
      "test@example.com"
    );
  });
});
