import axios from 'axios'

const handleRegister = (name, email, password) => {
    return axios.post('/api/user/register', {name: name, email: email, password: password})
}

const handleLogin = (email, password) => {
    return axios.post('/api/user/login', {email: email, password: password})
}

const getSearch = (search) => {
    return axios.get(`/api/user?search=${search}`)
}

const handleChat = (userId) => {
    return axios.post('/api/chat', {userId: userId})
}

const getChat = () => {
    return axios.get(`/api/chat`)
}

export {
    handleRegister, handleLogin, getSearch, handleChat, getChat
}