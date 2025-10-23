const API_BASE = 'http://localhost:4000'; // Backend server URL

class ApiService {
  // Authentication
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  // Products
  async getProducts() {
    const response = await fetch(`${API_BASE}/api/products`);
    return response.json();
  }

  async getProduct(id) {
    const response = await fetch(`${API_BASE}/api/products/${id}`);
    return response.json();
  }

  async searchProducts(query) {
    const response = await fetch(`${API_BASE}/api/products?q=${query}`);
    return response.json();
  }

  async getProductsByCategory(category) {
    const response = await fetch(`${API_BASE}/api/products?category=${category}`);
    return response.json();
  }

  async saveProduct(product) {
    try {
      // Check if product already exists
      const existingResponse = await fetch(`${API_BASE}/api/products/${product.id}`);
      if (existingResponse.ok) {
        const existingProduct = await existingResponse.json();
        return existingProduct; // Product already exists, return it
      }
    } catch (error) {
      // Product doesn't exist, create it
      console.log('Product does not exist, creating new product');
    }

    // Create new product
    try {
      const response = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        // Handle 413 Payload Too Large
        if (response.status === 413) {
          throw new Error('Product data is too large. Please use a smaller image (under 500KB).');
        }

        // Try to parse error response
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || `Failed to create product: ${response.status}`);
        } catch (parseError) {
          // If response is not JSON (e.g., HTML error page)
          throw new Error(`Server error (${response.status}): ${response.statusText}. Please try with a smaller image.`);
        }
      }

      return response.json();
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  }

  // Cart operations
  async getCart(userId) {
    const response = await fetch(`${API_BASE}/api/cart?userId=${userId}`);
    const carts = await response.json();
    return carts[0] || { userId: parseInt(userId), products: [] };
  }

  async addToCart(userId, productId, quantity = 1) {
    const cart = await this.getCart(userId);
    
    // Check if product already in cart
    const existingProduct = cart.products.find(p => p.productId === productId);
    
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    if (cart.id) {
      // Update existing cart
      const response = await fetch(`${API_BASE}/api/cart/${cart.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cart)
      });
      return response.json();
    } else {
      // Create new cart
      const response = await fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(userId),
          products: cart.products
        })
      });
      return response.json();
    }
  }

  async addToCartWithProduct(userId, product, quantity = 1) {
    const cart = await this.getCart(userId);
    
    // Check if product already in cart
    const existingProduct = cart.products.find(p => p.productId === product.id);
    
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ 
        productId: product.id, 
        quantity,
        product: product // Store complete product data
      });
    }

    if (cart.id) {
      // Update existing cart
      const response = await fetch(`${API_BASE}/api/cart/${cart.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cart)
      });
      return response.json();
    } else {
      // Create new cart
      const response = await fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(userId),
          products: cart.products
        })
      });
      return response.json();
    }
  }

  async removeFromCart(userId, productId) {
    const cart = await this.getCart(userId);
    cart.products = cart.products.filter(p => p.productId !== productId);
    
    if (cart.id) {
      const response = await fetch(`${API_BASE}/api/cart/${cart.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cart)
      });
      return response.json();
    }
    return { success: true };
  }

  async updateCartItem(userId, productId, quantity) {
    const cart = await this.getCart(userId);
    const existingProduct = cart.products.find(p => p.productId === productId);
    
    if (existingProduct) {
      existingProduct.quantity = quantity;
    }
    
    if (cart.id) {
      const response = await fetch(`${API_BASE}/api/cart/${cart.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cart)
      });
      return response.json();
    }
    return { success: true };
  }

  async clearCart(userId) {
    const cart = await this.getCart(userId);
    cart.products = [];
    
    if (cart.id) {
      const response = await fetch(`${API_BASE}/api/cart/${cart.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cart)
      });
      return response.json();
    }
    return { success: true };
  }

  // Orders
  async createOrder(userId, products, total) {
    const order = {
      userId,
      products,
      total,
      status: 'processing',
      orderDate: new Date().toISOString()
    };

    try {
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });

      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.status}`);
      }

      const createdOrder = await response.json();
      console.log('Order created successfully:', createdOrder);
      return createdOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getUserOrders(userId) {
    try {
      const response = await fetch(`${API_BASE}/api/orders?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      const orders = await response.json();
      console.log('Fetched orders:', orders);
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  async getFavorites(userId) {
    try {
      const response = await fetch(`${API_BASE}/api/favorites?userId=${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching favorites:', error);
      // Return empty array if endpoint doesn't exist
      return [];
    }
  }

  async addToFavorites(userId, productId) {
    try {
      const response = await fetch(`${API_BASE}/api/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId })
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return { success: false, error: 'Failed to add to favorites' };
    }
  }

  async removeFromFavorites(userId, productId) {
    try {
      const response = await fetch(`${API_BASE}/api/favorites/${userId}/${productId}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return { success: false, error: 'Failed to remove from favorites' };
    }
  }
}

const apiServiceInstance = new ApiService();
export default apiServiceInstance;