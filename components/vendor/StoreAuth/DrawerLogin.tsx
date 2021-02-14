import React, { useState } from "react";
import {
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Button,
  Icon,
  useToast,
  Text,
  Spinner,
} from "@chakra-ui/core";
import { useForm } from "react-hook-form";
import { graphQLClient, oAuthLoginLink } from "@/utils/client";
import { useRouter } from "next/router";
import { LOG_IN } from "@/graphql/users";
import { LoginRes, MutationLogInArgs } from "@/Typescript/types";
import { useToken } from "@/Context/TokenProvider";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { GoogleLogin } from "react-google-login";
import { CLIENT_ID } from "@/utils/client";

type prop = {
  storeid: string;
};

export const DrawerLogin: React.FC<prop> = ({ storeid }) => {
  const toast = useToast();
  const router = useRouter();
  const { setToken } = useToken();

  //react-hook-form
  const { handleSubmit, register, errors } = useForm();

  //show password or not in input field- password/confirm password
  const [show, setShow] = useState(false);
  const [Loading, setLoading] = useState(false);

  //loader screen after login with google --- since it takes a few secs before redirect
  const [Loader, setLoader] = useState(false);

  //form submit function

  const onSubmit = async (values: MutationLogInArgs): Promise<void> => {
    const { email, password } = values;

    const variables = {
      email: email.toLowerCase(),
      password,
    };

    try {
      setLoading(true);
      const res = await graphQLClient.request(LOG_IN, variables);
      const data: LoginRes = res.logIn;

      //setting cookies client side, should be done over server, but i ran into heroku/vercel problems in production
      Cookies.set("role", data.role, {
        expires: 7,
      });

      Cookies.set("ecom", data.refreshtoken, {
        expires: 7,
        // secure: true,
      });

      if (data) {
        setLoading(false);
        setToken(data.accesstoken);

        toast({
          title: "LogIn Successfull!",
          status: "success",
          duration: 3000,
        });
        router
          .push(`/product/checkout?id=${storeid}`)
          .then(() => window.scrollTo(0, 0));
      }
    } catch (err) {
      setLoading(false);
      if (err.message === "Network request failed") {
        toast({
          title: "Oops, Network Request Failed",
          description: "PLease Check Your Internet Connection and Try Again",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      toast({
        title: `${err.response?.errors[0].message || "An Error Occured"}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  //succesful oauth response
  const responseGoogle = async (response) => {
    setLoader(true);

    let data = {
      first_name: response.profileObj.givenName,
      last_name: response.profileObj.familyName,
      password: response.profileObj.googleId,
      email: response.profileObj.email,
    };
    const instance = axios.create({
      withCredentials: true,
    });

    try {
      if (response) {
        const res = await instance.post(oAuthLoginLink, {
          first_name: data.first_name,
          last_name: data.last_name,
          password: data.password,
          email: data.email,
        });

        //setting cookies client side, should be done over server, but i ran into heroku/vercel problems in production
        Cookies.set("role", res.data.role, {
          expires: 7,
        });

        Cookies.set("ecom", res.data.refreshtoken, {
          expires: 7,
          // secure: true,
        });

        if (res.data) {
          setToken(res.data.accesstoken);
          toast({
            title: "LogIn Successfull!",
            status: "success",
            duration: 5000,
          });
          router
            .push(`/product/checkout?id=${storeid}`)
            .then(() => window.scrollTo(0, 0));
        }
      }
    } catch (error) {
      setLoader(false);
      if (error.message === "Network Error") {
        toast({
          title: "Check your internet connection",
          status: "error",
          duration: 3000,
        });
        return;
      }
    }
  };
  //failed oauth response
  const failureGoogle = (response) => {
    setLoader(false);
    toast({
      title: "Google Error",
      description:
        "Please Login with the alternative method if this error persists",
      status: "error",
      duration: 3000,
    });
  };

  return (
    <div>
      {Loader && (
        <div className="opacity">
          <div className="spinner">
            <Spinner speed="1s" color="white"></Spinner>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isRequired>
          <div>
            <FormLabel htmlFor="email">Email</FormLabel>
            <InputGroup>
              <Input
                type="email"
                id="email"
                name="email"
                aria-describedby="email-helper-text"
                placeholder="email@example.com"
                ref={register({
                  required: "Required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "invalid email address",
                  },
                })}
                isInvalid={errors.email ? true : false}
                errorBorderColor="red.300"
              />
            </InputGroup>
            <small style={{ color: "red" }}>
              {errors.email && errors.email.message}
            </small>
          </div>

          <div>
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter Password"
                ref={register}
                isInvalid={errors.email ? true : false}
                errorBorderColor="red.300"
              />
              <InputRightElement width="4.5rem">
                <Icon
                  name="view"
                  color="blue.400"
                  cursor="pointer"
                  onClick={() => {
                    setShow(!show);
                  }}
                />
              </InputRightElement>
            </InputGroup>
            <span style={{ textAlign: "right" }}>
              <Link href="/password/change">
                <a style={{ color: "blue" }}>forgot password?</a>
              </Link>
            </span>
          </div>
        </FormControl>

        <div className="btn">
          <Text as="div" display="flex" flexDirection="column">
            <Button
              isDisabled={Loading}
              style={{ background: "var(--deepblue)" }}
              color="white"
              type="submit"
              isLoading={Loading}
            >
              Log in
            </Button>

            <span className="ml-2 mr-2 mt-2">Or</span>
            <GoogleLogin
              clientId={CLIENT_ID}
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={failureGoogle}
              cookiePolicy={"single_host_origin"}
              style={{ fontSize: "0.8rem" }}
            >
              Login With Google{" "}
            </GoogleLogin>
          </Text>
          <div>
            <small>
              Don't have an account? login quickly with Google or
              <span style={{ color: "blue" }}> click the Signup tab above</span>
            </small>
          </div>
        </div>
      </form>
      <style jsx>{`
        form div {
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
};
