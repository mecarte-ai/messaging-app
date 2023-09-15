import { useEffect, useRef } from "react";

export function SearchUserForm({ query, onSearch }) {
  const userSearchRef = useRef(null);
  useEffect(() => {
    onSearch("");
    userSearchRef.current.focus();
  }, []);

  return (
    <div className="">
      <input
        type="text"
        value={query}
        onChange={(e) => onSearch(e.target.value)}
        className=" text-black p-1 w-full"
        placeholder="Type here to search"
        ref={userSearchRef}
      />
    </div>
  );
}
