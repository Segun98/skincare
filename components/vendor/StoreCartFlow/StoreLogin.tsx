import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/core";
import React from "react";
import { DrawerLogin } from "../StoreAuth/DrawerLogin";
import { DrawerSignup } from "../StoreAuth/DrawerSignup";

interface prop {
  isOpen: any;
  onClose: any;
  storeid: string;
}

export const StoreLogin = ({ isOpen, onClose, storeid }) => {
  return (
    <div>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Hello, Sign In</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Tabs isFitted variant="enclosed-colored">
              <TabList mb="1em">
                <Tab
                  _selected={{
                    fontWeight: "bold",
                    background: "var(--secondary)",
                    color: "white",
                  }}
                >
                  Login
                </Tab>
                <Tab
                  _selected={{
                    fontWeight: "bold",
                    background: "var(--secondary)",
                    color: "white",
                  }}
                >
                  Signup
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <DrawerLogin storeid={storeid} />
                </TabPanel>
                <TabPanel>
                  <DrawerSignup />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};
