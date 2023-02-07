import authContext from "@/CONTEXT/authContext";
import useRefreshToken from "@/CUSTOME-HOOKS/useRefreshToken";
import { Router } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const context = useContext(authContext);

  const handleGetUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`,
        {
          headers: {
            Authorization: `mjfcmjbl${context.token}`,
          },
          credentials: "include",
        },
      );

      const responseData = await response.json();

      if (response.status !== 200) {
        throw new Error(responseData.message);
      }

      toast.success(responseData.message);
      setUsers(responseData.users);
    } catch (err) {
      toast.error(err.message);
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  return (
    <>
      <h1>HOME PAGE INDEX.JS</h1>

      <button onClick={handleGetUsers}> GET USERS</button>

      {users !== [] &&
        users?.map((user) => (
          <div key={Math.random()}>
            <h1 style={{ margin: "30px auto" }}>username : {user.username}</h1>
            <h2>email : {user.email} </h2>
          </div>
        ))}
    </>
  );
}
