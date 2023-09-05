import React, {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { graphQLClient } from "@/utils/client";
import { useToken } from "./TokenProvider";
import { UsersRes } from "@/Typescript/types";
import { gql } from "graphql-request";
import Cookies from "js-cookie";
interface props {
  User: UsersRes;
  setUser: Dispatch<SetStateAction<any>>;
  userDependency: boolean;
  setUserDependency: Dispatch<SetStateAction<boolean>>;
}

export const UserContext = createContext<props>(undefined);
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  function StringReduction(str) {
    // Set initial counter variable to 0
    var i = 0;
    // Split the string into an array of letters
    var letters = str.split("");
    // Start do loop.
    do {
      // If the first and second letter in the array match any of the pairs
      if (
        (letters[i] == "a" && letters[i + 1] == "b") ||
        (letters[i] == "b" && letters[i + 1] == "a")
      ) {
        // Remove the second letter
        letters.splice(i + 1, 1);
        // Transform the first letter
        letters[i] = "c";
        // Set the counter back to 0 so we can start at the beginning again
        i = 0;
      } else if (
        (letters[i] == "b" && letters[i + 1] == "c") ||
        (letters[i] == "c" && letters[i + 1] == "b")
      ) {
        letters.splice(i + 1, 1);
        letters[i] = "a";
        i = 0;
      } else if (
        (letters[i] == "c" && letters[i + 1] == "a") ||
        (letters[i] == "a" && letters[i + 1] == "c")
      ) {
        letters.splice(i + 1, 1);
        letters[i] = "b";
        i = 0;
        // If no conditions are met, incremenet the counter
      } else {
        i++;
      }
    } while (i < letters.length);
    // Return the length of the transformed string
    return letters.length;
  }

  const [User, setUser] = useState<UsersRes>({});

  //to refetch "fetchUser()" effect on user update
  const [userDependency, setUserDependency] = useState(false);
  const { Token } = useToken();

  useEffect(() => {
    fetchUser();
  }, [Token, userDependency]);

  const getUser = gql`
    query getUser {
      getUser {
        id
        first_name
        last_name
        email
        phone
        pending
        online
        created_at
        business_name
        business_name_slug
        business_address
        business_image
        business_bio
        customer_address
        role
      }
    }
  `;
  async function fetchUser() {
    if (!Cookies.get("ecom")) {
      return;
    }
    graphQLClient.setHeader("authorization", `bearer ${Token}`);
    try {
      const res = await graphQLClient.request(getUser);
      const data = res.getUser;
      if (data) {
        setUser(data);
      }
    } catch (err) {
      // console.log(err.response?.errors[0].message);
    }
  }

  return (
    <UserContext.Provider
      value={{ User, setUser, userDependency, setUserDependency }}
    >
      {children}
    </UserContext.Provider>
  );
};
