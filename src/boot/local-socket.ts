// import { env } from 'process'
import { io } from 'socket.io-client'
import { OrderCart } from 'src/types/cart'

const socketUrl = 'http://' + process.env.LOCAL_SOCKET_SERVER_IP  + ':3000'
// const socket = io('http//localhost:6000')
// const socket = io(socketUrl, {
//   transports: ['websocket']
// })
// Listen for the 'connection' event
// const socketUrl = 'http://localhost:3000'
const socket = io(socketUrl)
socket.on('connect', () => {
  console.log('Connected to the local socket')
})

// Handle any errors
socket.on('connect_error', error => {
  console.error('Local Soacket Connection error:', error.message)
})

// Handle disconnection
socket.on('disconnect', () => {
  console.log('Disconnected from the local socket')
})

// Define the event handler for the 'connection' event
socket.on('connection', data => {
  console.log('connection:', data)
})

/**
 * this funciton will listen's for online orders
 * @param fn - callback function when new online order is received
 */
export const onCartUpdate = (fn: (data: OrderCart, ...args: unknown[]) => void) => {
  if (typeof fn !== 'function') {
    throw new Error('`fn` is not a function')
  }
  socket.on('update-cart', fn)
}
// Disconnect the client upon page unload
window.addEventListener('beforeunload', () => {
  socket.disconnect()
})

// Connect to the Socket.IO server
socket.connect()
export default socket
