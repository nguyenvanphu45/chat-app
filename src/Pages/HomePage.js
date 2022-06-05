import React, { useEffect } from 'react'
import {Box, Container, Tabs, TabList, TabPanel, TabPanels, Text, Tab} from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useHistory } from 'react-router'

const HomePage = () => {
    const history = useHistory();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));

        if (user) {
            history.push("/")
        };
    }, [history]);
 
    return (
        <Container maxW="xl" centerContent>
        <Box
            d="flex"
            justifyContent="center"
            p={3}
            bg="white"
            w="100%"
            m="40px 0 15px 0"
            borderRadius="lg"
            borderWidth="1px"
        >
            <Text fontSize="4xl" fontFamily="Work sans" color="blue" fontWeight="600" textAlign="center">
                Zalo
            </Text> 
        </Box>
        <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
            <Tabs isFitted variant="soft-rounded">
            <TabList mb="1em">
                <Tab>Login</Tab>
                <Tab>Sign Up</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Login />
                </TabPanel>
                <TabPanel>
                    <Signup />
                </TabPanel>
            </TabPanels>
            </Tabs>
        </Box>
        </Container>
    )
}

export default HomePage