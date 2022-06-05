import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, IconButton, Text } from '@chakra-ui/react'
import React from 'react'
import { getSender, getSenderFull } from '../config/ChatLogics'
import { ChatState } from '../Context/ChatProvider'
import ProfileModal from './miscellaneous/ProfileModal'

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat } = ChatState()

    console.log('>>> check: ', selectedChat)

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
                                {/* <UpdateGroupChatModal 
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                /> */}
                            </>
                        )}
                    </Text>
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