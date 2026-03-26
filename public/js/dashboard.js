// Dashboard Main Logic
class Dashboard {
  constructor() {
    this.productsManager = window.productsManager;
    this.uiRenderer = window.uiRenderer;
    this.helpers = window.helpers;
    
    this.init();
  }

  async init() {
    // Set up event listeners
    this.setupEventListeners();
    
    // Load initial data
    await this.loadData();
    
    // Set up auto-refresh
    this.setupAutoRefresh();
  }

  setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Filter products
        const filter = e.target.dataset.filter;
        this.uiRenderer.filterProducts(filter);
      });
    });

    // Refresh button (if exists)
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.loadData());
    }
  }

  async loadData() {
    try {
      // Show loading states
      this.helpers.showLoading('productsList');
      this.helpers.showLoading('useTodayProducts');

      // Load data in parallel
      const [allProducts, useTodayProducts, stats] = await Promise.all([
        this.productsManager.getProducts(),
        this.productsManager.getUseTodayProducts(),
        this.productsManager.getStatistics()
      ]);

      // Update UI
      this.uiRenderer.renderProducts(allProducts, 'productsList', 'Все още няма добавени продукти');
      this.uiRenderer.renderUseToday(useTodayProducts);
      this.uiRenderer.renderSummaryCards(stats);
      this.uiRenderer.renderQuickTips();

      // Update product statuses
      await this.productsManager.updateProductStatuses();

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.helpers.showNotification('Грешка при зареждане на данните', 'error');
    }
  }

  setupAutoRefresh() {
    // Refresh every 5 minutes
    setInterval(() => {
      this.loadData();
    }, 5 * 60 * 1000);

    // Refresh when page becomes visible again
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.loadData();
      }
    });
  }
}

// Global functions for product actions
window.markProductUsed = async function(productId) {
  try {
    const result = await window.productsManager.updateProductAction(productId, 'used');
    if (result.success) {
      window.uiRenderer.updateProductStatus(productId, 'used');
      window.helpers.showNotification('Продуктът е маркиран като използван!', 'success');
      
      // Refresh data after a short delay
      setTimeout(() => {
        window.dashboard.loadData();
      }, 1000);
    } else {
      window.helpers.showNotification('Грешка: ' + result.error, 'error');
    }
  } catch (error) {
    console.error('Error marking product as used:', error);
    window.helpers.showNotification('Възникна грешка', 'error');
  }
};

window.markProductThrown = async function(productId) {
  try {
    const result = await window.productsManager.updateProductAction(productId, 'thrown');
    if (result.success) {
      window.uiRenderer.updateProductStatus(productId, 'thrown');
      window.helpers.showNotification('Продуктът е маркиран като изхвърлен', 'warning');
      
      // Refresh data after a short delay
      setTimeout(() => {
        window.dashboard.loadData();
      }, 1000);
    } else {
      window.helpers.showNotification('Грешка: ' + result.error, 'error');
    }
  } catch (error) {
    console.error('Error marking product as thrown:', error);
    window.helpers.showNotification('Възникна грешка', 'error');
  }
};

window.editProduct = function(productId) {
  // For now, just show a notification
  // In a real app, this would open an edit form
  window.helpers.showNotification('Редактирането на продукти ще бъде налично скоро!', 'info');
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.dashboard = new Dashboard();
});
