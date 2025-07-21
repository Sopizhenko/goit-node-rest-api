# GoIT Node REST API

REST API для управління контактами з використанням PostgreSQL та Sequelize.

## Встановлення

1. Встановіть залежності:

```bash
npm install
```

2. Налаштуйте базу даних PostgreSQL:

   - Створіть базу даних `contacts_db`
   - Налаштуйте користувача з правами доступу

3. Налаштування змінних середовища:
   - Скопіюйте файл `env.example` в `.env`
   - Відредагуйте значення під ваші налаштування PostgreSQL:
   ```
   DB_NAME=contacts_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   ```

## Запуск

```bash
# Розробка
npm run dev

# Продакшн
npm start
```

## API Endpoints

- `GET /api/contacts` - отримати всі контакти
- `GET /api/contacts/:id` - отримати контакт за ID
- `POST /api/contacts` - створити новий контакт
- `PUT /api/contacts/:id` - оновити контакт
- `DELETE /api/contacts/:id` - видалити контакт
- `PATCH /api/contacts/:contactId/favorite` - оновити статус favorite

### Приклад оновлення статусу favorite:

```bash
curl -X PATCH http://localhost:3000/api/contacts/1/favorite \
  -H "Content-Type: application/json" \
  -d '{"favorite": true}'
```

## Аутентифікація та авторизація

### Реєстрація

- `POST /api/auth/register` — створити нового користувача
  - Тіло: `{ "email": "user@example.com", "password": "password123" }`
  - Відповідь 201: `{ "user": { "email": "user@example.com", "subscription": "starter" } }`

### Логін

- `POST /api/auth/login` — отримати токен
  - Тіло: `{ "email": "user@example.com", "password": "password123" }`
  - Відповідь 200: `{ "token": "jwt-token", "user": { "email": "user@example.com", "subscription": "starter" } }`

### Логаут

- `POST /api/auth/logout` — вийти з акаунта (потрібен токен)
  - Заголовок: `Authorization: Bearer <token>`
  - Відповідь 204: без тіла

### Поточний користувач

- `GET /api/auth/current` — отримати email і subscription поточного користувача (потрібен токен)
  - Заголовок: `Authorization: Bearer <token>`
  - Відповідь 200: `{ "email": "user@example.com", "subscription": "starter" }`

### Захищені маршрути

Всі маршрути `/api/contacts` вимагають авторизації через Bearer-токен.

### Приклад curl для логіну та отримання контактів:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

curl http://localhost:3000/api/contacts \
  -H "Authorization: Bearer <your_token>"
```

## Тестування API

### Postman Collection

Імпортуйте файл `postman_collection.json` в Postman для швидкого тестування всіх endpoints.

**Як імпортувати:**

1. Відкрийте Postman
2. Натисніть "Import"
3. Виберіть файл `postman_collection.json`
4. Collection буде додано з усіма готовими запитами

**Що включено в collection:**

- ✅ Всі основні CRUD операції
- ✅ Тест-кейси для валідації
- ✅ Тест-кейси для обробки помилок
- ✅ Змінна `baseUrl` для легкого зміни URL

### Curl приклади

```bash
# Отримати всі контакти
curl http://localhost:3000/api/contacts

# Створити контакт
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "favorite": true
  }'

# Оновити статус favorite
curl -X PATCH http://localhost:3000/api/contacts/1/favorite \
  -H "Content-Type: application/json" \
  -d '{"favorite": true}'
```

## Структура проекту

```
├── config/
│   ├── database.js      # Конфігурація Sequelize
│   ├── env.js          # Змінні середовища
│   └── initDatabase.js # Ініціалізація БД
├── models/
│   └── Contact.js      # Модель Contact
├── controllers/
│   └── contactsControllers.js
├── services/
│   └── contactsServices.js
├── routes/
│   └── contactsRouter.js
├── env.example         # Приклад налаштувань
├── postman_collection.json # Postman collection
└── app.js
```

## Модель Contact

```javascript
{
  id: UUID (автоматично генерується),
  name: STRING (обов'язкове),
  email: STRING (обов'язкове),
  phone: STRING (обов'язкове),
  favorite: BOOLEAN (за замовчуванням false),
  createdAt: DATE,
  updatedAt: DATE
}
```

- `PATCH /api/auth/avatars` - оновити аватар користувача (multipart/form-data, потрібен токен)

### Оновлення аватарки користувача

- `PATCH /api/auth/avatars` — оновити аватар користувача
  - Заголовок: `Authorization: Bearer <token>`
  - Тіло: `multipart/form-data`, поле файлу — `avatar`
  - Відповідь 200: `{ "avatarURL": "/avatars/<ім'я_файлу>" }`
  - Відповідь 401: `{ "message": "Not authorized" }`

#### Приклад curl для оновлення аватарки:

```bash
curl -X PATCH http://localhost:3000/api/auth/avatars \
  -H "Authorization: Bearer <your_token>" \
  -F "avatar=@/path/to/your/avatar.jpg"
```

- `POST /api/auth/verify` - повторна відправка verification email

### Повторна відправка verification email

- `POST /api/auth/verify` — повторно надіслати лист для підтвердження email
  - Тіло: `{ "email": "example@example.com" }`
  - Відповідь 200: `{ "message": "Verification email sent" }`
  - Відповідь 400: `{ "message": "missing required field email" }`, `{ "message": "Verification has already been passed" }`, `{ "message": "User not found" }`

#### Приклад curl для повторної відправки verification email:

```bash
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"email": "example@example.com"}'
```
