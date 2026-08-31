<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, ExternalLink, Zap, Shield, Palette, Code2, Star } from '@lucide/vue'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built on Vite for instant HMR and blazing fast builds.',
  },
  {
    icon: Shield,
    title: 'Type Safe',
    description: 'Full TypeScript support with Vue TSC and strict mode.',
  },
  {
    icon: Palette,
    title: 'Beautiful UI',
    description: 'Powered by shadcn-vue and Reka UI for accessible components.',
  },
  {
    icon: Code2,
    title: 'Developer First',
    description: 'Clean APIs, composable patterns, and great DX.',
  },
]
</script>

<template>
  <!-- Hero -->
  <section class="container mx-auto flex flex-col items-center justify-center gap-4 py-24 text-center px-4">
    <Badge variant="secondary" class="px-4 py-1">
      <Star class="mr-1 h-3 w-3" />
      Built with Vue 3 + shadcn-vue
    </Badge>

    <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
      Build your next
      <span class="text-primary">great idea</span>
      with confidence
    </h1>

    <p class="max-w-[600px] text-muted-foreground text-lg md:text-xl">
      A modern Vue 3 starter with TypeScript, Pinia, Vue Router, and shadcn-vue. Everything you
      need to ship fast.
    </p>

    <div class="flex gap-4 mt-4">
      <Button size="lg">
        Get Started
        <ArrowRight class="ml-2 h-5 w-5" />
      </Button>
      <Button variant="outline" size="lg">
        <ExternalLink class="mr-2 h-5 w-5" />
        View on GitHub
      </Button>
    </div>
  </section>

  <Separator class="container mx-auto" />

  <!-- Features -->
  <section id="features" class="container mx-auto py-24 px-4">
    <div class="text-center mb-16">
      <Badge variant="outline" class="mb-4">Features</Badge>
      <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl">Everything you need</h2>
      <p class="mt-4 text-muted-foreground text-lg max-w-[600px] mx-auto">
        Carefully chosen tools and libraries for a productive development experience.
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card
        v-for="feature in features"
        :key="feature.title"
        class="border-0 shadow-sm hover:shadow-md transition-shadow"
      >
        <CardHeader>
          <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <component :is="feature.icon" class="h-6 w-6 text-primary" />
          </div>
          <CardTitle class="text-lg">{{ feature.title }}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription class="text-base">
            {{ feature.description }}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  </section>

  <Separator class="container mx-auto" />

  <!-- CTA -->
  <section class="container mx-auto py-24 text-center px-4">
    <div class="mx-auto max-w-[800px]">
      <Badge variant="outline" class="mb-4">Open Source</Badge>
      <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">Ready to get started?</h2>
      <p class="text-muted-foreground text-lg mb-8">
        Free and open source. Start building today.
      </p>
      <div class="flex gap-4 justify-center">
        <Button size="lg">
          Start Building
          <ArrowRight class="ml-2 h-5 w-5" />
        </Button>
        <Button variant="outline" size="lg">Read the Docs</Button>
      </div>
    </div>
  </section>
</template>
