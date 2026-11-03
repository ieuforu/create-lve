import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LandingPage from './LandingPage.vue'

describe('LandingPage', () => {
  it('presents one clear application flow', () => {
    const wrapper = mount(LandingPage)

    expect(wrapper.get('h1').text()).toContain('Start clear. Stay flexible.')
    expect(wrapper.findAll('article')).toHaveLength(4)
    expect(wrapper.get('[aria-label="Application architecture flow"]').text()).toContain(
      'request→route→feature→ui + store',
    )
    expect(
      wrapper.get('a[href="https://github.com/ieuforu/create-lve"]').attributes('target'),
    ).toBe('_blank')
  })
})
