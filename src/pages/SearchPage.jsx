import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axios";
import { useChatStore } from "../store/useChatStore";

const USERS_PER_PAGE = 10;

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParam = new URLSearchParams(location.search).get("query") || "";
  const pageParam = parseInt(new URLSearchParams(location.search).get("page")) || 1;

  const [query, setQuery] = useState(queryParam);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const observer = useRef();
  const setSelectedUser = useChatStore((state) => state.setSelectedUser);

  const fetchUsers = useCallback(async (searchQuery, page) => {
    setIsLoading(true);

    if (!searchQuery.trim()) return;

    try {
      const res = await axiosInstance.get(
        `/users/searchUsers?search=${searchQuery}&page=${page}&limit=${USERS_PER_PAGE}`
      );
      const { users, totalUsers } = res.data.data;

      setUsers((prev) => (page === 1 ? users : [...prev, ...users]));
      setHasMore(page * USERS_PER_PAGE < totalUsers);
    } catch (err) {
      console.error("Search error:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setQuery(queryParam);
    setUsers([]);
    setCurrentPage(1);

    if (queryParam.trim()) {
      fetchUsers(queryParam, 1);
    }
  }, [queryParam, fetchUsers]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    searchParams.set("page", currentPage);

    navigate({ search: searchParams.toString() }, { replace: true });
  }, [currentPage, navigate, location.search]);

  const lastUserRef = useCallback(
    (node) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((prev) => prev + 1);
          fetchUsers(queryParam, currentPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, fetchUsers, queryParam, currentPage]
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const trimmed = query.trim();

    if (trimmed && trimmed !== queryParam) {
      navigate(`/search?query=${encodeURIComponent(trimmed)}&page=1`);
      setCurrentPage(1);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    navigate("/");
  };

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex flex-col justify-between h-full p-6 rounded-lg overflow-hidden">
            <div>
              <form onSubmit={handleSearchSubmit} className="mb-6 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search for users..."
                  className="bg-base-300 rounded-xl px-6 py-3 outline-none text-lg w-full"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />

                <button type="submit" className="btn btn-primary h-10 min-h-0">
                  Search
                </button>
              </form>

              {queryParam && (
                <h1 className="text-xl font-semibold mb-4 text-gray-400">
                  Search results for: <span className="text-blue-600">"{queryParam}"</span>
                </h1>
              )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-4">
                {users.map((user, index) => {
                  const isLast = index === users.length - 1;
                  return (
                    <div
                      key={user._id}
                      ref={isLast ? lastUserRef : null}
                      onClick={() => handleUserSelect(user)}
                      onKeyDown={(e) => e.key === "Enter" && handleUserSelect(user)}
                      className="flex items-center gap-4 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-base-200 transition"
                      role="button"
                      tabIndex={0}
                    >
                      <img
                        src={user.profilePic || "/avatar.png"}
                        alt={user.name}
                        className="w-12 h-12 object-cover rounded-full"
                        loading="lazy"
                      />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-400">
                          ({user.nickname}) - {user.email}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {isLoading &&
                  Array.from({ length: USERS_PER_PAGE }).map((_, idx) => (
                    <div key={idx} className="animate-pulse flex items-center gap-4 p-4 bg-base-300 rounded-lg">
                      <div className="w-12 h-12 bg-base-200 rounded-full" />
                      <div className="flex flex-col gap-2 w-full">
                        <div className="h-4 bg-base-200 rounded w-1/3" />
                        <div className="h-3 bg-base-200 rounded w-2/3" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {!isLoading && !hasMore && users.length > 0 && (
              <p className="text-center text-gray-500 mt-4">No more users to load.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
