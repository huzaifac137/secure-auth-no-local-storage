import { Router } from "next/router";
import { useState } from "react";

export default function Create({ posts }) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/posts/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: NAME,
        }),
      });

      const data = await response.json();
      if (response.status === 201) {
        setSubmitted(true);
      }
    } catch (err) {
      console.log("ERROR : " + err);
    }
  };

  const [NAME, setNAME] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [POSTS, setPOSTS] = useState([]);
  return (
    <>
      <h2 style={{ textAlign: "center" }}>..........POST NEW DATA......</h2>
      <input
        type="text"
        placeholder="name"
        onChange={(e) => setNAME(e.target.value)}
        value={NAME}
      />
      <button type="submit" onClick={handleSubmit}>
        SUBMIT
      </button>
      {submitted === true ? (
        <div>
          {posts.map((post) => (
            <>
              {" "}
              <h2>ID :{post.id}</h2>
              <h2>NAME : {post.name}</h2>{" "}
            </>
          ))}
        </div>
      ) : null}
    </>
  );
}

export async function getServerSideProps() {
  const response = await fetch(`http://localhost:5000/api/posts`);
  const data = await response.json();

  return {
    props: {
      posts: data.posts,
    },
  };
}
