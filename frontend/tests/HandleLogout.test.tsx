import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/general-components/Header";
import { useAuth } from "@/localStorage-context/auth";
import { useRouter } from "next/router";

// Mock the hooks
jest.mock("@/localStorage-context/auth");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Header", () => {
  test("Calls logout and navigates to login page on sign out", () => {
    const mockLogout = jest.fn();
    const mockPush = jest.fn();

    (useAuth as jest.Mock).mockReturnValue({ logout: mockLogout });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    render(<Header />);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    fireEvent.click(signOutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});