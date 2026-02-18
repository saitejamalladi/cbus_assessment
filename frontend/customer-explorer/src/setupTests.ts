import '@testing-library/jest-dom'

// Minimal IntersectionObserver mock for tests
type IOEntry = { isIntersecting: boolean; target?: Element }

class MockIntersectionObserver {
  private callback: (entries: IOEntry[], observer: MockIntersectionObserver) => void
  private elements: Set<Element> = new Set()

  constructor(cb: (entries: IOEntry[], observer: MockIntersectionObserver) => void) {
    this.callback = cb
    // Expose last instance for tests to trigger
    ;(globalThis as any).__lastIO = this
  }

  observe(element: Element) {
    this.elements.add(element)
  }
  unobserve(element: Element) {
    this.elements.delete(element)
  }
  disconnect() {
    this.elements.clear()
  }

  // Helper to trigger intersection in tests
  trigger(isIntersecting = true) {
    const entries: IOEntry[] = Array.from(this.elements).map((el) => ({ isIntersecting, target: el }))
    this.callback(entries, this)
  }
}

;(globalThis as any).IntersectionObserver = MockIntersectionObserver as any
