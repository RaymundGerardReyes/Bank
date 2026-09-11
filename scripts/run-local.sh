#!/usr/bin/env bash
set -e

echo "Starting local Hardened Banking Environment (development)..."

# Build the Java application
cd backend
echo "Building Spring Boot application..."
./mvnw clean package -DskipTests
cd ..

# Stop any running instances
echo "Stopping any running instances..."
dotenvx run --env-file=.env.development -- docker compose --project-directory infra/docker -f infra/docker/compose.yaml -f infra/docker/compose.dev.yaml down

# Start the Docker Compose stack
echo "Starting PostgreSQL, Spring Boot backend, and Nginx edge gateway..."
dotenvx run --env-file=.env.development -- docker compose --project-directory infra/docker -f infra/docker/compose.yaml -f infra/docker/compose.dev.yaml up --build -d

echo "Development environment is up and running!"
echo "Backend API: http://localhost:8080/api/v1/"
echo "Nginx Edge:  http://localhost:80/api/v1/"
echo ""
echo "To view logs, run: npm run docker:logs:dev"
