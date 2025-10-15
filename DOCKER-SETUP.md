# Ibrahim El Khalil Portfolio - Docker Setup

This Docker setup provides a complete containerized environment for the Ibrahim El Khalil Portfolio application with frontend, backend, and MongoDB database.

## Architecture

- **Frontend**: React application served with Nginx
- **Backend**: FastAPI Python application
- **Database**: MongoDB with initialization scripts
- **Admin**: Mongo Express for database management (development only)

## Prerequisites

- Docker and Docker Compose installed
- At least 4GB RAM available for containers

## Quick Start

### 1. Environment Setup

Copy the environment template:
```bash
cp .env.example .env
```

Edit `.env` file with your preferred settings:
```env
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_password
DATABASE_NAME=portfolio_db
```

### 2. Production Deployment

Build and start all services:
```bash
docker-compose up -d --build
```

### 3. Development Mode

For development with hot reloading:
```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

## Services & Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | React application |
| Backend | 8001 | FastAPI server |
| MongoDB | 27017 | Database |
| Mongo Express | 8081 | DB admin (dev only) |

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs
- **Database Admin**: http://localhost:8081 (dev mode only)
  - Username: `admin`
  - Password: `admin`

## Docker Commands

### Basic Operations

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose up -d --build backend

# View running containers
docker-compose ps
```

### Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Install new npm packages (frontend)
docker-compose exec frontend npm install package-name

# Install new pip packages (backend)
docker-compose exec backend pip install package-name

# Access backend shell
docker-compose exec backend bash

# Access MongoDB shell
docker-compose exec mongodb mongosh
```

### Maintenance

```bash
# Remove all containers and volumes (⚠️ DATA LOSS)
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Clean up Docker system
docker system prune -a
```

## Database Management

### Backup MongoDB

```bash
# Create backup
docker-compose exec mongodb mongodump --out /backup

# Copy backup to host
docker cp portfolio_mongodb:/backup ./mongodb-backup
```

### Restore MongoDB

```bash
# Copy backup to container
docker cp ./mongodb-backup portfolio_mongodb:/backup

# Restore backup
docker-compose exec mongodb mongorestore /backup
```

### Direct Database Access

```bash
# MongoDB shell
docker-compose exec mongodb mongosh -u admin -p password --authenticationDatabase admin

# Use portfolio database
use portfolio_db

# Show collections
show collections

# Query data
db.profile.findOne()
```

## File Structure

```
project/
├── docker-compose.yml          # Production setup
├── docker-compose.dev.yml      # Development setup
├── .env                        # Environment variables
├── .env.example               # Environment template
├── backend/
│   ├── Dockerfile             # Backend container
│   ├── requirements.txt       # Python dependencies
│   └── server.py             # FastAPI application
├── frontend/
│   ├── Dockerfile             # Frontend container
│   ├── nginx.conf            # Nginx configuration
│   └── package.json          # Node.js dependencies
└── mongo-init/
    └── init-portfolio.js     # MongoDB initialization
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_ROOT_USERNAME` | admin | MongoDB root username |
| `MONGO_ROOT_PASSWORD` | password | MongoDB root password |
| `DATABASE_NAME` | portfolio_db | Database name |
| `BACKEND_PORT` | 8001 | Backend service port |
| `FRONTEND_PORT` | 3000 | Frontend service port |

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 8001, 27017 are available
2. **Memory issues**: Increase Docker memory allocation
3. **Permission errors**: Ensure Docker daemon is running

### Debug Commands

```bash
# Check container health
docker-compose ps

# View specific service logs
docker-compose logs backend

# Check resource usage
docker stats

# Inspect container
docker-compose exec backend env
```

### Reset Everything

```bash
# Complete reset (⚠️ DESTROYS ALL DATA)
docker-compose down -v --rmi all
docker system prune -a
docker-compose up -d --build
```

## Security Notes

- Change default passwords in production
- Use secrets management for sensitive data
- Enable MongoDB authentication
- Configure proper firewall rules
- Use HTTPS in production

## Production Deployment

For production deployment:

1. Use `docker-compose.yml` (not dev version)
2. Set strong passwords in `.env`
3. Configure reverse proxy (nginx/traefik)
4. Enable SSL/TLS certificates
5. Set up monitoring and logging
6. Configure backup strategies

## Support

For issues related to Docker setup, please check:
1. Docker logs: `docker-compose logs`
2. Container status: `docker-compose ps`
3. System resources: `docker stats`