import React, { useEffect, useState } from "react";
import { useToken } from "@/Context/TokenProvider";
import { useUser } from "@/Context/UserProvider";

import { mutate } from "swr";
import { withdrawalMutation } from "@/graphql/vendor";
import {
  Button,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  useToast,
} from "@chakra-ui/core";
import { useMutation } from "@/utils/useMutation";
import axios from "axios";
import { restEndpoint } from "@/utils/client";

interface prop {
  balance: number;
}

export const Withdraw: React.FC<prop> = ({ balance }) => {
  const { Token } = useToken();
  const { User } = useUser();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  //all banks in Nigeria
  const [banks, setBanks] = useState([]);
  //account name from API
  const [accountName, setAccountName] = useState("");

  //select input field
  const [bankCode, setBankCode] = useState("");
  //Account Number
  const [accountNo, setAccountNo] = useState("");

  const toast = useToast();

  //states
  const [amount, setAmount] = useState<undefined | null | number | string>("");
  const [password, setPassword] = useState("");

  async function getBanks() {
    try {
      const res = await axios.get(`https://api.paystack.co/bank`, {
        headers: {
          Authorization: `Bearer ${process.env.PUBLIC_KEY}`,
        },
      });
      setBanks(res.data.data);
    } catch (error) {
      toast({
        title: "Can't select banks?",
        description: "Check your internet and refresh the page",
        status: "info",
      });
    }
  }

  useEffect(() => {
    getBanks();
  }, []);

  //get account name
  async function resolveAccount() {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.paystack.co/bank/resolve?account_number=${Number(
          accountNo
        )}&bank_code=${bankCode}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.SECRET_KEY_TEST}`,
          },
        }
      );
      setAccountName(res.data.data.account_name);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Reciever not found",
        status: "error",
      });
    }
  }

  function confirmReciever(e) {
    e.preventDefault();
    resolveAccount();
  }

  //withdraw form. minor checks
  async function handleWithdrawal(e) {
    e.preventDefault();

    if (!amount || !password) {
      toast({
        title: "All fields must be filled",
        isClosable: true,
      });
      return;
    }

    if (amount < 1) {
      toast({
        title: "You can't withdraw nothing :-/",
        isClosable: true,
      });
      return;
    }

    if (amount > balance) {
      toast({
        title: "You can't withdraw more than your wallet balance :-/",
        isClosable: true,
      });
      return;
    }

    //password check
    try {
      await axios.post(`${restEndpoint}/password_check`, {
        password,
        user_id: User.id,
      });
    } catch (error) {
      toast({
        title: "Password incorrect",
        description: "Forgot password? reset in the log in page",
        status: "error",
        isClosable: true,
      });

      return;
    }

    //paystack withdrawal
    transferRecipient();
  }

  //actual transfer with paystack
  async function transferRecipient() {
    try {
      //get recipient code
      const res = await axios.post(
        `https://api.paystack.co/transferrecipient`,
        {
          type: "nuban",
          name: accountName,
          account_number: accountNo,
          bank_code: bankCode,
          currency: "NGN",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.SECRET_KEY_TEST}`,
          },
        }
      );

      //initiate transfer
      const transfer = await axios.post(
        `https://api.paystack.co/transfer`,
        {
          source: "balance",
          amount,
          recipient: res.data.data.recipient_code,
          reason: `${User.business_name} withdrawal on Tadlace`,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.SECRET_KEY_TEST}`,
          },
        }
      );
      console.log(transfer);

      //recieves transfer code and recipient code
      recordWithdrawal(
        transfer.data.data.transfer_code,
        res.data.data.recipient_code
      );
    } catch (err) {
      // console.log(err.message);

      toast({
        title: "An error occured while carrying out this withdrawal",
        description: "Please retry",
      });
    }
  }

  //record withdrawal in database
  async function recordWithdrawal(transfer_code, recipient_code) {
    const { data, error } = await useMutation(
      withdrawalMutation,
      {
        user_id: User.id,
        amount: Number(amount),
        transfer_id: transfer_code,
        recipient: recipient_code,
      },
      Token
    );
    if (data) {
      setLoading(false);

      toast({
        title: data.withdraw.message,
        status: "success",
        isClosable: true,
      });
      mutate(`getVendorOrders`);

      setAmount("");
      setPassword("");
    }

    if (error) {
      setLoading(false);
      let errorgql = error?.response?.errors[0].message;
      console.log(errorgql);

      await useMutation(
        withdrawalMutation,
        {
          user_id: User.id,
          amount: Number(amount),
          transfer_id: transfer_code,
          recipient: recipient_code,
        },
        Token
      );
    }
  }

  return (
    <section className="withdraw">
      <h1>Withdraw</h1>
      <div style={{ textAlign: "center", fontWeight: "bold" }}>
        {accountName && <span>Reciever: {accountName}</span>}
      </div>
      {!accountName && (
        <form onSubmit={confirmReciever}>
          <div>
            <FormLabel htmlFor="Account">Account No.</FormLabel>
            <InputGroup>
              <Input
                variant="flushed"
                autoComplete="off"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="Account"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                placeholder="Enter Account No"
              />
            </InputGroup>
          </div>

          <div className="form-item">
            <FormLabel htmlFor="Banks">Select Your Bank</FormLabel>
            <Select
              variant="flushed"
              onChange={(e) => {
                let c = e.target.value.split(",");
                setBankCode(c[1]);
              }}
            >
              <option defaultValue="">--select--</option>
              {banks.map((b, i) => (
                <option key={i} value={[b.name, b.code]}>
                  {b.name}
                </option>
              ))}
            </Select>
          </div>
          <div style={{ textAlign: "center", marginTop: "5px" }}>
            <Button
              isDisabled={!accountNo || !bankCode ? true : false}
              variantColor="blue"
              borderRadius="12px"
              type="submit"
              isLoading={loading}
            >
              Confirm Reciever
            </Button>
          </div>
        </form>
      )}

      {accountName && (
        <form onSubmit={handleWithdrawal} autoComplete="new-password">
          <div>
            <label htmlFor="Amount">Amount</label>
            <InputGroup>
              <Input
                variant="flushed"
                autoComplete="off"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="Amount"
                maxLength={6}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to withdraw"
              />
            </InputGroup>
          </div>

          <div>
            <FormLabel htmlFor="Password">Password</FormLabel>
            <InputGroup>
              <Input
                variant="flushed"
                autoComplete="new-password"
                type={show ? "text" : "password"}
                id="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>
          <div style={{ textAlign: "center" }}>
            <Button
              type="submit"
              mt="5px"
              isDisabled={!password || !amount ? true : false}
              size="sm"
              borderRadius="12px"
              variantColor="blue"
              isLoading={loading}
            >
              Confirm Withdrawal
            </Button>
          </div>
        </form>
      )}
      <style jsx>{`
        .withdraw {
          margin: 20px 0;
        }

        .withdraw h1 {
          font-weight: bold;
          text-align: center;
          margin: 10px 0;
        }

        form div {
          margin-top: 5px;
          color: #2a69ac;
        }

        @media only screen and (min-width: 1200px) {
          .withdraw h1 {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </section>
  );
};
