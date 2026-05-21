FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM tomcat:10.1-jdk21-temurin
RUN rm -rf /usr/local/tomcat/webapps/*
RUN mkdir -p /usr/local/tomcat/conf/Catalina/localhost /opt/dev-webapp
COPY docker/tomcat/ROOT.xml /usr/local/tomcat/conf/Catalina/localhost/ROOT.xml
COPY --from=builder /app/target/anime-wiki.war /usr/local/tomcat/webapps/ROOT.war
EXPOSE 8080
CMD ["catalina.sh", "run"]
