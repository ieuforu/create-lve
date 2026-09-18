<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Code2, Layers3, Route, Sparkles } from '@lucide/vue'

const stack = [
  { icon: Sparkles, name: 'Vue 3', description: 'A stable, modern reactive foundation.' },
  { icon: Route, name: 'Vue Router', description: 'Typed navigation ready to extend.' },
  { icon: Layers3, name: 'Pinia', description: 'Simple state management when you need it.' },
  { icon: Code2, name: 'TypeScript', description: 'Strict types across the whole project.' },
]
</script>

<template>
  <section class="container mx-auto px-4 py-24">
    <div class="mx-auto max-w-3xl text-center">
      <Badge variant="secondary">About this starter</Badge>
      <h1 class="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">A small, solid beginning</h1>
      <p class="mt-5 text-lg leading-8 text-muted-foreground">
        This template keeps the foundation practical: a fast build, sensible defaults, and enough
        structure to start shipping without fighting the toolchain.
      </p>
    </div>

    <div class="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
      <Card v-for="item in stack" :key="item.name">
        <CardHeader>
          <component :is="item.icon" class="mb-3 h-6 w-6 text-primary" />
          <CardTitle>{{ item.name }}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription class="text-base">{{ item.description }}</CardDescription>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
