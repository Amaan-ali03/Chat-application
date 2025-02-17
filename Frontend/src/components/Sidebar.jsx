import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Track sidebar expansion

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = showOnlineOnly
    ? (users ?? []).filter((user) => onlineUsers?.includes(user._id))
    : users ?? [];

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside 
      className={`
        h-full border-r border-base-300 flex flex-col transition-all duration-300
        ${isExpanded ? "w-72" : "w-20"}
      `}
    >
      {/* Sidebar Header */}
      <div className="border-b border-base-300 w-full p-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          {isExpanded && <span className="font-medium">Contacts</span>}
        </div>

        {/* Expand/Collapse Button */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Online Filter Toggle (Only Visible in Expanded Mode) */}
      {isExpanded && (
        <div className="mt-3 flex items-center gap-2 px-5">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({(onlineUsers?.length ?? 1) - 1} online)
          </span>
        </div>
      )}

      {/* User List */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {(onlineUsers ?? []).includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            {/* User info (Only Visible in Expanded Mode) */}
            {isExpanded && (
              <div className="text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {(onlineUsers ?? []).includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            )}
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;