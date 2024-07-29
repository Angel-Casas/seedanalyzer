<template>
    <div class="liveBox">
        <div class="tabContainer">
            <div class="tabButtonsContainer">
                <button
                v-for="tab in tabs"
                :key="tab"
                :class="['tabButton', { active: currentTab === tab }]"
                @click="currentTab = tab"
                >
                    <svg v-if="tab === 'Stake'" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M252.3 11.7c-15.6-15.6-40.9-15.6-56.6 0l-184 184c-15.6 15.6-15.6 40.9 0 56.6l184 184c15.6 15.6 40.9 15.6 56.6 0l184-184c15.6-15.6 15.6-40.9 0-56.6l-184-184zM248 224c0 13.3-10.7 24-24 24s-24-10.7-24-24s10.7-24 24-24s24 10.7 24 24zM96 248c-13.3 0-24-10.7-24-24s10.7-24 24-24s24 10.7 24 24s-10.7 24-24 24zm128 80c13.3 0 24 10.7 24 24s-10.7 24-24 24s-24-10.7-24-24s10.7-24 24-24zm128-80c-13.3 0-24-10.7-24-24s10.7-24 24-24s24 10.7 24 24s-10.7 24-24 24zM224 72c13.3 0 24 10.7 24 24s-10.7 24-24 24s-24-10.7-24-24s10.7-24 24-24zm96 392c0 26.5 21.5 48 48 48H592c26.5 0 48-21.5 48-48V240c0-26.5-21.5-48-48-48H472.5c13.4 26.9 8.8 60.5-13.6 82.9L320 413.8V464zm160-88c-13.3 0-24-10.7-24-24s10.7-24 24-24s24 10.7 24 24s-10.7 24-24 24z"/></svg>
                    <svg  v-else-if="tab === 'Chips'"  class="icon" xmlns="http://www.w3.org/2000/svg" width="1600" height="1600" viewBox="0 0 1200 1200"><path d="M1196.4 498.74c-21.254-5.52-53.879 79.199-130.52 79.199-98.438 0-144.76-169.7-298.59-169.7-122.04 0-159.2 97.285-167.28 97.285-8.074 0-45.254-97.285-167.27-97.285-153.8 0-200.15 169.7-298.6 169.7-76.645 0-109.25-84.719-130.5-79.199-19.871 5.172 36.625 293.33 305.86 293.33 174.68 0 277.37-138.97 290.51-138.97 13.164 0 115.84 138.97 290.52 138.97 269.25.016 325.73-288.16 305.88-293.33z"/></svg>
                    {{ tab }}
                </button>
            </div>
            <keep-alive>
                <component
                :is="currentTab === 'Stake' ? Stake : currentTab === 'BCH.GAMES' ? BCHGAMES : Chips"
                >
                </component>
            </keep-alive>
        </div>
    </div>
</template>
<script setup>
/* IMPORTS */

import { ref, reactive } from 'vue';
import Chips from '@/components/Chips.vue';
import Stake from '@/components/Stake.vue';

/* - TABS */

const currentTab = ref("Stake"),
            tabs = reactive(["Stake", "Chips"]);
</script>