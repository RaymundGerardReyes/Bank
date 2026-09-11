# ============================================================
# 1. BUILD STAGE
# ============================================================
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /src

# Copy the Gradle wrapper and configuration files first to cache dependencies
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY gradle.properties* .

# Ensure wrapper is executable and pre-fetch dependencies using BuildKit persistent cache
RUN --mount=type=cache,target=/root/.gradle \
    chmod +x ./gradlew && ./gradlew dependencies --no-daemon || true

# Now copy the actual source code
COPY src src

# Build the final fat JAR with BuildKit cache and Gradle build cache
RUN --mount=type=cache,target=/root/.gradle \
    ./gradlew bootJar -x test --no-daemon --build-cache

# ============================================================
# 2. RUNTIME STAGE
# ============================================================
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Create a non-root user (Spring Boot runs perfectly fine without root)
RUN addgroup -S spring && adduser -S spring -G spring

# Copy the built jar from the build stage
COPY --from=build /src/build/libs/*.jar app.jar

# Ensure the non-root user owns the app jar
RUN chown spring:spring app.jar

# Switch to the non-root user
USER spring:spring

EXPOSE 8080

# The healthcheck is managed by docker-compose, but we add a generic one for standalone runs
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-XX:+UseSerialGC", "-XX:TieredStopAtLevel=1", "-Xmx512m", "-jar", "app.jar"]