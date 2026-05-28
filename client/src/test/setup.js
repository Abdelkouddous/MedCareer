import "@testing-library/jest-dom";
import { vi } from "vitest";

// Workaround for Node.js v18+ global fetch/Request AbortSignal type verification error in JSDOM environment
const OriginalRequest = globalThis.Request;
if (OriginalRequest) {
  globalThis.Request = class Request extends OriginalRequest {
    constructor(input, init) {
      if (init && init.signal) {
        const { signal, ...rest } = init;
        super(input, rest);
      } else {
        super(input, init);
      }
    }
  };
}

const OriginalFetch = globalThis.fetch;
if (OriginalFetch) {
  globalThis.fetch = function (input, init) {
    if (init && init.signal) {
      const { signal, ...rest } = init;
      return OriginalFetch(input, rest);
    }
    return OriginalFetch(input, init);
  };
}

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
globalThis.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
globalThis.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
globalThis.sessionStorage = sessionStorageMock;
