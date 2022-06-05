import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, 
    Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, Tooltip, useToast } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useDisclosure } from '@chakra-ui/hooks'
import React, { useState } from 'react'
import ProfileModal from './ProfileModal'
import { ChatState } from '../../Context/ChatProvider'
import { useHistory } from 'react-router-dom'
import { getSearch, handleChat } from '../../services/userServices'
import ChatLoading from '../ChatLoading'
import UserListItem from '../userAvatar/UserListItem'

const SideDrawer = () => {
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    const { user, setSelectedChat, chats, setChats } = ChatState()
    const history = useHistory()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const logoutHandler = () => {
        localStorage.removeItem("userInfor")
        history.push('/')
    }

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please Enter something in search!',
                status: 'warning',
                duration: '5000',
                isClosable: true,
                position: "bottom-right"
            })
            return
        }

        try {
            setLoading(true)

            let data = await getSearch(search)
            setLoading(false)
            setSearchResult(data.data)
            return
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: 'Failed to load the Search Results',
                status: 'error',
                duration: '5000',
                isClosable: true,
                position: "bottom-right"
            })
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoading(true)
    
            let { data } = await handleChat(userId)
            if(!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats])
            }
            
            setSelectedChat(data)
            setLoadingChat(false)
            onClose()
        } catch (error) {
            toast({
                title: 'Error fetching the chat!',
                description: error.message,
                status: 'error',
                duration: '5000',
                isClosable: true,
                position: "bottom-right"
            })
        }
    } 

    return (
        <>
            <Box
                display="flex"
                justifyContent='space-between'
                alignItems='center'
                bg='white'
                w='100%'
                p='5px 10px'
                borderWidth='5px'
            >
                <Tooltip label='Search Users to chat' hasArrow placement='bottom-end'>
                    <Button variant='ghost' onClick={onOpen}>
                        <i className='fas fa-search'></i>
                        <Text d={{ base: "none", md: "flex" }} px='4'>
                            Search user
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize='2xl' fontFamily='Work sans'>
                    Zalo
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size='sm' cursor='pointer' />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuItem onClick={logoutHandler}>
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderWidth='1px'>Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display='flex' pb={2}>
                            <Input 
                                placeholder='Search by name or email'
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>
                                Go
                            </Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                            ) : (
                                searchResult?.map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => accessChat(user._id)}
                                    />
                                ))
                            )
                        }
                        {loadingChat && <Spinner ml='auto' display='flex' />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer