/**
 * SomoBloom Admin API Client
 * Handles HTTP requests to the Hono backend with JWT token authentication.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787/api';

class ApiClient {
  constructor() {
    this.tokenKey = 'somobloom_token';
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('[Offline Sync] Admin Portal restored online. Replaying operations...');
        this.syncOfflineQueue();
      });
      setTimeout(() => this.syncOfflineQueue(), 1000);
    }
  }

  getHeaders(contentType = 'application/json') {
    const headers = {
      'Content-Type': contentType,
    };

    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async get(endpoint) {
    const cacheKey = `somobloom_cache:${this.tokenKey}:${endpoint}`;
    
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        console.warn(`[Offline] Serving cached data for GET ${endpoint}`);
        return JSON.parse(cached);
      }
      throw new Error('No internet connection, and no cached data is available.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const data = await this.handleResponse(response);
      localStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    } catch (err) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        console.warn(`[Offline Fallback] Network failed. Serving cached data for GET ${endpoint}`);
        return JSON.parse(cached);
      }
      throw err;
    }
  }

  async post(endpoint, data) {
    return this.mutate('POST', endpoint, data);
  }

  async put(endpoint, data) {
    return this.mutate('PUT', endpoint, data);
  }

  async delete(endpoint) {
    return this.mutate('DELETE', endpoint, null);
  }

  async mutate(method, endpoint, data) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.queueMutation(method, endpoint, data);
      console.warn(`[Offline] Queued mutation: ${method} ${endpoint}`);
      return { success: true, offlineQueued: true };
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });
      return await this.handleResponse(response);
    } catch (err) {
      this.queueMutation(method, endpoint, data);
      console.warn(`[Offline Fallback] Network failed. Queued mutation: ${method} ${endpoint}`);
      return { success: true, offlineQueued: true };
    }
  }

  queueMutation(method, endpoint, data) {
    const queueKey = `somobloom_queue:${this.tokenKey}`;
    const rawQueue = localStorage.getItem(queueKey);
    const queue = rawQueue ? JSON.parse(rawQueue) : [];

    const isDuplicate = queue.some(item => 
      item.method === method && 
      item.endpoint === endpoint && 
      JSON.stringify(item.data) === JSON.stringify(data)
    );

    if (!isDuplicate) {
      queue.push({
        id: Math.random().toString(36).substring(2),
        method,
        endpoint,
        data,
        timestamp: Date.now()
      });
      localStorage.setItem(queueKey, JSON.stringify(queue));
    }
  }

  async syncOfflineQueue() {
    const queueKey = `somobloom_queue:${this.tokenKey}`;
    const rawQueue = localStorage.getItem(queueKey);
    if (!rawQueue) return;

    let queue = JSON.parse(rawQueue);
    if (queue.length === 0) return;

    console.log(`[Offline Sync] Syncing ${queue.length} pending operations...`);
    const remaining = [];

    for (const item of queue) {
      try {
        await fetch(`${API_BASE_URL}${item.endpoint}`, {
          method: item.method,
          headers: this.getHeaders(),
          body: item.data ? JSON.stringify(item.data) : undefined,
        });
        console.log(`[Offline Sync] Synced operation successfully: ${item.method} ${item.endpoint}`);
      } catch (err) {
        console.error(`[Offline Sync] Sync failed for: ${item.method} ${item.endpoint}. Will retry later.`, err);
        remaining.push(item);
      }
    }

    localStorage.setItem(queueKey, JSON.stringify(remaining));
  }

  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}

export const api = new ApiClient();
