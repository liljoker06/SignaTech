package com.signatech

import akka.actor.typed.ActorSystem
import akka.actor.typed.scaladsl.Behaviors
import com.signatech.websocket.FilterWebSocketServer
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
    // DÉMARRAGE WS SCALA (FILTRAGE)
    // =====================
    val filterServer = new FilterWebSocketServer()
    filterServer.start()

    println("=" * 60)
    println("✓ Scala SignaTech Filter Server started")
    println("✓ WebSocket filter: ws://localhost:8080/ws/filter")
    println("✓ Filtre les répétitions de lettres prédites par Python")
    println("=" * 60)
    println("Press ENTER to stop...")

    StdIn.readLine()

    logger.info("Arrêt du serveur...")
    system.terminate()
  }
}
