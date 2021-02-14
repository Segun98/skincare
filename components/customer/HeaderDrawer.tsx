import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Accordion,
  Box,
  AccordionItem,
  AccordionHeader,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/core";
import { useUser } from "@/Context/UserProvider";
import Link from "next/link";
import {
  categoriesList,
  mainCategoriesList,
  screenWidth,
} from "@/utils/helpers";
import Cookies from "js-cookie";
import { useToken } from "@/Context/TokenProvider";

interface props {
  isOpen: boolean;
  onClose: () => void;
}
export const HeaderDrawer: React.FC<props> = ({ isOpen, onClose }) => {
  //   context
  const { User } = useUser();
  const { Token } = useToken();
  const role = Cookies && Cookies.get("role");

  return (
    <Drawer
      placement={"left"}
      onClose={onClose}
      isOpen={isOpen}
      scrollBehavior={"inside"}
      size={screenWidth() > 800 ? "sm" : "xs"}
    >
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {role ? (
              <div style={{ cursor: "pointer" }}>
                <div>Hi, {Token && User && User.first_name}</div>
              </div>
            ) : (
              <div style={{ display: "flex" }}>
                <img src="/profile.svg" alt="" className="mr-1" />
                <Link href="/customer/login">
                  <a>Hello, Login</a>
                </Link>
              </div>
            )}
          </DrawerHeader>
          <DrawerBody>
            <nav className="navigation">
              <ul>
                <Link href="/">
                  <a>
                    <li>Home</li>
                  </a>
                </Link>
                <Link href="/customer/account">
                  <a>
                    <li>Account</li>
                  </a>
                </Link>
                {Token && role && (
                  <Link href="/customer/orders">
                    <a>
                      <li>Orders</li>
                    </a>
                  </Link>
                )}
                <Link href="/customer/account#wishlist">
                  <a>
                    <li>Wishlist</li>
                  </a>
                </Link>
                <Link href="/stores">
                  <a>
                    <li>Stores</li>
                  </a>
                </Link>
              </ul>

              <div>
                <Accordion allowToggle>
                  <AccordionItem>
                    <AccordionHeader>
                      <Box flex="1" textAlign="left">
                        <h1>Main Categories</h1>
                      </Box>
                      <AccordionIcon />
                    </AccordionHeader>
                    <AccordionPanel pb={4}>
                      {mainCategoriesList.map((m, i) => (
                        <ul key={i}>
                          <Link href={`/main?category=${m}`}>
                            <a>
                              <li>{m}</li>
                            </a>
                          </Link>
                        </ul>
                      ))}
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem>
                    <AccordionHeader>
                      <Box flex="1" textAlign="left">
                        <h1>Other Categories</h1>
                      </Box>
                      <AccordionIcon />
                    </AccordionHeader>
                    <AccordionPanel pb={4}>
                      {categoriesList.map((c, i) => (
                        <ul key={i}>
                          <Link href={`/category?category=${c}`}>
                            <a>
                              <li>{c}</li>
                            </a>
                          </Link>
                        </ul>
                      ))}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </div>
            </nav>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
      <style jsx>{`
        .navigation ul li {
          padding: 10px;
          font-size: 0.9rem;
          font-weight: 400;
        }

        .navigation h1 {
          font-weight: 600;
          padding: 8px;
          font-size: 1.1rem;
        }

        @media only screen and (min-width: 700px) {
          .navigation ul li {
            font-size: 1rem;
          }
        }
      `}</style>
    </Drawer>
  );
};
