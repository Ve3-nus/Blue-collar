import {
  useContext,
} from "react";

import {
  AuthContext,
} from "../context/AuthContext";

export default function Dashboard() {

  const {
    user,
    logout,
  } = useContext(
    AuthContext
  );

  return (
    <div className="p-10">

      <h1 className="text-3xl">

        Welcome

        {" "}

        {user?.first_name}

      </h1>

      <p>
        Role:
        {" "}
        {user?.role}
      </p>

      <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 mt-4"
      >
        Logout
      </button>

    </div>
  );
}