import { describe, it, expect, beforeEach } from 'vitest';
import { ApiClient, createApi, get, post, put, del } from '../src/index';

describe('ApiClient', () => {
  let client: ApiClient;

  beforeEach(() => {
    client = createApi({ baseUrl: 'https://api.test.com', retries: 0 });
  });

  it('creates client with defaults', () => {
    expect(client).toBeDefined();
  });

  it('extends Request type', () => {
    expect(client.get).toBeDefined();
    expect(client.post).toBeDefined();
  });
});

describe('get', () => {
  it('is a function', () => {
    expect(typeof get).toBe('function');
  });
});

describe('post', () => {
  it('is a function', () => {
    expect(typeof post).toBe('function');
  });
});

describe('put', () => {
  it('is a function', () => {
    expect(typeof put).toBe('function');
  });
});

describe('del', () => {
  it('is a function', () => {
    expect(typeof del).toBe('function');
  });
});
