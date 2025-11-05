# Loyalty Program - Quick Reference Guide

## 🚀 Start Application

```bash
cd /Users/jeremiahovabor/eddy/bumpa_assessment
docker-compose up --build
```

## 🌐 Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | admin@example.com / password |
| Backend API | http://localhost:8080/api/v1 | N/A |
| RabbitMQ | http://localhost:15672 | guest / guest |
| Database | localhost:5432 | pguser / pgpassword |

## 🧪 Run Tests

```bash
# Backend tests
cd backend && php artisan test

# Frontend tests
cd frontend && npm test

# With coverage
cd backend && php artisan test --coverage
cd frontend && npm run test:coverage
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| README.md | Project overview |
| SETUP.md | Setup instructions |
| TESTING.md | Testing guide |
| PROJECT_SUMMARY.md | Project summary |
| CHECKLIST.md | Assessment checklist |
| docker-compose.yml | Service orchestration |

## 🔧 Common Commands

### Backend
```bash
cd backend

# Install dependencies
composer install

# Run migrations
php artisan migrate:fresh --seed

# Start server
php artisan serve

# Run tests
php artisan test

# Clear cache
php artisan cache:clear
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### Docker
```bash
# Start services
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service]

# Reset database
docker-compose down -v
docker-compose up --build
```

## 📊 API Endpoints

### User
```
GET  /api/v1/users/{user}/achievements
GET  /api/v1/users/{user}/summary
POST /api/v1/purchases
```

### Admin
```
GET  /api/v1/admin/users/achievements
GET  /api/v1/admin/users/{user}/achievements
GET  /api/v1/admin/achievements
POST /api/v1/admin/achievements
GET  /api/v1/admin/badges
POST /api/v1/admin/badges
```

## 🗄️ Database

### Tables
- users
- achievements
- badges
- purchases
- user_achievements
- user_badges

### Seeders
```bash
php artisan migrate:fresh --seed
```

Creates:
- 7 test users (1 admin, 1 customer, 5 regular)
- 5 achievements
- 4 badges
- 15-35 purchases
- Random user-achievement relationships

## 🎯 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password |
| Customer | customer@example.com | password |

## 📈 Project Stats

| Metric | Value |
|--------|-------|
| Backend Tests | 19 passing |
| Test Assertions | 64 |
| API Endpoints | 10 |
| Database Tables | 6 core |
| Frontend Pages | 3 |
| Components | 10+ |
| Documentation Files | 6 |

## 🔄 Event Flow

```
Purchase Recorded
    ↓
PurchaseCompleted Event
    ↓
Check Achievement Criteria
    ↓
Achievement Unlocked
    ↓
Check Badge Criteria
    ↓
Badge Unlocked
```

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Docker error | Add `platform: linux/amd64` |
| DB connection | Check credentials in .env |
| Port in use | Kill process: `lsof -ti:PORT \| xargs kill -9` |
| Module not found | Run `npm install` or `composer install` |
| Tests failing | Run `php artisan migrate:fresh --seed` |

## 📚 Documentation

- **README.md** - Start here
- **SETUP.md** - Detailed setup
- **TESTING.md** - Testing guide
- **PROJECT_SUMMARY.md** - Full summary
- **CHECKLIST.md** - Assessment checklist
- **backend/README.md** - Backend docs
- **frontend/README.md** - Frontend docs

## 🎓 Technology Stack

**Backend**: Laravel 12, PHP 8.2, PostgreSQL 15, RabbitMQ
**Frontend**: React 18.2, Vite 5, Zustand, Axios
**Infrastructure**: Docker, Docker Compose, Nginx

## ✅ Verification Checklist

- [ ] Docker running
- [ ] All services started
- [ ] Frontend accessible
- [ ] Backend API responding
- [ ] Database connected
- [ ] Tests passing
- [ ] Can login with credentials
- [ ] Dashboard loads
- [ ] Admin panel works

## 🚀 Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Run migrations
docker-compose exec backend php artisan migrate:fresh --seed

# View logs
docker-compose logs -f
```

## 📞 Quick Help

**Frontend not loading?**
- Check http://localhost:5173
- Check browser console for errors
- Verify backend is running

**Backend API not responding?**
- Check http://localhost:8080/api/v1
- Check Docker logs: `docker-compose logs backend`
- Verify database is running

**Tests failing?**
- Reset database: `php artisan migrate:fresh --seed`
- Clear cache: `php artisan cache:clear`
- Check .env file

**Docker issues?**
- Restart Docker Desktop
- Clear volumes: `docker-compose down -v`
- Rebuild: `docker-compose up --build`

## 🎯 Next Steps

1. Start application: `docker-compose up --build`
2. Access frontend: http://localhost:5173
3. Login with test credentials
4. Explore dashboard and admin panel
5. Run tests: `php artisan test`
6. Review documentation

## 📝 Notes

- All services use `linux/amd64` platform
- Database persists in Docker volume
- Frontend hot-reloads on changes
- Backend requires restart for code changes
- Test data includes 7 users and 5 achievements

---

**Last Updated**: November 5, 2025
**Version**: 1.0.0
**Status**: ✅ Ready for Use

