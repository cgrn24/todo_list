import axios from 'axios'

export const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  withCredentials: true,
  headers: {
    'API-KEY': '6db0aff4-bda8-4df9-8071-4eea2acfbc33',
  },
})
