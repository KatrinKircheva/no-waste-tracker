// Statistics Page Logic
class StatisticsPage {
  constructor() {
    this.productsManager = window.productsManager;
    this.uiRenderer = window.uiRenderer;
    this.helpers = window.helpers;
    this.chart = null;
    
    this.init();
  }

  async init() {
    await this.loadData();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Refresh button (if exists)
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.loadData());
    }
  }

  async loadData() {
    try {
      // Show loading states
      this.helpers.showLoading('detailedStats');

      // Load data
      const stats = await this.productsManager.getStatistics();
      const allProducts = await this.productsManager.getProducts();

      // Update UI
      this.uiRenderer.renderSummaryCards(stats);
      this.uiRenderer.renderStatistics(stats);
      this.renderChart(stats);
      this.renderImprovementTips(stats);

    } catch (error) {
      console.error('Error loading statistics:', error);
      this.helpers.showNotification('Грешка при зареждане на статистиката', 'error');
    }
  }

  renderChart(stats) {
    const ctx = document.getElementById('wasteChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    // Create new chart
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Използвани', 'Активни', 'Изхвърлени'],
        datasets: [{
          data: [stats.used, stats.active, stats.thrown],
          backgroundColor: [
            '#27ae60',  // used - green
            '#2ecc71',  // active - light green
            '#e74c3c'   // thrown - red
          ],
          borderColor: '#1a1a1a',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#ffffff',
              padding: 20,
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  renderImprovementTips(stats) {
    const container = document.getElementById('improvementTips');
    if (!container) return;

    const tips = this.getImprovementTips(stats);
    const tipsHTML = tips.map(tip => `
      <div class="tip-card fade-in">
        <div class="tip-icon">${tip.icon}</div>
        <div class="tip-text">${tip.text}</div>
      </div>
    `).join('');

    container.innerHTML = tipsHTML;
  }

  getImprovementTips(stats) {
    const tips = [];

    // Based on eco score
    if (stats.ecoScore < 50) {
      tips.push({
        icon: '🎯',
        text: 'Фокусирайте се върху използването на продукти преди изтичане на срока им'
      });
    }

    if (stats.ecoScore < 70) {
      tips.push({
        icon: '📋',
        text: 'Правете седмичен план за хранене, за да използвате всичко, което купувате'
      });
    }

    if (stats.thrown > stats.used) {
      tips.push({
        icon: '🥛',
        text: 'Проверявайте редовно хладилника и използвайте млечните продукти първо'
      });
    }

    if (stats.expiringSoon > 3) {
      tips.push({
        icon: '⚠️',
        text: 'Имате много продукти, които изтичат скоро. Време за готвене!'
      });
    }

    // General tips
    tips.push({
      icon: '🍞',
      text: 'Замразявайте хляба и тестените изделия, за да удължите живота им'
    });

    tips.push({
      icon: '🥬',
      text: 'Съхранявайте зеленчуците правилно, за да останат свежи по-дълго'
    });

    if (stats.ecoScore >= 80) {
      tips.push({
        icon: '🌟',
        text: 'Отлична работа! Продължавайте в същия дух и вдъхновявайте другите!'
      });
    }

    return tips.slice(0, 4); // Return max 4 tips
  }

  // Export statistics as data (for future features)
  exportStatistics() {
    const stats = {
      date: new Date().toISOString(),
      total: document.getElementById('totalProducts').textContent,
      used: document.getElementById('usedProducts').textContent,
      thrown: document.getElementById('expiringSoon').textContent,
      ecoScore: document.getElementById('ecoScore').textContent
    };

    const dataStr = JSON.stringify(stats, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `no-waste-stats-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  // Calculate weekly trend (mock data for demo)
  calculateWeeklyTrend() {
    // In a real app, this would fetch historical data
    return {
      labels: ['Пон', 'Вт', 'Ср', 'Чет', 'Пет', 'Съб', 'Нед'],
      used: [2, 3, 1, 4, 2, 3, 2],
      thrown: [1, 0, 2, 1, 0, 1, 0]
    };
  }
}

// Initialize statistics page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.statisticsPage = new StatisticsPage();
});

// Export function for potential use from other pages
window.exportStatistics = function() {
  if (window.statisticsPage) {
    window.statisticsPage.exportStatistics();
  }
};
