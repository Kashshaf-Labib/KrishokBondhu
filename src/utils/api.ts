const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://krishok-bondhu-backend-1.onrender.com';

export const apiClient = {
  async post(endpoint: string, data: any, options?: RequestInit) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  },

  async postFormData(endpoint: string, formData: FormData) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData, // Don't set Content-Type header for FormData
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  },

  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  },
};

// Test API connection
export async function testAPIConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Connection successful:', data);
      return true;
    } else {
      console.error('❌ API Connection failed:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ API Connection error:', error);
    return false;
  }
}

export { API_BASE_URL };
