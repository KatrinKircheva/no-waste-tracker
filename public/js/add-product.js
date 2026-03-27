// Add Product Page Logic
class AddProductPage {
  constructor() {
    this.productsManager = window.productsManager;
    this.helpers = window.helpers;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setMinDate();
  }

  setupEventListeners() {
    // Form submission
    const form = document.getElementById('addProductForm');
    if (form) {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Quick add buttons
    document.querySelectorAll('.quick-add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleQuickAdd(e));
    });

    // Category change - update default units
    const categorySelect = document.getElementById('productCategory');
    if (categorySelect) {
      categorySelect.addEventListener('change', (e) => this.updateDefaultUnit(e.target.value));
    }
  }

  setMinDate() {
    // Set minimum date to today
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
      const today = new Date().toISOString().split('T')[0];
      expiryDateInput.min = today;
      expiryDateInput.value = today; // Set today as default
    }
  }

  updateDefaultUnit(category) {
    const unitSelect = document.getElementById('productUnit');
    if (!unitSelect) return;

    // Set default unit based on category
    const defaultUnits = {
      'млечни': 'бр',
      'зеленчуци': 'бр',
      'плодове': 'бр',
      'месо': 'кг',
      'хляб': 'бр',
      'консерви': 'бр',
      'замразени': 'кг',
      'напитки': 'л',
      'други': 'бр'
    };

    unitSelect.value = defaultUnits[category] || 'бр';
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const productData = {
      name: formData.get('name').trim(),
      category: formData.get('category'),
      quantity: parseFloat(formData.get('quantity')),
      unit: formData.get('unit'),
      expiryDate: formData.get('expiryDate'),
      notes: formData.get('notes')?.trim() || ''
    };

    // Validate form data
    const errors = this.helpers.validateProductForm(productData);
    if (errors.length > 0) {
      this.helpers.showNotification(errors[0], 'error');
      return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Добавяне...';
    submitBtn.disabled = true;

    try {
      // Add product to database
      const result = await this.productsManager.addProduct(productData);
      
      if (result.success) {
        this.helpers.showNotification('Продуктът е добавен успешно!', 'success');
        
        // Reset form
        e.target.reset();
        this.setMinDate();
        
        // Close modal if we're in one
        const modal = document.getElementById('addProductModal');
        if (modal) {
          modal.classList.add('hidden');
        }
        
        // Refresh data on current page if dashboard or other functions exist
        if (window.dashboard && typeof window.dashboard.loadData === 'function') {
          setTimeout(() => {
            window.dashboard.loadData();
          }, 500);
        }
        
        // If we're on a dedicated add-product page, redirect to dashboard
        if (window.location.pathname.includes('add-product.html')) {
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1500);
        }
      } else {
        this.helpers.showNotification('Грешка: ' + result.error, 'error');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      this.helpers.showNotification('Възникна грешка при добавяне на продукта', 'error');
    } finally {
      // Restore button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  handleQuickAdd(e) {
    const btn = e.target;
    const name = btn.dataset.name;
    const category = btn.dataset.category;
    const unit = btn.dataset.unit;

    // Fill form fields
    document.getElementById('productName').value = name;
    document.getElementById('productCategory').value = category;
    document.getElementById('productUnit').value = unit;
    document.getElementById('productQuantity').value = '1';

    // Set expiry date to 3 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    document.getElementById('expiryDate').value = expiryDate.toISOString().split('T')[0];

    // Focus on quantity field for easy modification
    document.getElementById('productQuantity').focus();
    document.getElementById('productQuantity').select();

    // Visual feedback
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      btn.style.transform = 'scale(1)';
    }, 100);
  }
}

// Initialize add product page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AddProductPage();
});
