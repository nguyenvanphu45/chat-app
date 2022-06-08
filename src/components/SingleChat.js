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

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState("")

    const { user, selectedChat, setSelectedChat } = ChatState()
    const toast = useToast()

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

    useEffect(() => {
        fetchMessages()
    }, [selectedChat])

    const sendMessage = async (event) => {
        if(event.key === "Enter" && newMessage) {
            try {
                let { data } = await axios.post('/api/message', {
                    content: newMessage,
                    chatId: selectedChat._id
                })

                console.log(data)
                setNewMessage("")
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