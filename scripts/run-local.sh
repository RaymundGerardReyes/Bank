#!/usr/bin/env bash
set -e

echo "Starting local Hardened Banking Environment..."

# Build the Java application
cd backend
echo "Building Spring Boot application..."
./mvnw clean package -DskipTests
cd ..

# Stop any running instances
echo "Stopping any running instances..."
dotenvx run --env-file=.env -- bash -c "cd infra/docker && docker compose -f compose.yaml -f compose.dev.yaml down"

# Start the Docker Compose stack
echo "Starting PostgreSQL, Spring Boot backend, and Nginx edge gateway..."
dotenvx run --env-file=.env -- bash -c "cd infra/docker && docker compose -f compose.yaml -f compose.dev.yaml up --build -d"

echo "Environment is up and running!"
echo "Backend API: http://localhost:8080/api/v1/"
echo "Nginx Edge:  http://localhost:80/api/v1/"
echo ""
echo "To view logs, run: npm run docker:logs"
