import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LandingPage from '@/views/LandingPage.vue'

describe('LandingPage', () => {
  it('renders the starter message and feature set', () => {
    const wrapper = mount(LandingPage)

    expect(wrapper.get('h1').text()).toContain('Build your next great idea with confidence')
    expect(wrapper.text()).toContain('Built with Vue 3 + shadcn-vue')
    expect(wrapper.text()).toContain('Lightning Fast')
    expect(wrapper.text()).toContain('Type Safe')
    expect(wrapper.text()).toContain('Beautiful UI')
    expect(wrapper.text()).toContain('Developer First')
  })
})
