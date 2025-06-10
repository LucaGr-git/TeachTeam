import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../database-context-providers/auth";
import { UserDataProvider } from "@/database-context-providers/userDataProvider";
import { ClassDataProvider } from "@/database-context-providers/classDataProvider";
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
