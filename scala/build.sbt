// Paramètres globaux
ThisBuild / organization := "com.signatech"
ThisBuild / scalaVersion := "2.13.14"

// Infos projet
name := "signatech-scala"
version := "0.1.0"

// Dépendances (packages)
libraryDependencies ++= Seq(
  // Serveur HTTP + WebSocket
  "com.typesafe.akka" %% "akka-http" % "10.5.3",

  // Streams (utile plus tard)
  "com.typesafe.akka" %% "akka-stream" % "2.8.5",

  // Acteurs (concurrence)
  "com.typesafe.akka" %% "akka-actor-typed" % "2.8.5",

  "io.circe" %% "circe-core" % "0.14.6",
  "io.circe" %% "circe-generic" % "0.14.6",
  "io.circe" %% "circe-parser" % "0.14.6",
  
  // Client HTTP pour le scraping
  "com.softwaremill.sttp.client3" %% "core" % "3.11.0",
  
  // Driver PostgreSQL
  "org.postgresql" % "postgresql" % "42.7.3"
)
