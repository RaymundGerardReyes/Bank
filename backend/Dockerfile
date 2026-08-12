# Stage 1: Build the application using Maven and Java 21
FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Compile and package the application using the correct Java 21 environment
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime image using the matching Java 21 JRE
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the successfully built jar from the target folder
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]