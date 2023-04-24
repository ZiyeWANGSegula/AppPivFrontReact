import axios from 'axios'
import { accountService } from './account.service'
import { HOST_API_KEY } from '../config-global'
// Paramétrage de base d'axios
const Axios = axios.create({
    baseURL: HOST_API_KEY
})

// Interceptor for the token in the header


Axios.interceptors.request.use(
    request => {
        if (accountService.isLogged()) {
            request.headers.Authorization = `Bearer ${accountService.getToken()}`
        }
        return request
    })

export default Axios