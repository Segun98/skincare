import {
  Button,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/core";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";
import axios from "axios";
import { restEndpoint } from "@/utils/client";

export const Reset = () => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  //fetch user email
  useEffect(() => {
    async function getEmail() {
      try {
        const res = await axios.post(`${restEndpoint}/get_email`, {
          id: router.query.id,
        });
        setEmail(res.data.email);
      } catch (error) {
        toast({
          title: "I don't think you should be here",
          status: "error",
          isClosable: true,
        });
      }
    }
    if (router.query.id) {
      getEmail();
    }
  }, [router]);

  //change password
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "password is weak",
        status: "info",
        isClosable: true,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "passwords do not match",
        status: "info",
        isClosable: true,
      });
      return;
    }
    const data = {
      email,
      id: router.query.id,
      newpassword: newPassword,
    };
    try {
      setLoading(true);
      const res = await axios.post(`${restEndpoint}/change_password`, {
        data,
      });
      setLoading(false);

      if ((res.data = "password successfully changed!")) {
        toast({
          title: res.data,
          status: "info",
          isClosable: true,
          duration: 7000,
          position: "top",
        });
        setSuccess(true);
        return;
      }

      toast({
        title: "An error occured",
        status: "error",
        isClosable: true,
      });
    } catch (err) {
      setSuccess(false);
      setLoading(false);
      toast({
        title: "An error occured",
        status: "error",
        isClosable: true,
      });
    }
  };
  return (
    <Layout>
      <Head>
        <title>Password Reset | Tadlace</title>
      </Head>
      <div className="indicator">
        <div className="change-pass-wrap">
          <Text
            as="h1"
            mb="10px"
            color="var(--deepblue)"
            fontSize="1.3rem"
            fontWeight="bold"
          >
            Password Reset
          </Text>
          <Text mb="10px" color="var(--deepblue)" fontSize="1.2rem">
            For: {email}
          </Text>
          <form onSubmit={handleSubmit}>
            <FormLabel htmlFor="password">Enter Your New Password</FormLabel>
            <InputGroup>
              <Input
                id="password"
                isRequired
                type={show ? "text" : "password"}
                value={newPassword}
                placeholder="Enter Your New Password"
                onChange={(e) => setNewPassword(e.target.value)}
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

            <FormLabel htmlFor="confirm password" mt="5px">
              Confirm Password
            </FormLabel>
            <InputGroup>
              <Input
                id="confirm password"
                isRequired
                type={show ? "text" : "password"}
                value={confirmPassword}
                placeholder="Confirm Pasword"
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            <br />
            <Button
              type="submit"
              background="var(--deepblue)"
              color="white"
              isDisabled={email ? false : true}
              isLoading={loading}
            >
              Submit
            </Button>
            <br />
            {success && (
              <Text as="div" marginTop="5px">
                <Text as="p" color="var(--deepblue)">
                  Password Updated!
                </Text>
              </Text>
            )}
          </form>
        </div>
      </div>
      <style jsx>{`
        .indicator {
          margin: auto;
          width: 100%;
        }
        form Input {
          width: 400px;
        }
        .change-pass-wrap {
          width: 90%;
        }

        @media only screen and (min-width: 700px) {
          .change-pass-wrap {
            width: 70%;
          }
        }

        @media only screen and (min-width: 1000px) {
          .change-pass-wrap {
            width: 60%;
          }
        }

        @media only screen and (min-width: 1200px) {
          .change-pass-wrap {
            width: 40%;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Reset;
