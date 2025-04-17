import API from './client'

export const kakaoLogin = async ({ accessToken, profileImg }) => {
    const res = await API.post('/login', { accessToken, profileImg })
    return res.data
}
