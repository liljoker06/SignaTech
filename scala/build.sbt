name := "signatech-backend"
version := "0.1.0"
scalaVersion := "2.13.12"

val circeVersion = "0.14.6"

libraryDependencies ++= Seq(
  // PostgreSQL JDBC Driver
  "org.postgresql" % "postgresql" % "42.7.3",
  
  // Akka HTTP pour WebSocket
  "com.typesafe.akka" %% "akka-http" % "10.5.3",
  "com.typesafe.akka" %% "akka-stream" % "2.8.5",
  "com.typesafe.akka" %% "akka-actor-typed" % "2.8.5",
  
  // JSON avec Circe
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "de.heikoseeberger" %% "akka-http-circe" % "1.39.2",
  
  // HTTP Client
  "com.softwaremill.sttp.client3" %% "core" % "3.9.1",
  "com.softwaremill.sttp.client3" %% "akka-http-backend" % "3.9.1",
  
  // Configuration
  "com.typesafe" % "config" % "1.4.3",
  
  // Logging
  "ch.qos.logback" % "logback-classic" % "1.4.11",
  "com.typesafe.scala-logging" %% "scala-logging" % "3.9.5",
  
  // Tests
  "org.scalatest" %% "scalatest" % "3.2.17" % Test
)