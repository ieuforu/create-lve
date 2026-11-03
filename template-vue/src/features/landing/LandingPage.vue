<script setup lang="ts">
import { ArrowDown, ArrowUpRight } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import './landing.css'

const flow = [
  {
    index: '01',
    title: 'Route',
    label: 'MAP / LOAD / GUARD',
    copy: 'The router names the destination, prepares navigation, and then steps aside.',
  },
  {
    index: '02',
    title: 'Feature',
    label: 'PAGE / DOMAIN / ACTION',
    copy: 'Everything a person sees and does stays beside the feature that owns it.',
  },
  {
    index: '03',
    title: 'UI',
    label: 'REKA / ACCESSIBLE',
    copy: 'Small, owned primitives handle interaction without taking over product structure.',
  },
  {
    index: '04',
    title: 'State',
    label: 'LOCAL / URL / PINIA',
    copy: 'Vue keeps state local first; the URL and Pinia take over only when sharing is real.',
  },
] as const
</script>

<template>
  <div class="vue-shell">
    <a class="vue-skip" href="#content">Skip to content</a>

    <header class="vue-header">
      <a class="vue-brand" href="#top" aria-label="lve Vue home">
        <span class="vue-brand-mark" aria-hidden="true">v/</span>
        <span>
          LVE
          <small>Vue starter</small>
        </span>
      </a>

      <nav aria-label="Primary navigation">
        <a href="#flow">Flow</a>
        <a href="#principles">Principles</a>
        <a href="https://github.com/ieuforu/create-lve" target="_blank" rel="noreferrer">
          GitHub <ArrowUpRight aria-hidden="true" />
        </a>
      </nav>
    </header>

    <main id="content">
      <section id="top" class="vue-hero" aria-labelledby="hero-title">
        <div class="vue-hero-copy">
          <p class="vue-kicker"><span aria-hidden="true" /> Vue 3 / Router / Pinia</p>
          <h1 id="hero-title">
            Start clear.
            <em>Stay flexible.</em>
          </h1>
          <p class="vue-intro">
            A deliberate Vue starting point with one visible direction—from a quiet route to the
            feature that owns the work.
          </p>
          <div class="vue-actions">
            <Button as="a" href="#flow" size="lg">
              See the flow <ArrowDown aria-hidden="true" />
            </Button>
            <a
              class="vue-text-link"
              href="https://github.com/ieuforu/create-lve"
              target="_blank"
              rel="noreferrer"
            >
              Read the source <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>

        <div class="vue-hero-art" aria-hidden="true">
          <svg viewBox="0 0 420 420" fill="none">
            <path class="vue-mark-soft" d="M38 66 210 356 382 66" />
            <path d="m92 66 118 200L328 66" />
            <path d="m145 66 65 111 65-111" />
            <path class="vue-mark-cross" d="M25 66h370M210 26v370" />
          </svg>
          <p>
            ONE ROUTE<br />
            ONE FEATURE<br />
            ONE DIRECTION
          </p>
        </div>
      </section>

      <section id="principles" class="vue-principle" aria-labelledby="principle-title">
        <div>
          <p class="vue-section-label">A small rule</p>
          <h2 id="principle-title">“Let the router point. Let the feature own.”</h2>
        </div>
        <dl>
          <div>
            <dt>Router</dt>
            <dd>integration</dd>
          </div>
          <div>
            <dt>Feature</dt>
            <dd>product work</dd>
          </div>
          <div>
            <dt>Shared</dt>
            <dd>only after reuse</dd>
          </div>
        </dl>
      </section>

      <section id="flow" class="vue-flow" aria-labelledby="flow-title">
        <div class="vue-section-heading">
          <div>
            <p class="vue-section-label">The application path</p>
            <h2 id="flow-title">Four owners. One direction.</h2>
          </div>
          <p>01 / FLOW</p>
        </div>

        <div class="vue-flow-grid">
          <article v-for="step in flow" :key="step.title" class="vue-flow-card">
            <div class="vue-card-meta">
              <span>{{ step.label }}</span
              ><span>{{ step.index }}</span>
            </div>
            <div class="vue-card-mark" aria-hidden="true">{{ step.index }}</div>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.copy }}</p>
            </div>
          </article>
        </div>

        <div class="vue-code-line" aria-label="Application architecture flow">
          <span>request</span><i aria-hidden="true">→</i><strong>route</strong>
          <i aria-hidden="true">→</i><strong>feature</strong><i aria-hidden="true">→</i>
          <span>ui + store</span>
        </div>
      </section>
    </main>

    <footer class="vue-footer">
      <p><strong>lve</strong> / a calmer Vue beginning.</p>
      <p>Vue · TypeScript · Vite</p>
    </footer>
  </div>
</template>
