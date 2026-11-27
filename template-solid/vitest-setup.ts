// Registers @testing-library/jest-dom's matchers (toHaveTextContent etc.)
// with vitest's expect, including their types.
import '@testing-library/jest-dom/vitest'

// jsdom has no media queries. Use the desktop presentation for popup interaction tests.
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (media: string): MediaQueryList =>
      Object.assign(new EventTarget(), {
        media,
        matches: false,
        onchange: null,
        addListener() {},
        removeListener() {},
      }),
  })
}

Element.prototype.getAnimations ??= () => []
Element.prototype.scrollIntoView ??= () => {}
