import { io, Socket } from 'socket.io-client';
import { boot } from 'quasar/wrappers';
import { OrderCart } from 'src/types/cart';
import { Router } from 'vue-router';
import { ICustomerDisplaySettings } from 'src/stores/media-settings-store';

let socket: Socket | null = null;

export const connectSocket = (ip: string, port: number, router: Router) => {
  const socketUrl = `http://${ip}:${port}`;

  socket = io(socketUrl);

  socket.on('connect', () => {
    console.log('Connected to the local socket');
    router.push('/'); // Navigate to the main page on successful connection
  });

  socket.on('connect_error', (error) => {
    console.error('Local Socket Connection error:', error.message);
    // Handle the error, potentially redirect to IP input page
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from the local socket');
  });

  // Listen for the 'update-cart' event
  socket.on('update-cart', (data: OrderCart) => {
    console.log('Received cart update:', data);
    onCartUpdateCallback?.(data);
  });

  //Listen for the  'customer-display-settings' event
  socket.on('customer-display-settings', (data: ICustomerDisplaySettings) => {
    console.log('Received cart update:', data);
    onMediaSettingsUpdateCallback?.(data);
  });

  // Listen for the 'connection' event
  socket.on('connection', (data) => {
    console.log('Connection event:', data);
  });

  // Disconnect the client upon page unload
  window.addEventListener('beforeunload', () => {
    socket?.disconnect();
  });
};

// Callback function to handle 'update-cart'
let onCartUpdateCallback: ((data: OrderCart) => void) | null = null;

// Callback function to handle 'customer-display-settings'
let onMediaSettingsUpdateCallback:
  | ((data: ICustomerDisplaySettings) => void)
  | null = null;

export const onCartUpdate = (fn: (data: OrderCart) => void) => {
  if (typeof fn !== 'function') {
    throw new Error('`fn` is not a function');
  }
  onCartUpdateCallback = fn;
};

export const onMediaSettingsUpdate = (
  fn: (data: ICustomerDisplaySettings) => void
) => {
  if (typeof fn !== 'function') {
    throw new Error('`fn` is not a function');
  }
  onMediaSettingsUpdateCallback = fn;
};
// Boot function to ensure socket connects based on stored IP
export default boot(({ router }) => {
  const storedIp = localStorage.getItem('localSocketServerIp');
  const storedPortNumber = Number(
    localStorage.getItem('localSocketServerPort')
  );

  if (storedIp) {
    connectSocket(storedIp, storedPortNumber, router);
  } else {
    router.push('/start'); // Redirect to IP input page if no IP is found
  }
});
