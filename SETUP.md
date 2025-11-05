# Loyalty Program - Complete Setup Guide

This guide provides step-by-step instructions to set up, run, and test the entire loyalty program project.

## 📋 Prerequisites

- **Docker Desktop** (latest version)
- **Git**
- **macOS/Linux/Windows** with Docker support
- **Minimum 4GB RAM** allocated to Docker
- **At least 10GB** free disk space

## Quick Start (Docker)

### 1. Clone and Navigate
```bash
cd ~/bumpa_assessment
```

### 2. Start All Services
```bash
docker compose up --build
```

This will:
- Build and start the backend (Laravel + PHP-FPM)
- Start Nginx web server
- Start PostgreSQL database
- Start RabbitMQ message queue
- Build and start the frontend (React)

### 3. Access the Application

Once all services are running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api/v1
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **Database**: localhost:5432

### 4. Test Credentials

**Admin Account:**
- Email: `admin@example.com`
- Password: `password`

**Customer Account:**
- Email: `customer@example.com`
- Password: `password`

## 🛠️ Local Development Setup

### Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations and seeders
php artisan migrate:fresh --seed

# Start development server
php artisan serve
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

## 🧪 Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
php artisan test

# Run specific test suite
php artisan test --filter=Unit
php artisan test --filter=Feature

# Run with coverage report
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

## Database Management

### Run Migrations
```bash
cd backend
php artisan migrate
```

### Reset Database
```bash
cd backend
php artisan migrate:fresh --seed
```

### Create New Migration
```bash
cd backend
php artisan make:migration create_table_name
```

## API Endpoints

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

## 🐛 Troubleshooting

### Docker Issues

**Error: "assertion failed [thread_starts_interval.has_value()]"**
- This is a macOS Docker Desktop issue
- Solution: Ensure `platform: linux/amd64` is set in docker-compose.yml
- Already configured in this project

**Error: "Cannot connect to Docker daemon"**
- Ensure Docker Desktop is running
- Restart Docker Desktop if needed

### Database Issues

**Error: "Connection refused"**
```bash
# Check if database is running
docker ps | grep loyalty_db

# Restart database
docker compose restart db
```

**Error: "SQLSTATE[HY000]"**
```bash
# Reset database
php artisan migrate:fresh --seed
```

### Frontend Issues

**Error: "Cannot find module"**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error: "Port 5173 already in use"**
```bash
# Kill process using port
lsof -ti:5173 | xargs kill -9
```

### Backend Issues

**Error: "Class not found"**
```bash
# Regenerate autoloader
composer dump-autoload
```

**Error: "No application encryption key"**
```bash
php artisan key:generate
```

## Project Structure

```
.
├── backend/              # Laravel API
├── frontend/             # React SPA
├── nginx/                # Nginx configuration
├── docker-compose.yml    # Service orchestration
├── README.md             # Project overview
├── SETUP.md              # This file
└── TESTING.md            # Testing guide
```

## Environment Variables

### Backend (.env)
```
APP_NAME=Loyalty Program
APP_ENV=local
DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=loyalty
DB_USERNAME=pguser
DB_PASSWORD=pgpassword
PAYMENT_PROVIDER=mock
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Loyalty Program
```

## Documentation

- [Backend README](./backend/README.md) - Backend architecture
- [Frontend README](./frontend/README.md) - Frontend architecture
- [Main README](./README.md) - Project overview

## Getting Help

1. Check the troubleshooting section above
2. Review the README files in backend/ and frontend/
3. Check Docker logs: `docker compose logs -f [service_name]`
4. Check application logs: `storage/logs/laravel.log`

## Notes

- All services use `linux/amd64` platform for macOS compatibility
- Database data persists in Docker volume `pgdata`
- Frontend hot-reloads on file changes
- Backend requires restart for code changes (unless using file watching)
- RabbitMQ is configured but not actively used in this version

## Next Steps

1. Start the application with `docker compose up --build`
2. Access the frontend at http://localhost:5173
3. Login with test credentials
4. Explore the customer dashboard and admin panel
5. Run tests to verify everything works

