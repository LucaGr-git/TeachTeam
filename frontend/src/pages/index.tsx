import { useEffect } from "react";
import LoginPage  from "../components/loginPage"
import FooterComponent from "@/components/general-components/footerComponent";
import { userService } from "../services/api";
import { User } from "@/types/types";

export default function Home() {

  useEffect(() => {
    fetchPet();
  });

  const fetchPet = async () => {
    try {
      let user: User = {
        email: "example@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
        isLecturer: false,
        fullTime: true,
        dateJoined: new Date().toISOString(),
      }
      const data = await userService.createUser(user);
    } catch (error) {
      console.error("Error fetching pet:", error);
    }
  }

  return (
    <>
        <LoginPage />
        <FooterComponent></FooterComponent>
    </>
  );
}
