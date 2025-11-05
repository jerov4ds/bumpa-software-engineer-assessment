# Loyalty Program - Full Stack Assessment

A comprehensive e-commerce loyalty program featuring a customer dashboard, admin panel, and event-driven backend architecture.

## 📋 Project Overview

This project implements a robust loyalty program with:
- **Customer Dashboard**: View achievements, badges, and record purchases
- **Admin Panel**: Manage users, achievements, and badges
- **Event-Driven Backend**: Automatic achievement and badge unlocking
- **Cashback Rewards**: 2% automatic cashback on purchases
- **Comprehensive Testing**: Unit, integration, and E2E tests

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│              Customer Dashboard & Admin Panel            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  API Gateway (Nginx)                     │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Backend (Laravel + PHP)                     │
│         Event-Driven Loyalty Service Architecture       │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────▼──┐  ┌─────▼──┐  ┌─────▼──┐
   │   DB  │  │RabbitMQ│  │ Cache  │
   │(PgSQL)│  │ (Queue)│  │(Redis) │
   └───────┘  └────────┘  └────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Installation & Running

1. **Clone the repository**
   ```bash
   cd /Users/jeremiahovabor/eddy/bumpa_assessment
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/v1
   - Admin Panel: http://localhost:3000/admin

4. **Test credentials**
   - Admin: `admin@example.com` / `password`
   - Customer: `customer@example.com` / `password`

## 📁 Project Structure

```
.
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Models/            # Eloquent models
│   │   ├── Services/          # Business logic
│   │   ├── Events/            # Event classes
│   │   ├── Listeners/         # Event listeners
│   │   └── Http/Controllers/  # API controllers
│   ├── database/
│   │   ├── migrations/        # Database schema
│   │   └── seeders/           # Test data
│   ├── tests/                 # Test suite
│   ├── routes/api.php         # API routes
│   └── README.md              # Backend documentation
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API integration
│   │   ├── store/             # State management
│   │   └── App.jsx            # Main component
│   ├── tests/                 # Test suite
│   ├── package.json           # Dependencies
│   └── README.md              # Frontend documentation
│
├── docker-compose.yml         # Service orchestration
└── README.md                  # This file
```

## 🔧 Setup Instructions

### Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Configure environment
cp .env.example .env
php artisan key:generate

# Run migrations and seeders
php artisan migrate:fresh --seed

# Start development server (if not using Docker)
php artisan serve
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server (if not using Docker)
npm run dev
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
php artisan test

# Run specific test suite
php artisan test --filter=Unit
php artisan test --filter=Feature

# Run with coverage
php artisan test --coverage
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run specific test suite
npm run test:unit
npm run test:components

# Run with coverage
npm run test:coverage
```

### End-to-End Tests

```bash
cd frontend

# Run E2E tests (requires backend running)
npm run test:e2e
```

## 📊 API Endpoints

### User Endpoints
- `GET /api/v1/users/{user}/achievements` - Get user achievements
- `GET /api/v1/users/{user}/summary` - Get loyalty summary

### Purchase Endpoints
- `POST /api/v1/purchases` - Record purchase

### Admin Endpoints
- `GET /api/v1/admin/users/achievements` - All users' achievements
- `GET /api/v1/admin/achievements` - List achievements
- `POST /api/v1/admin/achievements` - Create achievement
- `GET /api/v1/admin/badges` - List badges
- `POST /api/v1/admin/badges` - Create badge

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts
- `achievements` - Achievement definitions
- `badges` - Badge definitions
- `purchases` - Purchase records
- `user_achievements` - User achievement progress
- `user_badges` - User badge collection

## 🔄 Event Flow

1. **Purchase Recorded** → `PurchaseCompleted` event
2. **Event Listener** → Checks achievement criteria
3. **Achievement Unlocked** → `AchievementUnlocked` event
4. **Event Listener** → Checks badge criteria
5. **Badge Unlocked** → `BadgeUnlocked` event

## 🛠️ Development

### Adding a New Achievement

```php
Achievement::create([
    'name' => 'Achievement Name',
    'description' => 'Description',
    'icon' => '🎉',
    'points' => 10,
    'type' => 'purchase_milestone',
    'criteria' => ['min_purchases' => 1],
]);
```

### Recording a Purchase

```php
$loyaltyService = app(LoyaltyService::class);
$purchase = $loyaltyService->recordPurchase(
    $user,
    100.00,
    'TXN123456',
    'credit_card'
);
```

## 📝 Documentation

- [Backend README](./backend/README.md) - Backend architecture and setup
- [Frontend README](./frontend/README.md) - Frontend architecture and setup

## 🐛 Troubleshooting

### Docker Issues
```bash
# Clear Docker cache
docker-compose down -v
docker system prune -a

# Rebuild
docker-compose up --build
```

### Database Issues
```bash
# Reset database
php artisan migrate:fresh --seed
```

### Frontend Issues
```bash
# Clear node modules
rm -rf node_modules package-lock.json
npm install
```

## 📦 Technology Stack

### Backend
- Laravel 12
- PHP 8.2
- PostgreSQL 15
- RabbitMQ
- PHPUnit

### Frontend
- React 18.2
- Vite 5
- React Router 6.20
- Zustand 4.4.1
- Vitest

### Infrastructure
- Docker
- Docker Compose
- Nginx

## ✅ Checklist

- [x] Backend API with event-driven architecture
- [x] Frontend with customer dashboard and admin panel
- [x] Database migrations and seeders
- [x] Comprehensive test coverage
- [x] Docker containerization
- [x] Documentation

## 📄 License

This project is part of a job assessment.

