export function UsersList({ query, filteredUsers, handleUserClick }) {
  return (
    <div className="flex gap-3 flex-col">
      {query.length > 3 ? (
        filteredUsers.length < 25 ? (
          filteredUsers.map((user) => (
            <div
              key={user.uid}
              onClick={() => handleUserClick(user.id, user.uid)}
              className="cursor-pointer hover:bg-slate-400"
            >
              <div>{user.uid}</div>
            </div>
          ))
        ) : (
          <h1>{filteredUsers.length} results found</h1>
        )
      ) : (
        <h1>Search a user</h1>
      )}
    </div>
  );
}
