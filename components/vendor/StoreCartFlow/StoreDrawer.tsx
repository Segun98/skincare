import { screenWidth } from "@/utils/helpers";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/core";
import { StoreCart } from "./StoreCart";
import { Cart, UsersRes } from "@/Typescript/types";

interface props {
  isOpen: any;
  onClose: any;
  cart: Cart[];
  user: UsersRes;
}
export const StoreDrawer: React.FC<props> = ({
  isOpen,
  onClose,
  cart,
  user,
}) => {
  return (
    <div>
      <Drawer
        placement={"right"}
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior={"inside"}
        size={screenWidth() > 800 ? "sm" : "xs"}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Your Cart</DrawerHeader>
            <DrawerBody>
              <StoreCart cart={cart} user={user} />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </div>
  );
};
