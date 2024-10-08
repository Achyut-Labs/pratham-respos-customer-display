<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <div class="flex" style="height: 100vh; width: 100vw">
        <div class="flex items-center justify-between h-full q-mx-auto" style="width: 100%">
          <div class="md:!flex flex-col items-center bg-blue-1 h-full hidden md:w-1/2">
            <div class="">
              <img alt="" class="q-mt-" src="../assets/pratham_logo.png" style="width: 300px" />
            </div>

            <div class="text-h5 font-bold -mt-20">
              <span class="text-blue">Simplify</span>
              <span> Operation</span>, <span class="text-orange"> Amplify</span> profit,
            </div>
            <div class="text-h5 font-bold mb-10">
              <span class="text-purple font-italic">Dignify</span>
              <span> Brand, Start to</span> <span class="text-green"> Rectify </span> Now
            </div>
            <img alt="" class="q-" src="../assets/pratham_pos.png" style="width: 600px" />
          </div>

          <div class="flex py-6 justify-center bg-white h-full w-full md:w-1/2">
            <router-view />
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
defineOptions({
  name: 'StartLayout'
})
</script>
