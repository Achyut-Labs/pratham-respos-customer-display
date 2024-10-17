<template>
  <div class="image-container pa-none">
    <div>
      <q-btn
        class="absolute left-0 top-0"
        @click="toggleFullScreen"
        unelevated
        no-caps
        size="sm"
        color="primary"
        label="Toggle fullscreen "
      ></q-btn>
    </div>
    <q-carousel
      animated
      v-model="slide"
      infinite
      height="100%"
      transition-next="slide-left"
      transition-prev="slide-right"
      transition-duration="2000"
    >
      <q-carousel-slide
        v-for="(file, ind) in mediaSettingsStore.files"
        :name="ind + 1"
        :key="ind"
      >
        <q-img
          v-if="file.file_type === 'image'"
          :src="file.file_path"
          class="media-content"
        />
        <video v-else controls muted autoplay class="media-content video-fit">
          <source :src="file.file_path" :type="getVideoType(file.file_path)" />
          Your browser does not support the video tag.
        </video>
        <!-- <q-video
          v-else
          ref="video"
          class="media-content video-fit"
          :src="file.file_path"
          autoplay
          loop
        /> -->
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch } from 'vue';
import { useMediaSettingsStore } from '../stores/media-settings-store';
import { storeToRefs } from 'pinia';

const mediaSettingsStore = useMediaSettingsStore();

const { displaySettings } = storeToRefs(mediaSettingsStore);

const slide = ref<number>(1);

const slideInterval = ref<ReturnType<typeof setInterval> | null>(null); // Correct type for setInterval

const getVideoType = (src: string): string => {
  const extension = src.split('.').pop()?.toLowerCase() || 'unknown';

  switch (extension) {
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'ogg':
      return 'video/ogg';
    case 'avi':
      return 'video/x-msvideo';
    case 'mov':
      return 'video/quicktime';
    default:
      return 'unknown';
  }
};

const startAutoplay = () => {
  slideInterval.value = setInterval(() => {
    if (mediaSettingsStore.files && mediaSettingsStore.files.length > 0)
      slide.value = (slide.value % mediaSettingsStore.files.length) + 1; // Cycle through slides
  }, displaySettings.value.slideTransitionInterval * 1000);
};

// Clear interval when component is destroyed
const stopAutoplay = () => {
  if (slideInterval.value) {
    clearInterval(slideInterval.value as ReturnType<typeof setInterval>);
  }
};
onMounted(() => {
  startAutoplay();
});
onUnmounted(() => {
  stopAutoplay();
});

watch(
  () => displaySettings.value.slideTransitionInterval,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      stopAutoplay(); // Clear the previous interval
      startAutoplay(); // Start a new interval with the updated value
    }
  }
);

const toggleFullScreen = () => {
  window.electronAPI.ipcRenderer.send('toggle-fullscreen');
};
</script>

<style scoped>
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw; /* Full width of the viewport */
  overflow: hidden;
}

.q-carousel {
  width: 100%; /* Ensure the carousel takes full width */
  height: 100%; /* Ensure the carousel takes full height */
}

.q-carousel-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.q-carousel__slide {
  padding: 0px;
}

.media-content {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Adjust based on your preference (cover, contain) */
}

.video-fit {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Use 'cover' to fill the container */
}
</style>
