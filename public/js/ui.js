// UI Rendering Functions

class UIRenderer {
  constructor() {
    this.helpers = window.helpers;
  }

  // Render product card
  renderProductCard(product) {
    const statusClass = product.status;
    const daysLeftText = this.helpers.getDaysLeftText(product.expiryDate);
    const categoryIcon = this.helpers.getCategoryIcon(product.category);
    const statusBadge = this.helpers.getStatusBadge(product.status);

    return `
      <div class="product-card ${statusClass} fade-in" data-product-id="${product.id}">
        <div class="product-header">
          <div>
            <div class="product-name">${categoryIcon} ${product.name}</div>
            <div class="product-category">${product.category}</div>
          </div>
          ${statusBadge}
        </div>
        
        <div class="product-details">
          <div class="product-quantity">
            📊 Количество: ${this.helpers.formatQuantity(product.quantity, product.unit)}
          </div>
          <div class="product-expiry">
            📅 Срок: ${this.helpers.formatDate(product.expiryDate)}
          </div>
          <div class="days-left">
            ⏰ ${daysLeftText}
          </div>
          ${product.notes ? `<div class="product-notes">📝 ${product.notes}</div>` : ''}
        </div>
        
        <div class="product-actions">
            ${product.action === 'none' ? `
              <button class="action-btn btn-used" onclick="markProductUsed('${product.id}')">
                ✅ Използван
              </button>
              <button class="action-btn btn-thrown" onclick="markProductThrown('${product.id}')">
                ❌ Изхвърлен
              </button>
              <button class="action-btn btn-edit" onclick="editProduct('${product.id}')">
                ✏️ Редактирай
              </button>
              <button class="action-btn btn-delete" onclick="deleteProduct('${product.id}')">
                🗑️ Изтрий
              </button>
            ` : `
              <span class="action-result">
                ${product.action === 'used' ? '✅ Използван' : '❌ Изхвърлен'}
              </span>
            `}
          </div>
      </div>
    `;
  }

  // Render products list
  renderProducts(products, containerId, emptyMessage = 'Няма продукти за показване') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (products.length === 0) {
      this.helpers.showEmptyState(containerId, emptyMessage);
      return;
    }

    const productsHTML = products.map(product => this.renderProductCard(product)).join('');
    container.innerHTML = productsHTML;
  }

  // Render use today section
  renderUseToday(products) {
    const container = document.getElementById('useTodayProducts');
    if (!container) return;

    if (products.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🎉</div>
          <div class="empty-state-text">Няма спешни продукти за днес!</div>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(product => this.renderProductCard(product)).join('');
  }

  // Render summary cards
  renderSummaryCards(stats) {
    // Update expiring section cards only
    const expiringTotalElement = document.getElementById('expiringTotalProducts');
    const expiringSoonElement = document.getElementById('expiringExpiringSoon');
    const expiringUsedElement = document.getElementById('expiringUsedProducts');

    if (expiringTotalElement) {
      expiringTotalElement.textContent = stats.total;
      expiringTotalElement.style.color = '#333';
    }
    if (expiringSoonElement) {
      expiringSoonElement.textContent = stats.useSoon;
      expiringSoonElement.style.color = stats.useSoon > 0 ? '#e67e22' : '#333';
    }
    if (expiringUsedElement) {
      expiringUsedElement.textContent = stats.used;
      expiringUsedElement.style.color = stats.used > 0 ? '#27ae60' : '#333';
    }

    // Try to update original summary cards if they exist (for backward compatibility)
    const totalProductsElement = document.getElementById('totalProducts');
    const expiringSoonElement2 = document.getElementById('expiringSoon');
    const usedProductsElement = document.getElementById('usedProducts');
    const ecoScoreElement = document.getElementById('ecoScore');

    if (totalProductsElement) totalProductsElement.textContent = stats.total;
    if (expiringSoonElement2) expiringSoonElement2.textContent = stats.useSoon;
    if (usedProductsElement) usedProductsElement.textContent = stats.used;
    if (ecoScoreElement) {
      ecoScoreElement.textContent = stats.ecoScore;
      // Add color coding to eco score
      if (stats.ecoScore >= 80) {
        ecoScoreElement.style.color = 'var(--safe-color)';
      } else if (stats.ecoScore >= 50) {
        ecoScoreElement.style.color = 'var(--use-soon-color)';
      } else {
        ecoScoreElement.style.color = 'var(--expired-color)';
      }
    }
  }

  // Render quick tips
  renderQuickTips() {
    const container = document.getElementById('quickTips');
    if (!container) return;

    const tips = this.helpers.getRandomTips(3);
    const tipsHTML = tips.map(tip => `
      <div class="tip-card fade-in">
        <div class="tip-icon">${tip.icon}</div>
        <div class="tip-text">${tip.text}</div>
      </div>
    `).join('');

    container.innerHTML = tipsHTML;
  }

  // Render statistics page
  renderStatistics(stats) {
    // Update summary cards
    this.renderSummaryCards(stats);

    // Render detailed stats
    const statsContainer = document.getElementById('detailedStats');
    if (statsContainer) {
      const usedPercentage = stats.total > 0 ? Math.round((stats.used / stats.total) * 100) : 0;
      const thrownPercentage = stats.total > 0 ? Math.round((stats.thrown / stats.total) * 100) : 0;
      const activePercentage = stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0;

      statsContainer.innerHTML = `
        <div class="stats-grid">
          <div class="stat-card">
            <h3>📊 Обща статистика</h3>
            <div class="stat-item">
              <span>Общо продукти:</span>
              <span class="stat-value">${stats.total}</span>
            </div>
            <div class="stat-item">
              <span>Активни:</span>
              <span class="stat-value">${stats.active}</span>
            </div>
            <div class="stat-item">
              <span>Използвани:</span>
              <span class="stat-value">${stats.used}</span>
            </div>
            <div class="stat-item">
              <span>Изхвърлени:</span>
              <span class="stat-value">${stats.thrown}</span>
            </div>
          </div>

          <div class="stat-card">
            <h3>📈 Проценти</h3>
            <div class="progress-bar">
              <div class="progress-segment used" style="width: ${usedPercentage}%"></div>
              <div class="progress-segment active" style="width: ${activePercentage}%"></div>
              <div class="progress-segment thrown" style="width: ${thrownPercentage}%"></div>
            </div>
            <div class="legend">
              <div class="legend-item">
                <span class="legend-color used"></span>
                <span>Използвани (${usedPercentage}%)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color active"></span>
                <span>Активни (${activePercentage}%)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color thrown"></span>
                <span>Изхвърлени (${thrownPercentage}%)</span>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <h3>🌍 Eco Impact</h3>
            <div class="eco-score-display">
              <div class="eco-score-circle">
                <span class="eco-score-number">${stats.ecoScore}</span>
                <span class="eco-score-label">Eco Score</span>
              </div>
              <div class="eco-message">
                ${this.getEcoMessage(stats.ecoScore)}
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Get eco message based on score
  getEcoMessage(score) {
    if (score >= 80) {
      return '🌟 Отлично! Ти си истински еко герой!';
    } else if (score >= 60) {
      return '👍 Добре! Продължавай в същия дух!';
    } else if (score >= 40) {
      return '💪 Може и по-добре! Опитай да използваш повече продукти!';
    } else {
      return '🎯 Време за промяна! Фокусирай се върху намаляване на отпадъците!';
    }
  }

  // Update product status in UI
  updateProductStatus(productId, action) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (!productCard) return;

    const actionsContainer = productCard.querySelector('.product-actions');
    if (actionsContainer) {
      actionsContainer.innerHTML = `
        <span class="action-result">
          ${action === 'used' ? '✅ Използван' : '❌ Изхвърлен'}
        </span>
      `;
    }

    // Add fade effect
    productCard.style.opacity = '0.7';
    productCard.style.transform = 'scale(0.98)';
  }

  // Filter products
  filterProducts(filter) {
    const allCards = document.querySelectorAll('.product-card');
    
    allCards.forEach(card => {
      if (filter === 'all') {
        card.style.display = 'block';
      } else {
        const cardStatus = card.classList.contains('expired') ? 'expired' :
                          card.classList.contains('use-soon') ? 'use-soon' : 'safe';
        
        if (cardStatus === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      }
    });
  }
}

// Initialize UI renderer
window.uiRenderer = new UIRenderer();
