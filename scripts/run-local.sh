#!/usr/bin/env bash
set -e

echo "Starting local Hardened Banking Environment..."

cd backend

# Stop any running instances
docker-compose down

# Build the Java application
echo "Building Spring Boot application..."
./mvnw clean package -DskipTests

# Start the Docker Compose stack
echo "Starting PostgreSQL, Spring Boot backend, and Nginx edge gateway..."
docker-compose up --build -d

echo "Environment is up and running!"
echo "Backend API: http://localhost:8080/api/v1/"
echo "Nginx Edge:  http://localhost:80/api/v1/"
echo ""
echo "To view logs, run: docker-compose logs -f"
