import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { axiosInstance } from "../utils/axios";
import { useChatStore } from "../store/useChatStore";

const UserSearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const navigate = useNavigate();
  const { setSelectedUser } = useChatStore();
  const abortControllerRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  const fetchResults = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      setHasMore(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await axiosInstance.get(`/users/searchUsers?search=${query}`, {
        signal: controller.signal,
      });

      const { users } = res.data.data;

      setResults(users.slice(0, 10));
      setHasMore(users.length > 10);
    } catch (err) {
      if (err.name !== "CanceledError") {
        console.error("Search error:", err.message);
      }
    }
  }, [query]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasMore(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchResults();
    }, 400);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, fetchResults]);

  const handleBlur = (e) => {
    if (!containerRef.current.contains(e.relatedTarget)) {
      setIsOpen(false);
      setQuery("");
      setResults([]);
      setHasMore(false);
    }
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleRedirect = () => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}&page=1`);
      setIsOpen(false);
      setQuery("");
      setResults([]);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex items-center transition-all duration-300 overflow-hidden rounded-full px-2 ${
        isOpen ? "w-72" : "w-10 bg-transparent"
      }`}
      tabIndex={-1}
      onBlur={handleBlur}
    >
      <button onClick={toggleOpen} className="p-2 flex transition">
        <Search size={18} />
      </button>

      {isOpen && (
        <input
          type="text"
          placeholder=" Search for users..."
          className="flex-1 bg-primary text-white rounded-xl p-1 outline-none text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleRedirect();
              toggleOpen();
            }
          }}
          autoFocus
        />
      )}

      {results.length > 0 && (
        <div className="absolute top-full mt-1 left-0 w-72 bg-base-200 shadow-lg rounded-md overflow-hidden z-50">
          {results.map((user) => (
            <div
              key={user._id}
              className="flex px-4 py-2 text-sm hover:bg-base-300 cursor-pointer"
              onClick={() => {
                setSelectedUser(user);
                toggleOpen();
                setQuery("");
                setResults([]);
              }}
            >
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 p-2 object-cover rounded-full"
              />
              {user.name} ({user.nickname}) - {user.email}
            </div>
          ))}
          {hasMore && (
            <button
              onClick={handleRedirect}
              className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 border-t"
            >
              See all results
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearchBar;
