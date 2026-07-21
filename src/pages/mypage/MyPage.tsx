import { 
    ProfileBasicInfo,
    PasswordChangeForm,
    NotificationSettings,
    SystemSetting,
    DataInfoSettings,
    MyPageButtonGroup
 } from "@/features/mypage";

 export const MyPage = () => {

  return (
    <div className="flex h-screen w-full bg-primary-50 p-7">

      <div className="flex flex-1 flex-col overflow-hidden">

        <main className="flex-1 overflow-y-auto p-8">
          
          <div className="mx-auto flex w-full flex-col gap-6 pb-12">
            
            <ProfileBasicInfo />
            <PasswordChangeForm />
            <NotificationSettings />
            <SystemSetting />
            <DataInfoSettings />
            <MyPageButtonGroup />
            
          </div>
        </main>
      </div>
    </div>
  );
};