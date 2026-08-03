import { useState } from "react";
import {
    ProfileBasicInfo,
    PasswordChangeForm,
    NotificationSettings,
    SystemSetting,
    DataInfoSettings,
    MyPageButtonGroup
 } from "@/features/mypage";
import { MyPagePrivacyPage } from "@/pages/mypage/MyPagePrivacyPage";
import { MyPageTermsPage } from "@/pages/mypage/MyPageTermsPage";

 export const MyPage = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-primary-50 p-7">

      <div className="flex flex-1 flex-col overflow-hidden">

        <main className="flex-1 overflow-y-auto p-8">

          <div className="mx-auto flex w-full flex-col gap-6 pb-12">

            <ProfileBasicInfo />
            <PasswordChangeForm />
            <NotificationSettings />
            <SystemSetting />
            <DataInfoSettings
              onViewPrivacy={() => setIsPrivacyOpen(true)}
              onViewTerms={() => setIsTermsOpen(true)}
            />
            <MyPageButtonGroup />

          </div>
        </main>
      </div>

      <MyPagePrivacyPage isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <MyPageTermsPage isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </div>
  );
};