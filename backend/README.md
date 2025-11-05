# Loyalty Program Backend

A robust, event-driven microservice for managing a comprehensive loyalty program with achievements, badges, and cashback rewards.

## Architecture Overview

### Technology Stack
- **Framework**: Laravel 12
- **Language**: PHP 8.2
- **Database**: PostgreSQL 15
- **Message Queue**: RabbitMQ
- **API**: RESTful with JSON responses
- **Testing**: PHPUnit

### Design Patterns
- **Event-Driven Architecture**: Uses Laravel Events and Listeners for decoupled processing
- **Service Layer**: Business logic encapsulated in service classes
- **Repository Pattern**: Data access abstraction (via Eloquent ORM)
- **Factory Pattern**: Model factories for testing

## API Endpoints

### User Endpoints
- `GET /api/v1/users/{user}/achievements` - Get user's achievements
- `GET /api/v1/users/{user}/summary` - Get user's loyalty summary

### Purchase Endpoints
- `POST /api/v1/purchases` - Record a new purchase

### Admin Endpoints
- `GET /api/v1/admin/users/achievements` - Get all users' achievements
- `GET /api/v1/admin/users/{user}/achievements` - Get specific user's achievements
- `GET /api/v1/admin/achievements` - List all achievements
- `POST /api/v1/admin/achievements` - Create new achievement
- `GET /api/v1/admin/badges` - List all badges
- `POST /api/v1/admin/badges` - Create new badge

## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- PHP 8.2+ (for local development)
- Composer

### Installation

1. **Install dependencies**
   ```bash
   composer install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```

3. **Generate application key**
   ```bash
   php artisan key:generate
   ```

4. **Run migrations**
   ```bash
   php artisan migrate
   ```

### Docker Setup

```bash
docker-compose up --build
```

## Running Tests

### All Tests
```bash
php artisan test
```

### Unit Tests
```bash
php artisan test --filter=Unit
```

### Feature Tests
```bash
php artisan test --filter=Feature
```

### With Coverage
```bash
php artisan test --coverage
```

## Key Features

### 1. Achievement System
- Purchase milestone achievements
- Referral achievements
- Engagement achievements
- Automatic unlock on criteria met

### 2. Badge System
- Tiered badges (Bronze, Silver, Gold, Platinum)
- Based on achievement count and points
- Automatic unlock when criteria met

### 3. Cashback Rewards
- 2% cashback on all purchases
- Integration with payment providers (Paystack, Flutterwave, or mock)
- Automatic processing on purchase completion

### 4. Event-Driven Processing
- Purchase events trigger achievement checks
- Achievement unlocks trigger badge checks
- Decoupled, scalable architecture

## Configuration

### Payment Provider
Set in `.env`:
```
PAYMENT_PROVIDER=mock  # or paystack, flutterwave
PAYMENT_API_KEY=your_api_key
PAYMENT_BASE_URL=https://api.provider.com
```

### Database
```
DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=loyalty
DB_USERNAME=pguser
DB_PASSWORD=pgpassword
```

## Development

### Creating a New Achievement
```php
Achievement::create([
    'name' => 'First Purchase',
    'description' => 'Make your first purchase',
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

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DB credentials in `.env`
- Run migrations: `php artisan migrate`

### Queue Issues
- Check RabbitMQ is running
- Verify queue connection in `.env`

### API Errors
- Check request validation
- Review error logs: `storage/logs/laravel.log`

