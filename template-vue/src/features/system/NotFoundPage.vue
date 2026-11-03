<script setup lang="ts">
import { RouterLink } from 'vue-router'
import './system.css'
</script>

<template>
  <main class="vue-system-page">
    <section class="vue-system-panel" aria-labelledby="system-title">
      <div class="vue-system-meta"><span>Page not found</span><span>404</span></div>
      <div class="vue-system-copy">
        <h1 id="system-title">This route ends here.</h1>
        <p>The address does not map to a feature in this application.</p>
      </div>
      <div class="vue-system-actions">
        <RouterLink to="/">Back home</RouterLink>
      </div>
    </section>
  </main>
</template>
