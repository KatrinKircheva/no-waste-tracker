# 🔥 Firebase Настройка - Подробно упътване

## Стъпка 1: Създаване на Firebase проект

1. **Отидете на [Firebase Console](https://console.firebase.google.com/)**
2. **Влезте с вашия Google акаунт**
3. **Натиснете "Add project" или "Създай проект"**
4. **Въведете име на проекта:** `no-waste-tracker-hackathon`
5. **Продължете с настройките:**
   - Може да оставите Google Analytics включено (не е задължително)
   - Изберете съществуващ или създайте нов Google Analytics акаунт
6. **Натиснете "Create project"** и изчакайте няколко минути

## Стъпка 2: Активиране на Firestore Database

### 🔍 Къде да намерите Firestore Database:

**Точният път в текущия Firebase интерфейс:**
1. **В лявото меню търсете иконата с база данни 📊**
2. **Кликнете върху нея - ще отвори Firestore секция**
3. **Ако няма създадена база данни, ще видите бутон "Create database"**
4. **Натиснете "Create database"**

### 🚀 Активиране на базата данни:
1. **Натиснете "Create database"**
2. **Изберете "Start in test mode"** (за хакатона е окей):
   ```
   Allow read, write access to all users
   ```
3. **Изберете локация за базата данни:**
   - Изберете `europe-west1` (Белгия) или `europe-west3` (Германия)
4. **Натиснете "Enable"**

**Важно:** Използвайте "Firestore Database", а не "Realtime Database" или "Storage".

### 📍 Ако не намирате Database:
- **Проверете горната част на менюто** за икона 📊
- **Търсете "Firestore" в лявото меню**
- **Натиснете "All products" за да видите всички опции**
- **Ако все още не виждате, опитайте:** Project Overview → Get started by adding Firebase

## Стъпка 3: Копиране на конфигурация

1. **В лявото меню отидете на "Project Overview" (икона със зъбно колело) → "Project settings"**
2. **Отидете в секция "Your apps"**
3. **Ако няма уеб приложение, натиснете "</> Web" и добавете го:**
   - App nickname: `No Waste Tracker`
   - Не маркирайте "Firebase Hosting" все още
4. **След като създадете приложението, ще видите конфигурация**
5. **Копирайте `firebaseConfig` обекта**

## Стъпка 4: Обновяване на конфигурацията

Отворете `public/js/firebase-config.js` и заменете съдържанието с вашата реална конфигурация:

```javascript
// Firebase Configuration
const firebaseConfig = {
  apiKey: "ВАШИЯТ_API_КЛЮЧ",
  authDomain: "ВАШИЯТ-ПРОЕКТ.firebaseapp.com",
  projectId: "ВАШИЯТ-ПРОЕКТ",
  storageBucket: "ВАШИЯТ-ПРОЕКТ.appspot.com",
  messagingSenderId: "ВАШИЯТ_SENDER_ID",
  appId: "ВАШИЯТ_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Demo user ID за хакатон
const DEMO_USER_ID = "demo_user_hackathon";

// Helper function
function getCurrentUserId() {
  return DEMO_USER_ID;
}

// Export
window.firebaseConfig = {
  db,
  getCurrentUserId,
  DEMO_USER_ID
};
```

## Стъпка 5: Добавяне на Firebase SDK

Уверете се, че в `dashboard.html` и `add-product.html` имате правилните Firebase скриптове:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js"></script>
```

## Стъпка 6: Тестване на връзката

1. **Отворете `dashboard.html` в браузър**
2. **Отворете Developer Console (F12)**
3. **Погледнете в Console таба за грешки**
4. **Ако всичко е наред, трябва да видите само вашите UI елементи**

## Стъпка 7: Проверка на Firestore

1. **Отидете обратно в Firebase Console**
2. **В лявото меню → Firestore Database**
3. **Трябва да видите "Data" таб**
4. **След като добавите първи продукт, ще се появи колекция "products"**

## 🔧 Допълнителни настройки (по желание)

### Security Rules (за реално приложение)

В Firestore → Rules таб, заменете съдържанието с:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### Firebase Hosting (за deploy)

1. **Инсталирайте Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Логнете се:**
   ```bash
   firebase login
   ```

3. **Инициализирайте хостинг:**
   ```bash
   firebase init hosting
   ```
   - Изберете вашия проект
   - Публична директория: `public`
   - Конфигурирайте като single-page app
   - Не overwrite index.html

4. **Deploy:**
   ```bash
   firebase deploy
   ```

## 🚨 Важни бележки за хакатона

1. **Test mode е достатъчен** - не се притеснявайте за security rules
2. **Може да използвате demo user ID** - не е нужна реална аутентикация
3. **Ако имате проблеми с API ключовете**, може да използвате localStorage за demo

## 🐞 Чести проблеми и решения

### Проблем: "Firebase is not defined"
**Решение:** Проверете дали сте добавили Firebase скриптовете преди вашите JS файлове

### Проблем: "Missing or insufficient permissions"
**Решение:** Уверете се, че сте в Test mode в Firestore rules

### Проблем: Нищо не се запазва в базата
**Решение:** Проверете конзолата за грешки и уверете се, че конфигурацията е правилна

### Проблем: CORS грешки
**Решение:** Уверете се, че използвате localhost или deploy-нете през Firebase Hosting

## 📋 Чеклист за готовност

- [ ] Създаден Firebase проект
- [ ] Активирана Firestore Database в test mode
- [ ] Копирана конфигурация в firebase-config.js
- [ ] Добавени Firebase SDK скриптове
- [ ] Тествана връзката с базата
- [ ] Добавен първи продукт успешно
- [ ] Проверени данни в Firestore Console

## 🚀 Следващи стъпки

След като Firebase е настроен:
1. Тествайте добавяне на продукти
2. Проверете дали се появяват в dashboard
3. Тествайте маркиране като използван/изхвърлен

---

## Стъпка 6: Разбиране на DEMO_USER_ID

### 🎯 Как работи демо режимът:

**Къде е дефиниран:**
В `public/js/firebase-config.js` на ред 19:
```javascript
const DEMO_USER_ID = "demo_user_hackathon";
```

### 🔧 Как се използва:
Това е **фиктивен потребителски ID** за хакатона, който:
- **Не създава реален потребител** във Firebase Authentication
- **Използва се само в Firestore** като уникален идентификатор
- **Позволява съхранение на данни** без нужда от реална регистрация

### 💡 Защо е направено така:
1. **По-бързо за хакатон** - не се налага да създавате Authentication
2. **По-лесно за тестване** - всички данни са на едно място
3. **Без сложна логика** - директно работи с базата данни

### 📊 Как изглежда във Firestore:
```
products/
  └── demo_user_hackathon/
      ├── product_123/
      ├── product_456/
      └── product_789/
```

### ✅ Всичко работи автоматично:
1. **Отворете приложението**
2. **Добавяйте продукти**
3. **Данните се съхраняват** с `demo_user_hackathon`

Няма нужда да създавате потребител ръчно - това е "магията" на демо режима! 🎩✨

---

## Стъпка 7: Firebase Hosting Deploy

### 🚀 **Пълно упътване за deploy**

#### **📋 Предварителни изисквания:**
1. **Node.js инсталиран** (ако го нямате)
2. **Firebase CLI инсталиран**
3. **Проектът готов за deploy**

#### **Стъпка 1: Инсталиране на Firebase CLI**

**Ако нямате Node.js:**
1. **Изтеглете от:** https://nodejs.org/
2. **Инсталирайте LTS версията**

**Инсталиране на Firebase CLI:**
```bash
# Отворете Command Prompt / PowerShell
npm install -g firebase-tools
```

#### **Стъпка 2: Логин във Firebase**

```bash
firebase login
```
- **Ще отвори браузър**
- **Логнете се с Google акаунта**
- **Разрешете достъп**

#### **Стъпка 3: Инициализация на хостинг**

```bash
# Отидете в папката с проекта
cd D:\kati\tues\hack-tues-2026

# Инициализирайте хостинг
firebase init hosting
```

**Отговорете на въпросите:**
1. **Are you ready to proceed?** → `Yes`
2. **Please select an option:** → `Use an existing project`
3. **Select a default Firebase project...** → `no-waste-tracker` (вашият проект)
4. **What do you want to use as your public directory?** → `public`
5. **Configure as a single-page app?** → `No`
6. **File public/index.html already exists...** → `Overwrite` → `No`
7. **Configure with a single GitHub repository?** → `No`

#### **Стъпка 4: Проверка на конфигурацията**

Проверете `firebase.json` файла:
```json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": []
  }
}
```

#### **Стъпка 5: Deploy на проекта**

```bash
# Deploy
firebase deploy
```

**Ще видите:**
```
=== Deploying to 'no-waste-tracker'...

i  deploying hosting
i  hosting[no-waste-tracker]: beginning public.deploy...
i  hosting[no-waste-tracker]: 37 files uploaded successfully
i  hosting[no-waste-tracker]: finalize deployment...

✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/no-waste-tracker/overview
Hosting URL: https://no-waste-tracker.web.app
```

#### **Стъпка 6: Тестване**

1. **Отворете:** `https://no-waste-tracker.web.app`
2. **Тествайте всички функционалности**
3. **Проверете дали Firebase работи**

### 🔧 **Ако има проблеми:**

#### **Проблем 1: Грешка в deploy**
```bash
# Изтрийте кеша и опитайте отново
firebase logout
firebase login
firebase deploy
```

#### **Проблем 2: Грешен проект**
```bash
# Променете проекта
firebase use --add
# Изберете правилния проект
```

#### **Проблем 3: Firebase rules грешки**
- **Отидете във Firebase Console**
- **Firestore → Rules**
- **Уверете се, че сте в test mode**

### 📱 **Мобилно тестване:**

**С PWA (Progressive Web App):**
1. **Отворете сайта на мобилен телефон**
2. **Добавете към Home Screen**
3. **Ще работи като приложение**

### ⚡ **Бърз deploy (за бъдещи промени):**

```bash
# След всяка промяна
firebase deploy
```

### 🔥 **Алтернативен бърз начин:**

Ако имате проблеми с CLI, може да използвате **Firebase Console Hosting**:

1. **Отидете във Firebase Console**
2. **Hosting → Get started**
3. **Качете `public` папката като ZIP**
4. **Deploy**

### ✅ **Готово!**

След успешен deploy ще имате:
- **Работещо уеб приложение**
- **URL за демонстрация**
- **Готовност за хакатон**

---

## Стъпка 8: Deploy от различен Branch

### 🌿 **Различни начини за deploy от branch-ове**

#### **Метод 1: Ръчно смяна на branch**

```bash
# 1. Сменете на желания branch
git checkout your-branch-name

# 2. Deploy от този branch
firebase deploy
```

#### **Метод 2: GitHub Actions автоматизация**

Създайте `.github/workflows/deploy.yml` (вече създаден):

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [ main, develop, staging ]
  pull_request:
    branches: [ main ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install Firebase CLI
      run: npm install -g firebase-tools
      
    - name: Deploy to Firebase Hosting
      run: |
        if [[ $GITHUB_REF == 'refs/heads/main' ]]; then
          firebase deploy --project no-waste-tracker --only hosting
        elif [[ $GITHUB_REF == 'refs/heads/develop' ]]; then
          firebase deploy --project no-waste-tracker-dev --only hosting
        elif [[ $GITHUB_REF == 'refs/heads/staging' ]]; then
          firebase deploy --project no-waste-tracker-staging --only hosting
        fi
      env:
        FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

#### **Метод 3: Множество Firebase проекти**

Създайте отделни проекти за различни environments:

1. **Production:** `no-waste-tracker`
2. **Staging:** `no-waste-tracker-staging`
3. **Development:** `no-waste-tracker-dev`

**Конфигурация в `firebase-multi-project.json`:**
```json
{
  "projects": {
    "production": {
      "project": "no-waste-tracker",
      "hosting": {
        "target": "production",
        "public": "public"
      }
    },
    "staging": {
      "project": "no-waste-tracker-staging", 
      "hosting": {
        "target": "staging",
        "public": "public"
      }
    },
    "development": {
      "project": "no-waste-tracker-dev",
      "hosting": {
        "target": "development", 
        "public": "public"
      }
    }
  }
}
```

#### **Метод 4: Автоматичен скрипт**

Използвайте `deploy-branch.js` (вече създаден):

```bash
# Инсталирайте dependencies
npm install

# Изпълнете скрипта
node deploy-branch.js
```

**Скриптът автоматично:**
- Определя текущия branch
- Избира правилния Firebase проект
- Deploy-ва към правилния environment

### 🔧 **Настройка на GitHub Actions**

1. **Създайте Firebase Service Account:**
   - Отидете в Firebase Console
   - Project Settings → Service accounts
   - Generate new private key
   - Запазете JSON файла

2. **Добавете GitHub Secret:**
   - Отидете в GitHub репозитори
   - Settings → Secrets and variables → Actions
   - Add new repository secret
   - Име: `FIREBASE_TOKEN`
   - Стойност: Generate token с `firebase login:ci`

3. **Създайте допълнителни проекти:**
   ```bash
   # Staging проект
   firebase projects create no-waste-tracker-staging
   firebase use no-waste-tracker-staging
   firebase init hosting
   
   # Development проект  
   firebase projects create no-waste-tracker-dev
   firebase use no-waste-tracker-dev
   firebase init hosting
   ```

### 📋 **Branch Strategy**

Препоръчителна структура:

```bash
main           # Production - https://no-waste-tracker.web.app
├── develop     # Development - https://no-waste-tracker-dev.web.app
├── staging     # Staging - https://no-waste-tracker-staging.web.app
└── feature/*   # Feature branches -> development
```

### ⚡ **Бързи команди**

```bash
# Deploy от текущ branch
node deploy-branch.js

# Force deploy към конкретен проект
firebase deploy --project no-waste-tracker-dev

# Deploy само hosting (без functions)
firebase deploy --only hosting

# Deploy с preview URL
firebase hosting:channel:deploy feature-branch
```

### 🎯 **За Hack TUES 12**

За хакатона може да използвате:
- **Main branch** за финална демонстрация
- **Feature branches** за тестване
- **Manual deploy** е достатъчен

---

## Стъпка 9: Автоматични Builds и Deploys с GitHub

### 🚀 **Пълен CI/CD Pipeline**

Създадохме автоматизирана система за builds и deploys с GitHub Actions:

#### **📁 Създадени файлове:**

1. **`.github/workflows/ci-cd.yml`** - Основен CI/CD pipeline
2. **`.github/workflows/quality-checks.yml`** - Quality checks и security
3. **`public/package.json`** - Dependencies и scripts
4. **`public/lighthouserc.js`** - Lighthouse performance конфигурация

#### **🔄 Как работи автоматизацията:**

**При push към branch:**
1. **Build & Test** - Валидация на HTML/CSS/JS
2. **Security Audit** - Проверка за уязвимости
3. **Quality Checks** - Performance и accessibility
4. **Deploy** - Автоматичен deploy към правилния environment
5. **Lighthouse** - Performance audit (само за main)

**При Pull Request:**
1. **Preview Deploy** - Временен URL за ревю
2. **Auto-comment** - Автоматичен коментар с preview линк
3. **Quality Checks** - Проверка преди merge

#### **🎯 Environment Mapping:**

```yaml
main     → Production  → https://no-waste-tracker.web.app
develop   → Development → https://no-waste-tracker-dev.web.app  
staging   → Staging     → https://no-waste-tracker-staging.web.app
PR #123   → Preview     → https://no-waste-tracker--pr-123.web.app
```

#### **⚙️ Настройка на GitHub Actions:**

**1. Firebase Token:**
```bash
# Генерирайте CI token
firebase login:ci

# Копирайте токена и го добавете като GitHub Secret:
# Repository → Settings → Secrets → New repository secret
# Name: FIREBASE_TOKEN
# Value: <вашият-токен>
```

**2. Допълнителни проекти (ако ги нямате):**
```bash
# Development проект
firebase projects create no-waste-tracker-dev
firebase use no-waste-tracker-dev
firebase init hosting

# Staging проект  
firebase projects create no-waste-tracker-staging
firebase use no-waste-tracker-staging
firebase init hosting
```

#### **🔍 Quality Checks включват:**

**HTML Validation:**
- ✅ DOCTYPE presence
- ✅ Viewport meta tag
- ✅ Charset declaration
- ✅ Semantic HTML5 elements

**CSS Validation:**
- ✅ CSS variables usage
- ✅ Media queries for responsive design
- ✅ File size optimization

**JavaScript Validation:**
- ✅ Syntax checking
- ✅ Modern JS features
- ✅ No console.log in production

**Security Checks:**
- 🔒 Hardcoded secrets detection
- 🔒 Dependency vulnerability scan
- 🔒 npm audit with high severity alerts

**Performance Checks:**
- ⚡ Image optimization
- ⚡ File size analysis
- ⚡ Minification recommendations

**Accessibility Checks:**
- ♿ Alt attributes for images
- ♿ Semantic HTML structure
- ♿ Screen reader compatibility

#### **📊 Lighthouse Performance Audit:**

**Автоматично за main branch:**
- Performance score (минимум 80)
- Accessibility score (минимум 90)
- Best practices score (минимум 80)
- SEO score (минимум 80)
- PWA checks (изключени за хакатон)

#### **🚀 Preview Deploy за Pull Requests:**

**При създаване на PR:**
1. **Автоматичен preview deploy**
2. **Коментар с preview URL**
3. **7 дни lifetime**
4. **Изтича автоматично**

**Пример коментар:**
```markdown
## 🚀 Preview Deploy Ready!

**Pull Request:** #123
**Branch:** feature/new-recipe-system

**Preview URL:** https://no-waste-tracker--pr-123.web.app

⏰ This preview will expire in 7 days.

---

🤖 *Deployed automatically via GitHub Actions*
```

#### **📱 Local Development Scripts:**

**В `public/package.json`:**
```json
{
  "scripts": {
    "start": "python -m http.server 8080",
    "serve": "npx http-server -p 8080 -c-1",
    "deploy": "firebase deploy",
    "deploy:preview": "firebase hosting:channel:deploy preview",
    "deploy:dev": "firebase deploy --project no-waste-tracker-dev",
    "deploy:staging": "firebase deploy --project no-waste-tracker-staging",
    "deploy:prod": "firebase deploy --project no-waste-tracker"
  }
}
```

#### **🔧 Бързи команди:**

```bash
# Local development
cd public
npm run serve

# Deploy към development
npm run deploy:dev

# Deploy към staging  
npm run deploy:staging

# Deploy към production
npm run deploy:prod

# Preview deploy
npm run deploy:preview
```

#### **📈 Monitoring и Alerts:**

**GitHub Actions предоставя:**
- ✅ Build status badges
- ✅ Failure notifications
- ✅ Performance metrics
- ✅ Security scan results
- ✅ Deployment logs

#### **🎯 За Hack TUES 12:**

**Препоръчителен workflow:**
1. **Develop** на `develop` branch
2. **Create PR** към `main` за финална демонстрация
3. **Preview deploy** за ревю
4. **Merge** към `main` за production deploy
5. **Автоматичен performance audit**

**Benefits за хакатон:**
- 🚀 **Автоматични deploys**
- 🔍 **Quality assurance**
- 📊 **Performance tracking**
- 🔒 **Security scanning**
- 👥 **Team collaboration**

---

## ✅ Готово за тестване!

След като сте изпълнили всички стъпки:

1. **Отворете `index.html`** в браузър
2. **Тествайте всички функционалности** по `TESTING_PLAN.md`
3. **Проверете Firestore Console** за съхранените данни
4. **Deploy-нете през Firebase Hosting** за демонстрация
5. **Използвайте branch strategy** за различни environments
6. **Настройте GitHub Actions** за автоматизация

Успех с хакатона! 🚀
