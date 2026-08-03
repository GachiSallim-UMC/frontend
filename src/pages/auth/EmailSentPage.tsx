import { useLocation, Navigate, Link } from "react-router-dom"
import { EmailSentHeader, EmailSentButtonGroup } from "@/features/auth";

export const EmailSentPage = () => {
    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        return <Navigate to="/find-password" replace />;
    }

    return (
    <div className="flex min-h-screen items-center justify-center bg-primary-100">
      <div className="w-full h-[696px] max-w-lg rounded-3xl bg-white px-10 pt-10 pb-8">
        
        <EmailSentHeader email={email} />
        
        <div className="my-5 h-px w-full bg-gray-200" />
        
        <EmailSentButtonGroup email={email} />

        <div className="mt-5 flex justify-center">
          <Link to="/login" className="text-base font-medium text-primary-500 underline">
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}