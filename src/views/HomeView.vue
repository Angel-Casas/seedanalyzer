
<template>
<div>
  <div class="passage">
    <span :class="showDelayed ? 'fadeInSlideIn' : ''">“We sow the seeds...</span>
    <div class="imgWrapper" :class="show ? 'fadeIn' : ''">
      <img class="tree" src="/images/aiTreeGhibli.png" alt="">
      <div :class="showDelayed ? 'fadeIn' : ''">
        <img class="superimpose leafs" src="/images/sparks1.png" alt="">
        <img class="superimpose leafs2" src="/images/sparks2.png" alt="">
        <img class="superimpose bop" src="/images/balloon1.png" alt="">
        <img class="superimpose bop2" src="/images/balloon2.png" alt="">
        <img class="superimpose fireflyFade" src="/images/firefly1.png" alt="">
        <img class="superimpose fireflyFade2" src="/images/firefly2.png" alt="">
      </div>
    </div>
    <span :class="showDelayed2 ? 'fadeInSlideIn' : ''">...so we can reap the harvest.”</span>
  </div>
  <div class="passage">
    <div style="position: relative">
      <img class="cloudFloat" src="/images/cloud1.png" alt="">
    </div>
    <div class="supportCoins white">
      <h3 class="bold">Support my journey</h3>
      <p class="bold">BTC:</p>
      <p>1EL6imMPN5ojiJNBV3iJrQCnov7WADSuCU</p>
      <p class="bold">ETH (ERC20):</p>
      <p>0xc129f8d7b3f5f442b928b619f289dbd8c67384df</p>
    </div>
    <div>
      <img class="cloudFloat2" src="/images/cloud2.png" alt="">
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const show = ref(false),
      showDelayed = ref(false),
      showDelayed2 = ref(false)

/* MOUNTED */

onMounted(async () => {
  show.value = true;
  setTimeout(() => {
    showDelayed.value = true;
  }, 2000);
  setTimeout(() => {
    showDelayed2.value = true;
  }, 5000);
})

</script>

<style scoped>
</style>