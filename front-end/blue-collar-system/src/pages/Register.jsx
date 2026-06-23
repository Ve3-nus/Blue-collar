import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] =
    useState({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      role: "customer",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await registerUser(form);

      alert("Registration successful");

      navigate("/");

    } catch (error) {

      console.log(error);

      alert("Registration failed");
    }
  };

  return (
    <div className="p-10">

      <h1 className="text-3xl mb-5">
        Register
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-3"
      >

        <input
          placeholder="First Name"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              first_name:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Last Name"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              last_name:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Email"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              email:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Phone"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              phone:
                e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              password_confirmation:
                e.target.value,
            })
          }
        />

        <select
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              role:
                e.target.value,
            })
          }
        >
          <option value="customer">
            Customer
          </option>

          <option value="worker">
            Worker
          </option>
        </select>

        <button
          className="bg-blue-600 text-white px-4 py-2"
        >
          Register
        </button>

      </form>
    </div>
  );
}