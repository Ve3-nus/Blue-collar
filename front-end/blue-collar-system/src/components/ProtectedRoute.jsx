import { useState, useContext }
from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  AuthContext,
} from "../context/AuthContext";

import {
  loginUser,
  getCurrentUser,
} from "../api/auth";

export default function Login() {

  const navigate =
    useNavigate();

  const { setUser } =
    useContext(AuthContext);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleSubmit =
    async (e) => {

    e.preventDefault();

    try {

      const response =
        await loginUser({
          email,
          password,
        });

      localStorage.setItem(
        "token",
        response.token
      );

      const user =
        await getCurrentUser();

      setUser(user);

      navigate("/dashboard");

    } catch {

      alert(
        "Invalid credentials"
      );
    }
  };

  return (
    <div className="p-10">

      <h1 className="text-3xl mb-5">
        Login
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-3"
      >

        <input
          placeholder="Email"
          className="border p-2 w-full"
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          className="bg-green-600 text-white px-4 py-2"
        >
          Login
        </button>

      </form>
    </div>
  );
}