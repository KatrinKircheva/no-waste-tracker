// Recipes Page Logic
class RecipesPage {
  constructor() {
    this.productsManager = window.productsManager;
    this.helpers = window.helpers;
    this.availableProducts = [];
    this.recipes = this.getRecipes();
    this.currentFilter = 'all';
    
    this.init();
  }

  async init() {
    await this.loadProducts();
    this.setupEventListeners();
    this.renderRecipes();
  }

  setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Filter recipes
        this.currentFilter = e.target.dataset.filter;
        this.renderRecipes();
      });
    });
  }

  async loadProducts() {
    try {
      this.availableProducts = await this.productsManager.getProducts();
      this.renderAvailableIngredients();
    } catch (error) {
      console.error('Error loading products:', error);
      this.helpers.showNotification('Грешка при зареждане на продуктите', 'error');
    }
  }

  renderAvailableIngredients() {
    const container = document.getElementById('availableIngredients');
    const countElement = document.getElementById('ingredientsCount');
    
    if (!container) return;

    const activeProducts = this.availableProducts.filter(p => p.action === 'none');
    
    if (activeProducts.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary);">Няма налични продукти</p>';
      countElement.textContent = '0 налични продукта';
      return;
    }

    const ingredientsHTML = activeProducts.map(product => {
      const status = this.productsManager.determineStatus(product.expiryDate);
      const statusClass = status === 'use-soon' ? 'use-soon' : '';
      const icon = this.helpers.getCategoryIcon(product.category);
      
      return `
        <span class="ingredient-tag ${statusClass}">
          ${icon} ${product.name}
        </span>
      `;
    }).join('');

    container.innerHTML = ingredientsHTML;
    countElement.textContent = `${activeProducts.length} налични продукта`;
  }

  getRecipes() {
    return [
      {
        id: 1,
        name: "Класически омлет",
        difficulty: "easy",
        time: "15 мин",
        servings: "2 порции",
        ingredients: ["яйца", "сирене", "мляко"],
        instructions: "Разбийте яйцата с мляко и подправки. Загрейте тиган с малко масло. Изсипете сместа и гответе на среден огън. Добавете сиренето отгоре и сгънете наполовина.",
        category: "закуска"
      },
      {
        id: 2,
        name: "Салата Капрезе",
        difficulty: "easy",
        time: "10 мин",
        servings: "2 порции",
        ingredients: ["домати", "сирене"],
        instructions: "Нарежете доматите и сиренето на кръгчета. Подредете ги редувайки се в чиния. Поръсете със зехтин и черен пипер.",
        category: "салата"
      },
      {
        id: 3,
        name: "Гръцка салата",
        difficulty: "easy",
        time: "15 мин",
        servings: "4 порции",
        ingredients: ["домати", "сирене"],
        instructions: "Нарежете доматите на парчета и сиренето на кубчета. Смесете ги в купа и добавете зехтин, оцет и подправки.",
        category: "салата"
      },
      {
        id: 4,
        name: "Сандвич със сирене",
        difficulty: "easy",
        time: "5 мин",
        servings: "1 порция",
        ingredients: ["хляб", "сирене"],
        instructions: "Нарежете хляба на резени. Поставете сиренето между две резени. Може да го запечете в тостер за по-добър вкус.",
        category: "закуска"
      },
      {
        id: 5,
        name: "Пълнени домати",
        difficulty: "medium",
        time: "30 мин",
        servings: "4 порции",
        ingredients: ["домати", "сирене"],
        instructions: "Изчистете доматите от сърцевината. Смесете натрошеното сирене с подправки и пълнете доматите. Печете на 180°C за 20 минути.",
        category: "основно"
      },
      {
        id: 6,
        name: "Сирена пита",
        difficulty: "medium",
        time: "45 мин",
        servings: "6 порции",
        ingredients: ["хляб", "сирене", "яйца", "мляко"],
        instructions: "Нарежете хляба на кубчета. Смесете яйцата, млякото и натрошеното сирене. Залейте хляба със сместа и печете до златисто.",
        category: "основно"
      },
      {
        id: 7,
        name: "Млечен шейк",
        difficulty: "easy",
        time: "5 мин",
        servings: "1 порция",
        ingredients: ["мляко", "яйца"],
        instructions: "Смесете млякото и яйцата в блендер. Добавете мед или плодове по желание. Разбийте до получаване на хомогенна смес.",
        category: "напитка"
      },
      {
        id: 8,
        name: "Розени сирена",
        difficulty: "easy",
        time: "10 мин",
        servings: "2 порции",
        ingredients: ["сирене", "яйца"],
        instructions: "Разбийте яйцата. Натрошете сиренето и го оваляйте в яйцата. Запържете в загрят тиган до златисто.",
        category: "закуска"
      },
      {
        id: 9,
        name: "Домати с пълнеж",
        difficulty: "medium",
        time: "25 мин",
        servings: "4 порции",
        ingredients: ["домати", "яйца", "сирене"],
        instructions: "Изчистете доматите. Смесете натрошеното сирене със сварени и натрошени яйца. Пълнете доматите и печете.",
        category: "основно"
      },
      {
        id: 10,
        name: "Хляб със сирене на фурна",
        difficulty: "easy",
        time: "15 мин",
        servings: "4 порции",
        ingredients: ["хляб", "сирене"],
        instructions: "Нарежете хляба на резени. Поръсете с натрошено сирене и малко масло. Печете на 180°C до златисто.",
        category: "закуска"
      }
    ];
  }

  calculateMatchPercentage(recipe) {
    const availableIngredients = this.availableProducts
      .filter(p => p.action === 'none')
      .map(p => p.name.toLowerCase());
    
    const requiredIngredients = recipe.ingredients.map(i => i.toLowerCase());
    
    let matchCount = 0;
    requiredIngredients.forEach(ingredient => {
      if (availableIngredients.some(available => available.includes(ingredient) || ingredient.includes(available))) {
        matchCount++;
      }
    });
    
    return Math.round((matchCount / requiredIngredients.length) * 100);
  }

  filterRecipes() {
    let filteredRecipes = [...this.recipes];
    
    // Filter by difficulty
    if (this.currentFilter !== 'all') {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.difficulty === this.currentFilter);
    }
    
    // Sort by match percentage
    filteredRecipes.sort((a, b) => {
      const matchA = this.calculateMatchPercentage(a);
      const matchB = this.calculateMatchPercentage(b);
      return matchB - matchA;
    });
    
    return filteredRecipes;
  }

  renderRecipes() {
    const container = document.getElementById('recipesGrid');
    const noRecipesElement = document.getElementById('noRecipes');
    
    if (!container) return;

    const filteredRecipes = this.filterRecipes();
    const availableIngredients = this.availableProducts
      .filter(p => p.action === 'none')
      .map(p => p.name.toLowerCase());

    if (filteredRecipes.length === 0) {
      container.style.display = 'none';
      noRecipesElement.style.display = 'block';
      return;
    }

    container.style.display = 'grid';
    noRecipesElement.style.display = 'none';

    const recipesHTML = filteredRecipes.map(recipe => {
      const matchPercentage = this.calculateMatchPercentage(recipe);
      const difficultyText = {
        'easy': 'Лесно',
        'medium': 'Средно',
        'hard': 'Трудно'
      };

      const ingredientsHTML = recipe.ingredients.map(ingredient => {
        const isAvailable = availableIngredients.some(available => 
          available.includes(ingredient.toLowerCase()) || 
          ingredient.toLowerCase().includes(available)
        );
        const className = isAvailable ? 'available' : 'missing';
        return `<span class="ingredient-item ${className}">${ingredient}</span>`;
      }).join('');

      return `
        <div class="recipe-card fade-in">
          <div class="recipe-header">
            <div class="recipe-title">${recipe.name}</div>
            <div class="recipe-meta">
              <span>⏱️ ${recipe.time}</span>
              <span>👥 ${recipe.servings}</span>
              <span>📊 ${difficultyText[recipe.difficulty]}</span>
            </div>
          </div>
          
          <div class="recipe-body">
            <div class="recipe-ingredients">
              <h4>Продукти:</h4>
              <div class="ingredient-list">
                ${ingredientsHTML}
              </div>
            </div>
            
            <div class="recipe-instructions">
              <h4>Начин на приготвяне:</h4>
              <p>${recipe.instructions}</p>
            </div>
          </div>
          
          <div class="recipe-actions">
            <div class="match-percentage">
              <span>Съвпадение:</span>
              <span><strong>${matchPercentage}%</strong></span>
            </div>
            <div class="match-bar">
              <div class="match-fill" style="width: ${matchPercentage}%"></div>
            </div>
            <button class="cook-btn" onclick="markRecipeAsCooked(${recipe.id})">
              👨‍🍳 Гответе това
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = recipesHTML;
  }

  async markRecipeAsCooked(recipeId) {
    try {
      const recipe = this.recipes.find(r => r.id === recipeId);
      if (!recipe) return;

      // Mark used ingredients
      const availableIngredients = this.availableProducts.filter(p => p.action === 'none');
      const usedIngredients = [];

      recipe.ingredients.forEach(ingredient => {
        const matchingProduct = availableIngredients.find(p => 
          p.name.toLowerCase().includes(ingredient.toLowerCase()) || 
          ingredient.toLowerCase().includes(p.name.toLowerCase())
        );
        
        if (matchingProduct) {
          usedIngredients.push(matchingProduct);
        }
      });

      // Update products in database
      for (const product of usedIngredients) {
        await this.productsManager.updateProductAction(product.id, 'used');
      }

      // Show success message
      this.helpers.showNotification(
        `Отлично! Използвахте ${usedIngredients.length} продукта за ${recipe.name}!`, 
        'success'
      );

      // Reload data
      await this.loadProducts();
      this.renderRecipes();

    } catch (error) {
      console.error('Error marking recipe as cooked:', error);
      this.helpers.showNotification('Грешка при маркиране на рецептата', 'error');
    }
  }
}

// Global function for recipe cooking
window.markRecipeAsCooked = function(recipeId) {
  if (window.recipesPage) {
    window.recipesPage.markRecipeAsCooked(recipeId);
  }
};

// Initialize recipes page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.recipesPage = new RecipesPage();
});
