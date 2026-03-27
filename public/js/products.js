// Products CRUD Operations
class ProductsManager {
  constructor() {
    this.db = window.firebaseConfig.db;
    this.userId = window.firebaseConfig.getCurrentUserId();
  }

  // Add new product
  async addProduct(productData) {
    try {
      const product = {
        ...productData,
        userId: this.userId,
        status: this.determineStatus(productData.expiryDate),
        action: 'none',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await this.db.collection('products').add(product);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding product:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all products for current user
  async getProducts() {
    try {
      const snapshot = await this.db.collection('products')
        .where('userId', '==', this.userId)
        .orderBy('createdAt', 'desc')
        .get();

      const products = [];
      snapshot.forEach(doc => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return products;
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  }

  // Update product action (used/thrown)
  async updateProductAction(productId, action) {
    try {
      await this.db.collection('products').doc(productId).update({
        action: action,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete product
  async deleteProduct(productId) {
    try {
      await this.db.collection('products').doc(productId).delete();
      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: error.message };
    }
  }

  // Update product status based on expiry date
  async updateProductStatuses() {
    try {
      const products = await this.getProducts();
      const batch = this.db.batch();

      products.forEach(product => {
        const newStatus = this.determineStatus(product.expiryDate);
        if (product.status !== newStatus) {
          const docRef = this.db.collection('products').doc(product.id);
          batch.update(docRef, { 
            status: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        }
      });

      await batch.commit();
      return { success: true };
    } catch (error) {
      console.error('Error updating statuses:', error);
      return { success: false, error: error.message };
    }
  }

  // Determine product status based on expiry date
  determineStatus(expiryDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'expired';
    if (diffDays <= 2) return 'use-soon';
    return 'safe';
  }

  // Get products by status
  async getProductsByStatus(status) {
    try {
      const snapshot = await this.db.collection('products')
        .where('userId', '==', this.userId)
        .where('status', '==', status)
        .where('action', '==', 'none')
        .orderBy('expiryDate', 'asc')
        .get();

      const products = [];
      snapshot.forEach(doc => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return products;
    } catch (error) {
      console.error('Error getting products by status:', error);
      return [];
    }
  }

  // Get products that need to be used today
  async getUseTodayProducts() {
    try {
      const snapshot = await this.db.collection('products')
        .where('userId', '==', this.userId)
        .where('action', '==', 'none')
        .orderBy('expiryDate', 'asc')
        .get();

      const products = [];
      snapshot.forEach(doc => {
        const product = {
          id: doc.id,
          ...doc.data()
        };
        
        const status = this.determineStatus(product.expiryDate);
        if (status === 'use-soon' || status === 'expired') {
          product.status = status;
          products.push(product);
        }
      });

      return products;
    } catch (error) {
      console.error('Error getting use today products:', error);
      return [];
    }
  }

  // Get statistics
  async getStatistics() {
    try {
      const snapshot = await this.db.collection('products')
        .where('userId', '==', this.userId)
        .get();

      let total = 0;
      let used = 0;
      let thrown = 0;
      let active = 0;
      let expired = 0;
      let useSoon = 0;

      snapshot.forEach(doc => {
        const product = doc.data();
        total++;
        
        if (product.action === 'used') used++;
        else if (product.action === 'thrown') thrown++;
        else {
          active++;
          if (product.status === 'expired') expired++;
          else if (product.status === 'use-soon') useSoon++;
        }
      });

      return {
        total,
        used,
        thrown,
        active,
        expired,
        useSoon,
        ecoScore: this.calculateEcoScore(used, thrown)
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
        total: 0,
        used: 0,
        thrown: 0,
        active: 0,
        expired: 0,
        useSoon: 0,
        ecoScore: 50
      };
    }
  }

  // Calculate Eco Score
  calculateEcoScore(used, thrown) {
    if (used === 0 && thrown === 0) return 50;
    
    const total = used + thrown;
    const percentage = (used / total) * 100;
    
    return Math.min(100, Math.max(0, Math.round(percentage)));
  }

  // Search products
  async searchProducts(query) {
    try {
      const allProducts = await this.getProducts();
      return allProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  // Delete product
  async deleteProduct(productId) {
    try {
      // First, get the product to verify ownership
      const productDoc = await this.db.collection('products').doc(productId).get();
      
      if (!productDoc.exists) {
        return { success: false, error: 'Продуктът не е намерен' };
      }

      const product = productDoc.data();
      
      // Check if the product belongs to the current user
      if (product.userId !== this.userId) {
        return { success: false, error: 'Нямате право да изтриете този продукт' };
      }

      // Delete the product
      await this.db.collection('products').doc(productId).delete();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: error.message };
    }
  }
}

// Initialize products manager
window.productsManager = new ProductsManager();
