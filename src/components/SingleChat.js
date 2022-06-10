import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getSender, getSenderFull } from '../config/ChatLogics'
import { ChatState } from '../Context/ChatProvider'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import ScrollableChat from './ScrollableChat'
import './styles.css'
import Lottie from 'react-lottie'
import animationData from '../animation/typing.json'

import io from 'socket.io-client'
const ENDPOINT = io.connect('locahost:5000') 
let socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState("")
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()
    const toast = useToast()

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        },
    };

    const fetchMessages = async () => {
        if (!selectedChat) return

        try {
            const config = {
                headers: {
                Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true)

            let { data } = await axios.get(`api/message/${selectedChat._id}`, config)

            setMessages(data)
            setLoading(false)

            socket.emit('join chat', selectedChat._id)
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: 'Failed to Load the Message',
                status: 'error',
                duration: '5000',
                isClosable: true,
                position: "bottom-right"
            })
        }
    }

    useEffect (() => {
        socket = io(ENDPOINT)
        socket.emit("setup", user)
        socket.on('connection', () => setSocketConnected(true))
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop typing', () => setIsTyping(false))
    }, [])

    useEffect(() => {
        fetchMessages()

        selectedChatCompare = selectedChat;
    }, [selectedChat])

    useEffect(() => {
        socket.on("message received", (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved])
            }
        })
    })

    const sendMessage = async (event) => {
        if(event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id)
            try {
                const config = {
                    headers: {
                    Authorization: `Bearer ${user.token}`,
                    },
                };

                let { data } = await axios.post('/api/message', {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)

                console.log(data)
                
                socket.emit('new message', data)
                setNewMessage('')
                setMessages([...messages, data])
            } catch (error) {
                toast({
                    title: 'Error Occured!',
                    description: 'Failed to Send the Message',
                    status: 'error',
                    duration: '5000',
                    isClosable: true,
                    position: "bottom-right"
                })
            }
        }
    }

    const typingHandler = async (e) => {
        setNewMessage(e.target.value)

        if (!socketConnected) return

        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()
        var timerLength = 3000

        setTimeout(() => {
            let timeNow = new Date().getTime()
            let timeDiff = timeNow - lastTypingTime

            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id)
                setTyping(false)
            }
        }, timerLength)
    }

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px"}}
                        pb={3}
                        px={2}
                        w='100%'
                        fontFamily="Work sans"
                        display='flex'
                        justifyContent={{ base: "space-between"}}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )}
                    </Text>
                    <Box
                        display='flex'
                        flexDir='column'
                        justifyContent='flex-end'
                        p={3}
                        bg='#e8e8e8'
                        w='100%'
                        h='100%'
                        borderRadius='lg'
                        overflowY='hidden'
                    >
                        {loading ? (
                            <Spinner 
                                size='xl'
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin='auto'
                            />
                        ) : (
                            <div className='messages'>
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            {isTyping ? (
                                <div>
                                    <Lottie 
                                        options={defaultOptions}
                                        width={70}
                                        style={{ marginBottom: 15, marginLeft: 0 }}
                                    />
                                </div>
                                ) : (
                                    <></>
                                )}
                            <Input 
                                variant='filled'
                                bg='e0e0e0'
                                placeholder='Enter a message ...'
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>
                </>
            ): (
                <Box
                    display='flex' flexDir='column' alignItems='center' justifyContent='center' h='100%'
                    w='70%' textAlign='center'
                >
                    <Text fontSize="2xl" pb={3} fontFamily="Segoe UI">
                        Chào mừng đến với <b>Zalo PC!</b>
                    </Text>
                    <Text fontSize="1xl" pb={3} fontFamily="Segoe UI" >
                        Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người thân, bạn bè được tối ưu hoá cho máy tính của bạn.
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat