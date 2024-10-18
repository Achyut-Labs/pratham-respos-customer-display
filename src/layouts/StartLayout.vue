<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page :style-fn="myTweak">
        <div
          class="flex items-center justify-between h-full q-mx-auto"
          style="width: 100%"
        >
          <div
            class="md:!flex flex-col items-center bg-blue-50 h-full hidden md:w-1/2"
          >
            <div class="">
              <img alt="" class="w-60" src="../assets/pratham_logo.png" />
            </div>

            <div class="text-h5 font-bold -mt-20">
              <span class="text-blue">Simplify</span>
              <span> Operation</span>,
              <span class="text-orange"> Amplify</span> profit,
            </div>
            <div class="text-h5 font-bold mb-10">
              <span class="text-purple font-italic">Dignify</span>
              <span> Brand, Start to</span>
              <span class="text-green"> Rectify </span> Now
            </div>
            <img alt="" class="q-" src="../assets/pratham_pos.png" />
          </div>

          <div
            class="flex pb-6 justify-center bg-white h-full overflow-y-auto w-full md:w-1/2"
          >
            <router-view />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
defineOptions({
  name: 'StartLayout',
});

const myTweak = (offset: number) => {
  return { height: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
</script>
