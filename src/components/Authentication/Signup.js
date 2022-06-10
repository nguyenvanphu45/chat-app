import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } 
    from '@chakra-ui/react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

const Signup = () => {
    const [ name, setName ] = useState()
    const [ email, setEmail ] = useState()
    const [ password, setPassword ] = useState()
    const [ confirmpassword, setConfirmpassword ] = useState()
    const [ pic, setPic ] = useState()
    const [ show, setShow ] = useState(false)
    const [picLoading, setPicLoading] = useState(false);

    const toast = useToast()
    const history = useHistory()

    const handleCLick = () => {
        setShow(!show)
    }

    const postDetails = (pics) => {
        setPicLoading(true)
        if (pics === undefined) {
            toast({
                title: 'Please select an image!',
                status: 'warning',
                duration: '5000',
                isClosable: true,
                position: "bottom-right"
            })
            return;
        }

        if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
            const data = new FormData()
            data.append("file", pics)
            data.append("upload_preset", "chat-app")
            data.append("cloud_name", "dpdnjyrj2")
            fetch("https://api.cloudinary.com/v1_1/dpdnjyrj2/image/upload", {
                method: 'post', body:data
            }).then((res) => res.json())
            .then(data => {
                setPic(data.url.toString())
                setPicLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setPicLoading(false)
            })
        } else {
            toast({
                title: 'Please select an image!',
                status: 'warning',
                duration: '5000',
                isClosable: true,
                position: "bottom-right"
            })
            setPicLoading(false)
            return
        }
    }

    const submitHandler = async () => {
        setPicLoading(true)
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: 'Please fill all the Feilds!',
                status: 'warning',
                duration: '5000',
                isClosable: true,
                position: "bottom-right"
            })
            setPicLoading(false);
            return; 
        }

        if (password !== confirmpassword) {
            toast({
                title: "Passwords Do Not Match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            const config = {
                headers: {
                "Content-type": "application/json",
                },
            };

            const { data } = await axios.post("/api/user", {name, email, password, pic}, config);

            console.log('>>> check data: ', data)

            toast({
                title: 'Registration Successful!',
                status: 'success',
                duration: '5000',
                isClosable: true,
                position: "bottom-right"
            })
            localStorage.setItem("userInfo", JSON.stringify(data))
            setPicLoading(false);
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
            setPicLoading(false);
        }
    }

    return (
        <VStack spacing='5px' color='black'>
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input 
                    placeholder='Enter your name'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input 
                    placeholder='Enter your email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input 
                        type={show ? "text" : "password"}
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
            <FormControl id='password' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input 
                        type={show ? "text" : "password"}
                        placeholder='Confirm password'
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleCLick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='pic'>
                <FormLabel>Upload your picture</FormLabel>
                <Input 
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>

            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}                
                onClick={submitHandler}
                isLoading={picLoading}
            >
                Sign up
            </Button>
        </VStack>
    )
}

export default Signup