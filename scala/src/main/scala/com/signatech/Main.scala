package com.signatech

import akka.actor.typed.ActorSystem
import akka.actor.typed.scaladsl.Behaviors
import com.signatech.ai.inference.ModelRegistry
import com.signatech.websocket.WebSocketServer
import com.typesafe.scalalogging.StrictLogging

import scala.concurrent.ExecutionContextExecutor
import scala.io.StdIn

object Main extends StrictLogging {

  def main(args: Array[String]): Unit = {

    implicit val system: ActorSystem[Nothing] =
      ActorSystem(Behaviors.empty, "signatech")

    implicit val ec: ExecutionContextExecutor =
      system.executionContext

    logger.info("SignaTech AI - Démarrage")

    //Charger le modèle UNE SEULE FOIS (RAM / VRAM)
    val signModel = ModelRegistry.signRecognitionModel
    signModel.debug() // affiche inputs / outputs ONNX

    logger.info("✓ Modèle de reconnaissance chargé")

    // Démarrer le WebSocket
    val wsServer = new WebSocketServer()
    wsServer.start()

    println("=" * 60)
    println("✓ Scala SignaTech engine started")
    println("✓ WebSocket server: ws://localhost:8080/ws/translate")
    println("=" * 60)
    println("Press ENTER to stop...")

    StdIn.readLine()

    logger.info("Arrêt du serveur...")
    system.terminate()
  }
}
