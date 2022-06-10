import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
    const [ email, setEmail ] = useState()
    const [ password, setPassword ] = useState()
    const [ show, setShow ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const toast = useToast()
    const history = useHistory()

    const handleCLick = () => {
        setShow(!show)
    }

    const submitHandler = async () => {
        setLoading(true)
        if (!email || !password) {
            toast({
                title: 'Please fill all the Feilds!',
                status: 'warning',
                duration: '5000',
                isClosable: true,
                position: "bottom-right"
            })
            setLoading(false)
            return
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post("/api/user/login", { email, password }, config);
            console.log('>>> check data: ', data)
            toast({
                title: 'Login Success!',
                status: 'success',
                duration: '5000',
                isClosable: true,
                position: "bottom-right"
            })
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false)
            history.push('./chats')
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.respone.data.message,
                status: 'error',
                duration: '5000',
                isClosable: true,
                position: "bottom-right"
            })
            setLoading(false)
        }
    }

    return (
        <VStack spacing='5px' color='black'>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input 
                    value={email}
                    placeholder='Enter your email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input 
                        type={show ? "text" : "password"}
                        value={password}
                        placeholder='Enter your password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleCLick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}                
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign up
            </Button>
            <Button
                variant="solid"
                colorScheme="red"
                width="100%"             
                onClick={() => {
                    setEmail("guest@gmail.com")
                    setPassword("123123")
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    )
}

export default Login