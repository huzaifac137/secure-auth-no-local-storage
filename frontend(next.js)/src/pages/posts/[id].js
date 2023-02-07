export async function getStaticPaths() {
  let posts;
  try {
    const response = await fetch("http://localhost:5000/api/posts");

    const data = await response.json();

    posts = data.posts;
  } catch (err) {
    console.log("ERROR : " + err);
  }
  const paths = posts?.map((post) => ({
    params: { id: post.id },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  let post;
  try {
    const response = await fetch(
      `http://localhost:5000/api/posts/${params.id}`,
    );

    const data = await response.json();
    post = data.post;
  } catch (err) {
    console.log("ERROR : " + err);
  }

  return {
    props: {
      post: post,
    },
    revalidate: 30,
  };
}

export default function Post({ post }) {
  return (
    <>
      <h2> NAME : {post?.name}</h2>
      <h3> ID : {post?.id} </h3>
    </>
  );
}
