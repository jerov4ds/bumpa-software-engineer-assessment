# Loyalty Program - Testing Guide

Comprehensive guide for running and understanding the test suite.

## Test Overview

The project includes:
- **Backend**: 19 tests (Unit + Feature)
- **Frontend**: Component and integration tests
- **Coverage**: Unit, integration, and E2E tests

## Backend Testing

### Running All Tests

```bash
cd backend
php artisan test
```

Expected output:
```
Tests:    19 passed (64 assertions)
Duration: 0.41s
```

### Running Specific Test Suites

**Unit Tests Only**
```bash
php artisan test --filter=Unit
```

**Feature Tests Only**
```bash
php artisan test --filter=Feature
```

**Specific Test Class**
```bash
php artisan test tests/Feature/Api/PurchaseControllerTest.php
```

**Specific Test Method**
```bash
php artisan test --filter=test_record_purchase_successfully
```

### Test Coverage

```bash
php artisan test --coverage
```

This generates a coverage report showing:
- Lines covered
- Methods covered
- Classes covered
- Overall coverage percentage

### Backend Test Structure

```
tests/
├── Unit/
│   ├── ExampleTest.php
│   └── Services/
│       └── LoyaltyServiceTest.php
└── Feature/
    ├── ExampleTest.php
    └── Api/
        ├── AchievementControllerTest.php
        ├── AdminControllerTest.php
        └── PurchaseControllerTest.php
```

### Backend Test Details

#### Unit Tests

**LoyaltyServiceTest.php**
- `test_record_purchase_creates_purchase_record` - Verifies purchase creation
- `test_record_purchase_calculates_cashback_correctly` - Verifies 2% cashback
- `test_get_user_loyalty_summary_returns_correct_data` - Verifies summary data
- `test_get_user_loyalty_summary_with_no_achievements` - Edge case handling

#### Feature Tests

**AchievementControllerTest.php**
- `test_get_user_achievements` - Retrieves user achievements
- `test_get_user_summary` - Retrieves loyalty summary
- `test_get_user_achievements_empty` - Handles empty achievements

**AdminControllerTest.php**
- `test_get_all_users_achievements` - Lists all users' achievements
- `test_get_user_achievements_admin` - Gets specific user achievements
- `test_list_achievements` - Lists all achievements
- `test_create_achievement` - Creates new achievement
- `test_list_badges` - Lists all badges
- `test_create_badge` - Creates new badge

**PurchaseControllerTest.php**
- `test_record_purchase_successfully` - Records valid purchase
- `test_record_purchase_with_invalid_user` - Handles invalid user
- `test_record_purchase_with_duplicate_transaction_id` - Prevents duplicates
- `test_record_purchase_with_missing_required_fields` - Validates input

## Frontend Testing

### Running All Tests

```bash
cd frontend
npm test
```

### Running Specific Test Suites

**Unit Tests**
```bash
npm run test:unit
```

**Component Tests**
```bash
npm run test:components
```

**With Coverage**
```bash
npm run test:coverage
```

### Frontend Test Structure

```
src/
├── services/
│   └── __tests__/
│       └── api.test.js
├── store/
│   └── __tests__/
│       └── authStore.test.js
└── pages/
    └── __tests__/
        ├── CustomerDashboard.test.jsx
        └── AdminPanel.test.jsx
```

### Frontend Test Details

**API Service Tests**
- API initialization
- Request/response handling
- Error handling

**Auth Store Tests**
- Login functionality
- Logout functionality
- State persistence
- Auth restoration

**Component Tests**
- Component rendering
- User interactions
- Data fetching
- Error states

## 🔄 Test Data & Seeders

### Database Seeders

The project includes comprehensive seeders:

```bash
php artisan migrate:fresh --seed
```

This runs:
1. **UserSeeder** - Creates admin and customer users
2. **LoyaltySeeder** - Creates achievements and badges
3. **PurchaseSeeder** - Creates test purchases
4. **UserAchievementSeeder** - Assigns achievements to users
5. **EventSeeder** - Dispatches purchase events
6. **NotificationSeeder** - Creates test notifications
7. **LogSeeder** - Creates test logs

### Test Data

**Users Created:**
- Admin: admin@example.com / password
- Customer: customer@example.com / password
- 5 additional test users

**Achievements Created:**
- First Purchase (10 points)
- Loyal Customer (25 points)
- Big Spender (50 points)
- Referral Master (30 points)
- Engagement Pro (15 points)

**Badges Created:**
- Bronze Badge (5 achievements)
- Silver Badge (10 achievements)
- Gold Badge (15 achievements)
- Platinum Badge (20 achievements)

## Test Assertions

### Common Assertions

**HTTP Status**
```php
$response->assertStatus(200);
$response->assertStatus(422);
$response->assertStatus(404);
```

**JSON Structure**
```php
$response->assertJson(['success' => true]);
$response->assertJsonStructure(['data', 'count']);
```

**Database**
```php
$this->assertDatabaseHas('purchases', ['user_id' => 1]);
$this->assertDatabaseCount('achievements', 5);
```

**Collections**
```php
$this->assertCount(3, $achievements);
$this->assertTrue($achievements->contains($achievement));
```

## 🎯 Test Scenarios

### Purchase Flow
1. User records purchase
2. Purchase event dispatched
3. Achievement criteria checked
4. Achievement unlocked if criteria met
5. Badge criteria checked
6. Badge unlocked if criteria met

### Achievement Unlock
1. User has 5 purchases
2. "Loyal Customer" achievement criteria met
3. Achievement automatically unlocked
4. User notified

### Badge Unlock
1. User has 5 achievements
2. "Bronze Badge" criteria met
3. Badge automatically unlocked
4. User notified

## 🔍 Debugging Tests

### Verbose Output
```bash
php artisan test --verbose
```

### Stop on First Failure
```bash
php artisan test --stop-on-failure
```

### Run Single Test
```bash
php artisan test tests/Feature/Api/PurchaseControllerTest.php::test_record_purchase_successfully
```

### Print Debug Info
```php
dd($response->json());
dump($user->achievements);
```

## 📈 Continuous Integration

For CI/CD pipelines:

```bash
# Backend
cd backend && php artisan test --coverage

# Frontend
cd frontend && npm test -- --coverage
```

## 🆘 Common Test Issues

**"Call to undefined method"**
- Ensure factories are properly defined
- Check model uses HasFactory trait

**"Connection refused"**
- Ensure database is running
- Check DB credentials in .env

**"Port already in use"**
- Kill process using port
- Or use different port

**"Module not found"**
- Run `npm install` or `composer install`
- Clear cache: `npm cache clean --force`

## 📚 Resources

- [PHPUnit Documentation](https://phpunit.de/)
- [Laravel Testing](https://laravel.com/docs/testing)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)

## 🎓 Best Practices

1. **Write tests first** (TDD approach)
2. **Test one thing per test**
3. **Use descriptive test names**
4. **Keep tests isolated**
5. **Mock external dependencies**
6. **Test edge cases**
7. **Maintain high coverage**
8. **Run tests frequently**

