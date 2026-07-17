import { useLocation, Navigate } from "react-router-dom"
import { EmailSentHeader, EmailSentButtonGroup } from "@/features/auth";

export const EmailSentPage = () => {
    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        return <Navigate to="/find-password" replace />;
    }

    return (
    <div className="flex min-h-screen items-center justify-center bg-primary-100 font-sans">
      <div className="flex w-full max-w-lg flex-col items-center rounded-3xl bg-white px-10 py-16 shadow-card">
        
        <EmailSentHeader email={email} />
        
        <div className="my-8 h-px w-full bg-gray-200" />
        
        <EmailSentButtonGroup />
      </div>
    </div>
  );
}