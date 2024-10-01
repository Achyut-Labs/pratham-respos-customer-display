import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, isAxiosError } from 'axios'
import notifications from './notifications'

const notifyOffHeaders = {
  headers: { notify: false }
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json'
  }
})

interface ErrorWithMessage {
  message: string
}

interface ErrorWithData {
  data: {
    message: string
  }
}

interface ErrorWithString {
  error: string
}

type APIError = ErrorWithMessage | ErrorWithMessage[] | ErrorWithData | ErrorWithString

export const getErrorMessage = (res: APIError) => {
  if (Array.isArray(res) && res.length > 0) {
    return res[0]?.message
  }

  if ('data' in res) return res.data.message

  if ('message' in res) return res.message

  if ('error' in res) return res.error
}

const handleRequest = (config: InternalAxiosRequestConfig) => {
  // const endpoint = (config.url as string).replace(config.baseURL as string, '')

  // if (accessToken && endpoint !== 'logout' && endpoint !== 'login') {
  //   config.headers.Authorization = `Bearer ${accessToken}`
  // }

  return config
}

const handleResponseSuccess = (res: AxiosResponse) => res.data

export const handleResponseError = (error: unknown) => {
  if (isAxiosError(error)) {
    const shouldNotNotify = error?.config?.headers?.notify === false

    if (error.code === 'ERR_NETWORK') {
      console.warn('You are offline', error)
      if (!shouldNotNotify) {
        // debugger;
        notifications.failureNotify('You are not connected to internet!')
      }
      return Promise.reject(error)
    }

    const resData = error?.response?.data

    let errorMessage = getErrorMessage(resData)

    const UNAUTHORIZED = 401

    // If errorMessage is not available in response than a default message for notify
    if (!errorMessage) {
      errorMessage =
        error?.response?.status === UNAUTHORIZED
          ? "You don't have access/permission for this!"
          : 'This is internal issue please try after sometime!'
    }

    if (!shouldNotNotify) {
      notifications.failureNotify(errorMessage || 'This is internal issue please try after sometime!')
    }

    console.error('error in api call', error)
  }

  return Promise.reject(error)
}

// api interceptors
api.interceptors.request.use(handleRequest, error => Promise.reject(error))

api.interceptors.response.use(handleResponseSuccess, handleResponseError)

export { api, axios, notifyOffHeaders }
