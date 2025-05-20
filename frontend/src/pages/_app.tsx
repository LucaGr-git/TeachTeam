import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../localStorage-context/auth";
import { UserDataProvider } from "@/localStorage-context/userDataProvider";
import { ClassDataProvider } from "@/localStorage-context/classDataProvider";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {

  return (
    <ClassDataProvider> {/* Auth provider so index and subsequent components can access the authentication context */}
      <UserDataProvider>
        <AuthProvider>
          <Component {...pageProps} >
            
          </Component>

          <Toaster />

        </AuthProvider>
      </UserDataProvider>
    </ClassDataProvider>
  );
}
