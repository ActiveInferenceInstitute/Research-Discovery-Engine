import '@testing-library/jest-dom';

// Mock crypto.randomUUID
const mockCrypto = {
  randomUUID: () => 'test-uuid'
};

// @ts-ignore
global.crypto = mockCrypto; 