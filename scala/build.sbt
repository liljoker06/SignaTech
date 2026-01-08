name := "signatech-ai"
version := "0.1.0"
scalaVersion := "2.13.12"

val dl4jVersion = "1.0.0-M2.1"
val nd4jBackend = "nd4j-cuda-11.6-platform"
val circeVersion = "0.14.6"

libraryDependencies ++= Seq(
  // Deep Learning 4J - Framework ML natif pour JVM
  "org.deeplearning4j" % "deeplearning4j-core" % dl4jVersion,
  "org.nd4j" % nd4jBackend % dl4jVersion,
  "org.deeplearning4j" % "deeplearning4j-zoo" % dl4jVersion,
  // PostgreSQL JDBC Driver
  "org.postgresql" % "postgresql" % "42.7.3",
  
  // ONNX Runtime pour charger les modèles PyTorch/TensorFlow convertis
  "com.microsoft.onnxruntime" % "onnxruntime" % "1.16.3",
  
  // OpenCV pour traitement d'image (natif)
  "org.openpnp" % "opencv" % "4.7.0-0",
  
  // Akka HTTP pour WebSocket
  "com.typesafe.akka" %% "akka-http" % "10.5.3",
  "com.typesafe.akka" %% "akka-stream" % "2.8.5",
  "com.typesafe.akka" %% "akka-actor-typed" % "2.8.5",
  
  // JSON avec Circe (remplace spray-json)
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "de.heikoseeberger" %% "akka-http-circe" % "1.39.2",
  
  // HTTP Client pour télécharger depuis HuggingFace
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