<template>
  <div class="flex flex-col flex-grow q-pa-md">
    <div>
      <div class="flex items-center justify-between">
        <h1 class="text-h4 font-bold">Welcome to Pratham POS System Customer Display!</h1>
      </div>
      <div class="text-lg mt-6">Getting Started: A Smooth Experience Awaits!</div>
      <p class="mt-3">
        Enter IPV4 address of POS system.
      </p>

      <p><strong>Why These IDs Matter:</strong></p>
      <p>
        <span>This IP address is required to connect your customer display to the POS system.</span><span> Having this correctly configured will streamline customer display and POS system communication.</span>
      </p>
      <p>
        <strong>Once you've entered these details, you'll be ready to experience smooth customer display operations!</strong>
      </p>
      <p class="mt-6 text-lg font-semibold">Additional Notes:</p>

      <ul class="mb-6 ml-6 list-decimal space-y-2">
        <li>
          <span>If you're unsure about IPV4 address,</span><span>
            please refer to your restaurant management documentation or contact your system administrator for
            assistance.</span>
        </li>
        <li>
          <span>Once configured,</span><span>
            these IP adresses typically won't need to be changed unless you're switching locations or managing multiple
            restaurants.</span>
        </li>
      </ul>
      <p>
        <strong>Let's get started and make your restaurant operations a breeze!</strong>
      </p>
      <q-separator class="my-10" />
      <div class="flex items-center justify-center">
        <div class="text-center">
          <q-input
            v-model="ipAddress"
            label="Enter IPv4 Address"
            hint="Format: xxx.xxx.xxx.xxx"
            style="max-width: 350px; min-width: 350px;"
            :rules="[validateIPv4]"
            clearable
            outlined
          >
            <template v-slot:append>
              <q-icon name="fa-solid fa-network-wired" />
            </template>
          </q-input>
          <q-btn
            label="Submit"
            color="primary"
            class="mt-4"
            @click="onSubmit()"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { connectSocket } from '../boot/local-socket';
import { useRouter } from 'vue-router';

const router = useRouter()

// IPv4 validation regular expression
const ipAddress = ref('')
const ipv4Regex =
  /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/

// IPv4 validation rule function
const validateIPv4 = (val: string) => {
  return ipv4Regex.test(val) || 'Invalid IPv4 address'
}

const onSubmit = () => {
  localStorage.setItem('localSocketServerIp', ipAddress.value)
  connectSocket(ipAddress.value, router)
}
</script>

<style scoped>
</style>
