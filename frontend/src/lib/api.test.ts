import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from './api';

const TOKEN_KEY = 'norma-token';

describe('api', () => {
  beforeEach(() => {
    localStorage.setItem(TOKEN_KEY, 'test-token');
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('sends GET request with auth header', async () => {
    const mockResponse = { id: '1', name: 'Test' };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockResponse), { status: 200 }),
    );

    const result = await api.get('/projects');

    expect(fetch).toHaveBeenCalledWith(
      '/api/projects',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      }),
    );
    expect(result).toEqual(mockResponse);
  });

  it('sends POST request with body', async () => {
    const mockResponse = { id: '1' };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockResponse), { status: 200 }),
    );

    await api.post('/projects', { name: 'New' });

    expect(fetch).toHaveBeenCalledWith(
      '/api/projects',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'New' }),
      }),
    );
  });

  it('throws on error response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ detail: 'Not found' }), { status: 404 }),
    );

    await expect(api.get('/missing')).rejects.toThrow('Not found');
  });

  it('sends DELETE request', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ detail: 'Deleted' }), { status: 200 }),
    );

    await api.delete('/projects/1');

    expect(fetch).toHaveBeenCalledWith(
      '/api/projects/1',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });
});
