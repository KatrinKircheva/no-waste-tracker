// Helper Functions

// Date formatting
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  return date.toLocaleDateString('bg-BG', options);
}

// Calculate days left until expiry
function getDaysLeft(expiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// Get days left text
function getDaysLeftText(expiryDate) {
  const daysLeft = getDaysLeft(expiryDate);
  
  if (daysLeft < 0) {
    return `Изтекъл преди ${Math.abs(daysLeft)} дни`;
  } else if (daysLeft === 0) {
    return 'Изтича днес';
  } else if (daysLeft === 1) {
    return 'Изтича утре';
  } else if (daysLeft <= 7) {
    return `Остават ${daysLeft} дни`;
  } else {
    return `Остават ${daysLeft} дни`;
  }
}

// Get status badge HTML
function getStatusBadge(status) {
  const badges = {
    'safe': '<span class="status-safe">✅ Безопасно</span>',
    'use-soon': '<span class="status-use-soon">⚠️ Изтича скоро</span>',
    'expired': '<span class="status-expired">❌ Изтекъл</span>'
  };
  
  return badges[status] || '';
}

// Get category icon
function getCategoryIcon(category) {
  const icons = {
    'млечни': '🥛',
    'зеленчуци': '🥬',
    'плодове': '🍎',
    'месо': '🥩',
    'хляб': '🍞',
    'консерви': '🥫',
    'замразени': '🧊',
    'напитки': '🥤',
    'други': '📦'
  };
  
  return icons[category] || '📦';
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Style the notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 'bold',
    zIndex: '1000',
    maxWidth: '300px',
    wordWrap: 'break-word'
  });
  
  // Set background color based on type
  const colors = {
    'success': '#27ae60',
    'error': '#e74c3c',
    'warning': '#f39c12',
    'info': '#3498db'
  };
  
  notification.style.backgroundColor = colors[type] || colors.info;
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

// Show loading state
function showLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';
  }
}

// Show empty state
function showEmptyState(elementId, message = 'Няма данни за показване') {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-text">${message}</div>
      </div>
    `;
  }
}

// Debounce function for search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format quantity
function formatQuantity(quantity, unit) {
  if (quantity === Math.round(quantity)) {
    return `${quantity} ${unit}`;
  }
  return `${quantity.toFixed(1)} ${unit}`;
}

// Validate form data
function validateProductForm(formData) {
  const errors = [];
  
  if (!formData.name || formData.name.trim().length < 2) {
    errors.push('Името на продукта трябва да е поне 2 символа');
  }
  
  if (!formData.category) {
    errors.push('Изберете категория');
  }
  
  if (!formData.quantity || formData.quantity <= 0) {
    errors.push('Количеството трябва да е по-голямо от 0');
  }
  
  if (!formData.expiryDate) {
    errors.push('Изберете срок на годност');
  } else {
    const expiryDate = new Date(formData.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (expiryDate < today) {
      errors.push('Срокът на годност не може да е в миналото');
    }
  }
  
  return errors;
}

// Get quick tips
function getQuickTips() {
  return [
    {
      icon: '🥛',
      text: 'Използвайте млечните продукти първо, те се развалят най-бързо'
    },
    {
      icon: '🍞',
      text: 'Замразете хляба, за да удължите живота му с 2-3 седмици'
    },
    {
      icon: '🥬',
      text: 'Зеленчуците в хладилник трябва да са в отделение за свежи продукти'
    },
    {
      icon: '🥩',
      text: 'Месото може да се замразява до 6 месеца'
    },
    {
      icon: '🍎',
      text: 'Плодовете узряват по-бързо на стайна температура'
    },
    {
      icon: '🥫',
      text: 'Консервите имат дълъг срок, но след отваряне се съхраняват в хладилник'
    }
  ];
}

// Get random tips
function getRandomTips(count = 3) {
  const allTips = getQuickTips();
  const shuffled = [...allTips].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Export functions for use in other files
window.helpers = {
  formatDate,
  getDaysLeft,
  getDaysLeftText,
  getStatusBadge,
  getCategoryIcon,
  showNotification,
  showLoading,
  showEmptyState,
  debounce,
  formatQuantity,
  validateProductForm,
  getQuickTips,
  getRandomTips
};
