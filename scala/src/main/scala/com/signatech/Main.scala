package com.signatech

import akka.actor.typed.ActorSystem
import akka.actor.typed.scaladsl.Behaviors
import com.signatech.websocket.WebSocketServer
import com.signatech.websocket.client.PythonAIClient
import com.typesafe.scalalogging.StrictLogging
import com.signatech.bootstrap.AutoImport

import scala.concurrent.ExecutionContextExecutor
import scala.io.StdIn
import scala.util.{Failure, Success, Try}

object Main extends StrictLogging {

  def main(args: Array[String]): Unit = {

    implicit val system: ActorSystem[Nothing] =
      ActorSystem(Behaviors.empty, "signatech")

    implicit val ec: ExecutionContextExecutor =
      system.executionContext

    // =====================
    // IMPORT DONNÉES (NE PAS TOUCHER)
    // =====================
    Try(AutoImport.run()) match {
      case Success(_) =>
        logger.info("✓ Données importées avec succès")
      case Failure(ex) =>
        logger.warn(s"⚠ Import échoué : ${ex.getMessage}")
        logger.info("→ L'application continue sans DB")
    }

    logger.info("SignaTech - Démarrage")

    // =====================
    // DÉMARRAGE WS SCALA (FRONT / NODE)
    // =====================
    val wsServer = new WebSocketServer()
    wsServer.start()

    // =====================
    // 🔥 CONNEXION AU PYTHON AI
    // =====================
    val pythonWsUrl = "ws://localhost:8000/ws/alphabet"
    val pythonClient = new PythonAIClient(pythonWsUrl)
    pythonClient.connect()

    println("=" * 60)
    println("✓ Scala SignaTech backend started")
    println("✓ WebSocket server: ws://localhost:8080/ws/translate")
    println("✓ Connected to Python AI WebSocket")
    println("=" * 60)
    println("Press ENTER to stop...")

    StdIn.readLine()

    logger.info("Arrêt du serveur...")
    system.terminate()
  }
}
