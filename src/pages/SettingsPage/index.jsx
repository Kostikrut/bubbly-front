import AppearanceSettings from "./AppearanceSettings";
import PrivacySettings from "./PrivacySettings";
import NotificationSettings from "./NotificationSettings";

const SettingsPage = () => {
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)] overflow-y-auto p-6 space-y-6">
          <AppearanceSettings />
          <NotificationSettings />
          <PrivacySettings />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
