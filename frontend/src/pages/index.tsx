import { useEffect } from "react";
import LoginPage  from "../components/loginPage"
import FooterComponent from "@/components/general-components/footerComponent";
import { userService } from "../services/api";
import { User } from "@/types/types";

export default function Home() {


  return (
    <>
        <LoginPage />
        <FooterComponent></FooterComponent>
    </>
  );
}
