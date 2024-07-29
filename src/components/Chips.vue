<template>
  <div class="tab">
    <h3 class="bigMarginTop">⛺ COMING SOON ⛺</h3>
  </div>
  <!-- <div>
    <p v-if="connected">Connected to CHIPS Websocket</p>
    <button v-if="!connected" @click="connect()">Connect to CHIPS Websocket</button>
    <p v-if="state">{{ state }}</p>
  </div> -->
</template>

<script setup>
import { ref } from 'vue';
import Client from '@chipsgg/openservice-ws-client';

const connected = ref(false);
const state = ref({});
const channels = [
    'games',
    'public',
    'private',
    'auth',
    'affiliates',
    'stats',
    'profitshare',
    'community',
];

const config = {
  host: 'wss://api.chips.gg/prod/socket',
  channels,
  keepAlive: 1000,
};

// const socket = new WebSocket(config.host);

// socket.onopen = () => {
//   console.log('WebSocket connection opened');
//   connected.value = true;
// };

// socket.onmessage = (event) => {
//   console.log('WebSocket message received:', event.data);
//   state.value = JSON.parse(event.data);
// };

// socket.onclose = () => {
//   console.log('WebSocket connection closed');
//   connected.value = false;
// };

// console.log(socket);

// const { actions } = await Client(
//   new WebSocket(config.host),
//   config,
//   async (type, newState) => {
//     switch (type) {
//       case 'change': {
//         state = {
//           ...state,
//           ...newState,
//         };
//         emit('change', state);
//         break;
//       }
//       case 'open': {
//         console.log('Server Connected!');
//         break;
//       }
//       case 'close': {
//         console.log('Server Disconnected!');
//         break;
//       }
//       case 'reconnect': {
//         console.log('Server Reconnected!');
//         // updateState("setConnected", true);
//         // await Authenticate(actions, CHIPS_TOKEN).then((result) => {
//         //   console.log('authenticated', result);
//         // });
//         break;
//       }
//     }
//   }
// );
</script>