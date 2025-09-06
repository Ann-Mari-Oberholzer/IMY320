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
        return; // Product already exists
      }
    } catch (error) {
      // Product doesn't exist, create it
    }

    // Create new product
    const response = await fetch(`${API_BASE}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return response.json();
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
      status: 'pending',
      orderDate: new Date().toISOString()
    };

    const response = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return response.json();
  }

  async getUserOrders(userId) {
    const response = await fetch(`${API_BASE}/api/orders?userId=${userId}`);
    return response.json();
  }
}

export default new ApiService();