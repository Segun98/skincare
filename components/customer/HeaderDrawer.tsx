import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/core";
import { useUser } from "@/Context/UserProvider";
import Link from "next/link";
import { screenWidth } from "@/utils/helpers";
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
              <Link href="/customer/login">
                <a>Hello, Login</a>
              </Link>
            )}
          </DrawerHeader>
          <DrawerBody background="var(--softblue)">
            <nav className="navigation">
              <h1>PROFILE</h1>
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
                <Link href="/customer/cart">
                  <a>
                    <li>Cart</li>
                  </a>
                </Link>
                <Link href="/customer/orders">
                  <a>
                    <li>Orders</li>
                  </a>
                </Link>
                <Link href="/customer#contact">
                  <a>
                    <li>Help</li>
                  </a>
                </Link>
                <Link href="/stores">
                  <a>
                    <li>Stores</li>
                  </a>
                </Link>
              </ul>
              <h1>Categories</h1>
              <ul>
                <Link href="/category?category=Gifts">
                  <a>
                    <li>Body</li>
                  </a>
                </Link>

                <Link href="/category?category=Decorations">
                  <a>
                    <li>Cleanser</li>
                  </a>
                </Link>
                <Link href="/category?category=Games">
                  <a>
                    <li>Toner</li>
                  </a>
                </Link>
                <Link href="/category?category=Drinks">
                  <a>
                    <li>Sunscreen</li>
                  </a>
                </Link>
                <Link href="/category?category=Props">
                  <a>
                    <li>Face Cosmetics</li>
                  </a>
                </Link>
                <Link href="/category?category=Cakes">
                  <a>
                    <li>Hair</li>
                  </a>
                </Link>
                <Link href="/party?category=House Party">
                  <a>
                    <li>Cleansers</li>
                  </a>
                </Link>
                <Link href="/party?category=Beach Party">
                  <a>
                    <li>Exfoilators</li>
                  </a>
                </Link>
                <Link href="/party?category=Birthday Party">
                  <a>
                    <li>Treatment</li>
                  </a>
                </Link>
                <Link href="/party?category=Outdoors">
                  <a>
                    <li>Serum</li>
                  </a>
                </Link>
                <Link href="/party?category=Indoors">
                  <a>
                    <li>Moisturizer</li>
                  </a>
                </Link>
              </ul>
            </nav>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
      <style jsx>{`
        .navigation ul li {
          padding: 10px;
          border-bottom: 1px solid var(--lightblue);
        }

        .navigation h1 {
          color: var(--text);
          font-weight: bold;
          padding: 8px;
          text-align: center;
        }
      `}</style>
    </Drawer>
  );
};
