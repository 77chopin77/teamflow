# Use OpenJDK 17
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy Gradle wrapper and build files
COPY build.gradle settings.gradle gradlew gradlew.bat ./
COPY gradle ./gradle

# Copy source
COPY src ./src

# Build the Spring Boot JAR
RUN ./gradlew bootJar

# Copy built JAR file
COPY build/libs/app-0.0.1-SNAPSHOT.jar app.jar

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
