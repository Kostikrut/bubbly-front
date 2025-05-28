import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatBox from "../components/ChatBox";

function HomePage() {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen-minus-header bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-screen ">
          <div className="flex h-[calc(100vh-5rem)] rounded-lg overflow-hidden">
            <div className={`${selectedUser && "hidden md:block"}  `}>
              <Sidebar />
            </div>

            {!selectedUser ? <NoChatSelected /> : <ChatBox />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
