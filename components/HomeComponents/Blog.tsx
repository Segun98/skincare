// import { useState, useEffect } from "react";
// import sanityClient from "@sanity/client";
// import BlockContent from "@sanity/block-content-to-react";

// const client = sanityClient({
//   projectId: "",
//   dataset: "production",
//   // token: 'sanity-auth-token', // or leave blank to be anonymous user
//   // useCdn: true // `false` if you want to ensure fresh data
// });
export const Blog = () => {
  // const [body, setbody] = useState([]);
  // const query = `*[_type == "post"]{
  //   title,
  //   body
  // }`;

  // function sanity() {
  //   client.fetch(query).then((posts) => {
  //     setbody(posts);
  //   });
  // }
  // useEffect(() => {
  //   sanity();
  // }, []);
  return (
    <div>
      {/* {body.length > 0 && (
        <div>
          <p>{body[0].title}</p>
          <BlockContent
            blocks={body[0].body}
            projectId={""}
            dataset={"production"}
          />
        </div>
      )} */}
    </div>
  );
};
