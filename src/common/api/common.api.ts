import axios from 'axios'

export const instance = axios.create({
	baseURL: 'https://social-network.samuraijs.com/api/1.1/',
	withCredentials: true,
	headers: {
		'API-KEY': 'eae61b52-cf72-48ff-83da-e6901c6599cc'
	}
})




