# Dress Market

Современный интернет-магазин для сферы игр и одежды с поддержкой Firebase аутентификации.

## Запуск локального сервера

### Вариант 1: Python HTTP Server (рекомендуется)
```bash
python -m http.server 8000
```
Затем откройте: http://localhost:8000

### Вариант 2: Node.js http-server
```bash
npm install -g http-server
http-server -p 8000
```

### Вариант 3: PHP встроенный сервер
```bash
php -S localhost:8000
```

### Вариант 4: Live Server (VS Code расширение)
Установите расширение "Live Server" в VS Code и нажмите "Go Live"

## Настройка Firebase

### Шаг 1: Создайте проект Firebase
1. Перейдите на https://console.firebase.google.com/
2. Нажмите "Добавить проект"
3. Следуйте инструкциям для создания проекта

### Шаг 2: Зарегистрируйте веб-приложение
1. В консоли Firebase выберите ваш проект
2. Нажмите на иконку веб-приложения (</>)
3. Зарегистрируйте приложение с именем "Dress Market"
4. Скопируйте конфигурацию Firebase

### Шаг 3: Включите методы аутентификации
1. В консоли Firebase перейдите в раздел "Authentication"
2. Перейдите на вкладку "Sign-in method"
3. Включите следующие провайдеры:
   - **Email/Password** - просто включите
   - **Google** - включите и настройте email поддержки
   - **Microsoft** - включите и следуйте инструкциям для настройки Azure AD
   - **Phone** - включите и настройте reCAPTCHA

### Шаг 4: Настройте конфигурацию в app.js
Откройте файл `app.js` и замените конфигурацию Firebase:

```javascript
const firebaseConfig = {
    apiKey: "ВАШ_API_KEY",
    authDomain: "ВАШ_AUTH_DOMAIN",
    projectId: "ВАШ_PROJECT_ID",
    storageBucket: "ВАШ_STORAGE_BUCKET",
    messagingSenderId: "ВАШ_MESSAGING_SENDER_ID",
    appId: "ВАШ_APP_ID"
};
```

### Шаг 5: Настройте авторизованные домены
1. В консоли Firebase перейдите в "Authentication" > "Settings"
2. Добавьте `localhost` в список авторизованных доменов
3. После деплоя добавьте ваш продакшн домен

## Функции аутентификации

- ✅ Вход через Email и пароль
- ✅ Регистрация через Email
- ✅ Вход через Google
- ✅ Вход через Microsoft
- ✅ Вход по номеру телефона (SMS)
- ✅ Профиль пользователя
- ✅ Выход из аккаунта
- ✅ Темная/светлая тема (сохраняется)

## Структура проекта

```
dress-market/
├── index.html          # Главная страница
├── oferta.html         # Страница оферты
├── styles.css          # Стили сайта
├── app.js              # Firebase и логика
├── package.json        # npm конфигурация
├── README.md           # Документация
└── images/
    └── background.jpg.jfif  # Фоновое изображение
```

## Контакты

- Владелец: vkesi
- Email: akfagia@gmail.com
- FunPay: https://funpay.com/users/13881930/
- Avito: https://www.avito.ru/user/b0d4c38f5ccfec86b10c8bb726858ef0/profile

## Лицензия

© 2026 Dress Market. Все права защищены.
