<template>
<header id="Header">
  <RouterLink to="/">
    <img
        alt="Seed Analyzer Logo"
        class="logo"
        src="/images/pwa/pwa-512x512.png"
        width="125"
        height="125"
      />
  </RouterLink>
  <nav>
    <RouterLink to="/dice">Dice</RouterLink>
    <RouterLink to="/limbo">Limbo</RouterLink>
    <RouterLink to="/live">Live <span class="mainRed small">*new*</span></RouterLink>
  </nav>
</header>
</template>

<script setup>

</script>
