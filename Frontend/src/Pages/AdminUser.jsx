import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormLabel,
  Input,
  Stack,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AdminHeader } from "../Components/AdminHeader";
import { useDispatch, useSelector } from "react-redux";
import { ErrorCom } from "../Components/ErrorCom";
import { LoadingCom } from "../Components/LoadingCom";
import { DataCard } from "../Components/DataCard";
import { addUers, getAllUsers } from "../Redux/adminReducer/action";
import { ArrowUp } from "lucide-react";
import { BottomUpButton } from "../Components/BottomUpButton";


const init =
  {
    "username" : "",
    "email" : "",
    "password": ""
  }

export function AdminUser() {
  const dipatch = useDispatch();

  const { users, isError, isLoading } = useSelector(
    (store) => store.AdminReducer
  );

  const [userData, setUserData] = useState(init);

  const [edited, setEdited] = useState("");
  const [temp, setTemp] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState("0");
  const [currpage, setCurrpage] = useState(1);

  const handleBtns = (e) => {
    setCurrpage(+e.target.id);
  };

  useEffect(() => {
    dipatch(getAllUsers());
  }, []);
  useEffect(() => {
    let total = [];
    let pageEnd = currpage * 10;
    let pageStart = pageEnd - 10;
    for (let i = pageStart; i < pageEnd; i++) {
      if (users[i]) {
        total.push(users[i]);
      }
    }
   
    setData(total);
  }, [users, currpage]);

  useEffect(() => {
    if (users.length > 0) {
      const total = Math.ceil(users.length / 10);
      const arr = [];
      for (let i = 1; i <= total; i++) {
        arr.push(i);
      }
      setTotalPage(arr);
    }
  }, [users]);

  const handleResult = (value) => {
    // setTemp(temp + 1);
    setEdited(value);
    setTimeout(() => {
      setEdited("");
    }, 4000);
  };


  const handleAdd = ()=>{
    onOpen();
  }

  const handleUser = ()=>{
      dipatch(addUers(userData, handleResult))
    
     setTimeout(()=>{
      onClose();
     }, 1000);
     setUserData(init);
  }
  return (
    <>
      <AdminHeader />
      <Box
        bg={"brand.600"}
        borderRadius={"1rem"}
        p={"3rem"}
        w={"95%"}
        margin={"auto"}
        mt={"-5rem"}
        className="animate__animated animate__slideInUp"
      >
        {!isError && !isLoading && data.length > 0 && (
          <Flex mb={"4rem "} gap={"1rem"}>
            <BottomUpButton handleAdd={handleAdd} />
            <Input placeholder="Search User..." w={"fit-content"} />
            {/* <h1>sorting....</h1> */}
          </Flex>
        )}
        <Box>
          {isLoading && !isError && <LoadingCom />}
          {isError && !isLoading && <ErrorCom isError={isError} />}
          {edited && (
            <Alert m={"2rem 0"} status="success" variant="top-accent">
              <AlertIcon />
              Data {edited} Successfully!
            </Alert>
          )}
           
          {!isError && !isLoading && data.length > 0 && (
            <>
              <Table>
                <Thead bg={"brand.200"}>
                  <Tr>
                    <Th color={"brand.300"}>
                      {/* <Flex alignItems={"center"} gap=".5rem"> */}
                      <Text>UserName</Text>
                      {/* <ArrowUp size={20} strokeWidth={1.5} /> */}
                      {/* </Flex> */}
                    </Th>
                    <Th color={"brand.300"} pl={"4rem"}>
                      <Text>Email</Text>
                    </Th>
                    <Th color={"brand.300"}></Th>
                    <Th color={"brand.300"}>Edit</Th>
                    <Th color={"brand.300"}>Delete</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((user, index) => {
                    return (
                      <DataCard
                        key={index}
                        zero={user._id}
                        first={user.username}
                        second={user.email}
                        defineParent={"users"}
                        handleResult={handleResult}
                        
                      />
                    );
                  })}
                </Tbody>
              </Table>
              <Flex gap={"1rem"} mt={"4rem"} justifyContent={"center"}>
                {/* <Button
                  variant={"SimpleOrange"}
                  data-id={"prev"}
                  onClick={handleBtns}
                >
                  Prev
                </Button> */}
                {totalPage.length > 0 &&
                  totalPage.map((item, index) => (
                    <Button
                      key={index}
                      variant={"SimpleOrange"}
                      id={item}
                      onClick={handleBtns}
                    >
                      {item}
                    </Button>
                  ))}
                {/* <Button
                  variant={"SimpleOrange"}
                  data-id={"next"}
                  onClick={handleBtns}
                >
                  Next
                </Button> */}
              </Flex>
            </>
          )}
        </Box>
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
    
                   
          <DrawerContent bgColor={"brand.600"}>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Add New User</DrawerHeader>

            <DrawerBody>
              <Stack spacing="24px">
                <Box>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <Input
                    type="text"
                    id="username"
                    placeholder="Please enter username"
                    name="username"
                    value={userData.username}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </Box>

                <Box>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Please enter email"
                    name="email"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </Box>

                <Box>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Please enter password"
                    name="password"
                    value={userData.password}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </Box>
              </Stack>
            </DrawerBody>

            <DrawerFooter borderTopWidth="1px">
              <Button variant="SimpleWhite" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleUser} variant={"SimpleOrange"}>
                Submit
              </Button>
            </DrawerFooter>
          </DrawerContent>
   
      </Drawer>
      </Box>
    </>
  );
}
