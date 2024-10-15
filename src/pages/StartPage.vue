<template>
  <div class="flex flex-col flex-grow q-pa-md">
    <div>
      <div class="flex items-center justify-between">
        <h1 class="text-h4 font-bold">
          Welcome to Pratham POS System Customer Display!
        </h1>
      </div>
      <div class="text-lg mt-6">
        Getting Started: A Smooth Experience Awaits!
      </div>
      <p class="mt-3">Enter IPV4 address and Port number of POS system.</p>

      <p><strong>Why This Information Matter:</strong></p>
      <p>
        <span
          >This IP address and Port number is required to connect your customer
          display to the POS system.</span
        ><span>
          Having this correctly configured will streamline customer display and
          POS system communication.</span
        >
      </p>
      <p>
        <strong
          >Once you've entered these details, you'll be ready to experience
          smooth customer display operations!</strong
        >
      </p>
      <p class="mt-6 text-lg font-semibold">Additional Notes:</p>

      <ul class="mb-6 ml-6 list-decimal space-y-2">
        <li>
          <span>If you're unsure about IPV4 address and Port number,</span
          ><span>
            please refer to your restaurant management documentation or contact
            your system administrator for assistance.</span
          >
        </li>
        <li>
          <span>Once configured,</span
          ><span>
            this information typically won't need to be changed unless you're
            switching locations or managing multiple restaurants.</span
          >
        </li>
      </ul>
      <p>
        <strong
          >Let's get started and make your restaurant operations a
          breeze!</strong
        >
      </p>
      <q-separator class="my-10" />
      <div class="text-center">
        <div class="flex items-center justify-center text-center">
          <q-input
            v-model="settingStore.socketConfig.ip"
            label="Enter IPv4 Address"
            hint="Format: xxx.xxx.xxx.xxx"
            style="max-width: 350px"
            :rules="[validateIPv4]"
            class="mr-1"
            outlined
          />
          <q-input
            v-model.number="settingStore.socketConfig.port"
            label="Enter Port Number"
            style="max-width: 350px"
            :rules="[(val:number) => isValidPort(val) || 'Invalid port number']"
            class="ml-1"
            outlined
          />
        </div>
        <q-btn
          label="Submit"
          color="primary"
          class="mt-4"
          @click="onSubmit()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMediaSettingsStore } from 'src/stores/media-settings-store';
import { useSocket } from './useSocket';

const settingStore = useMediaSettingsStore();

const { connectSocket } = useSocket();

const ipv4Regex =
  /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;

// IPv4 validation rule function
const validateIPv4 = (val: string) => {
  return ipv4Regex.test(val) || 'Invalid IPv4 address';
};

const isValidPort = (port: number) => {
  return Number.isInteger(port) && port > 0 && port <= 65535;
};

const onSubmit = () => {
  connectSocket();
};
</script>
