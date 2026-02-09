const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Generic API client wrapper for Fetch API
 */
export const apiClient = {
    /**
     * Get auth headers with token
     */
    getHeaders: () => {
        const headers = {
            'Content-Type': 'application/json',
        };
        const token = localStorage.getItem('hackfest_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },

    /**
     * Handle response helper
     */
    handleResponse: async (response) => {
        console.log('API Response:', response.status, response.statusText);
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        const data = isJson ? await response.json() : await response.text();

        if (!response.ok) {
            // Handle 401 Unauthorized (Logout)
            if (response.status === 401) {
                localStorage.removeItem('hackfest_token');
                localStorage.removeItem('hackfest_user');
                // Optional: Force reload or redirect to login
                // window.location.href = '/login';
            }

            const error = (data && data.message) || response.statusText;
            console.error('API Error:', error);
            throw new Error(error);
        }

        return data; // Usually returns { success: true, data: ... }
    },

    /**
     * GET request
     */
    get: async (endpoint) => {
        try {
            console.log('GET Request:', `${BASE_URL}${endpoint}`);
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: apiClient.getHeaders(),
            });
            return apiClient.handleResponse(response);
        } catch (error) {
            console.error('GET Request Failed:', error);
            throw error;
        }
    },

    /**
     * POST request
     */
    post: async (endpoint, body) => {
        try {
            console.log('POST Request:', `${BASE_URL}${endpoint}`, body);
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: apiClient.getHeaders(),
                body: JSON.stringify(body),
            });
            return apiClient.handleResponse(response);
        } catch (error) {
            console.error('POST Request Failed:', error);
            throw error;
        }
    },

    /**
     * PUT request
     */
    put: async (endpoint, body) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: apiClient.getHeaders(),
            body: JSON.stringify(body),
        });
        return apiClient.handleResponse(response);
    },

    /**
     * DELETE request
     */
    delete: async (endpoint) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: apiClient.getHeaders(),
        });
        return apiClient.handleResponse(response);
    }
};
