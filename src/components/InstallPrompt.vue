<template>
  <div class="installerWrapper" v-if="installPrompt">
    <span>Simulate strategies anywhere, even offline!</span>
    <div class="buttonPromptWrapper">
      <span
      class="buttonPrompt"
      @click="installer"
      >
        Install
      </span>
      <span
      class="buttonPrompt"
      @click="dismiss"
      >
        Not now
      </span>
    </div>
  </div>
</template>

<script setup>
/* IMPORTS */

import { ref, onMounted } from "vue"
import Cookies from "js-cookie"

/* DATA */

const installPrompt = ref(null);

const installer = () => {
  installPrompt.value.prompt();
  installPrompt.value.userChoice.then(result => {
    if (result.outcome === "accepted") {
      console.log("user accepted");
    } else {
      console.log("user declined");
    }
  })
}

const dismiss = () => {
  Cookies.set("add-to-home-screen", null, { expires: 15 });
  installPrompt.value = null;
}

/* MOUNTED */

onMounted(async () => {
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    if (Cookies.get("add-to-home-screen") === undefined) {
    installPrompt.value = e;
  }
  });
  window.addEventListener("appinstalled", e => {
    installPrompt.value = null;
    console.log('👍', 'appinstalled', e);
  });
})

</script>