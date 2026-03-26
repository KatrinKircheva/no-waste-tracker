module.exports = {
  ci: {
    collect: {
      url: [
        'https://no-waste-tracker.web.app',
        'https://no-waste-tracker.web.app/dashboard.html',
        'https://no-waste-tracker.web.app/add-product.html',
        'https://no-waste-tracker.web.app/stats.html',
        'https://no-waste-tracker.web.app/recipes.html'
      ],
      startServerCommand: 'npm run serve',
      startServerReadyPattern: 'Available on:',
      startServerReadyTimeout: 30000
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        'categories:pwa': 'off'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
