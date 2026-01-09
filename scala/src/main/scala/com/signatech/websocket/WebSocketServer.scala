package com.signatech.websocket

import akka.actor.typed.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.scaladsl.Flow
import com.signatech.model.{SocketMessage, VideoFrame}
import com.signatech.websocket.model.{PredictionPayload, PredictionResponse}
import com.typesafe.config.ConfigFactory
import com.typesafe.scalalogging.StrictLogging
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

class WebSocketServer(implicit system: ActorSystem[_], ec: ExecutionContext)
    extends StrictLogging {

  private val config = ConfigFactory.load()
  private val host = config.getString("signatech.websocket.host")
  private val port = config.getInt("signatech.websocket.port")

  def routes: Route =
    pathPrefix("ws") {
      path("translate") {
        get {
          logger.info("[WebSocket] Nouvelle connexion client")
          handleWebSocketMessages(translationFlow)
        }
      }
    } ~
      path("health") {
        get {
          complete("OK - SignaTech AI WebSocket Server")
        }
      }

  private def translationFlow: Flow[Message, Message, Any] =
    Flow[Message]
      .collect { case TextMessage.Strict(text) => text }
      .map(processMessage)
      .map(TextMessage(_))

  private def processMessage(text: String): String =
    decode[SocketMessage](text) match {
      case Right(msg) =>
        logger.debug(
          s"[WebSocket] Message reçu: ${msg.`type`} → ${msg.payload.take(50)}..."
        )

        msg.`type` match {
          case "video_frame" => processVideoFrame(msg.payload)
          case "ping"        => """{"type":"pong","payload":""}"""
            case other         =>
            logger.warn(s"[WebSocket] Type inconnu: $other")
            s"""{"type":"error","payload":"Type de message inconnu: $other"}"""
        }

      case Left(error) =>
        logger.error(s"[WebSocket] Erreur parsing JSON: $error")
        s"""{"type":"error","payload":"Format JSON invalide"}"""
    }

  private def processVideoFrame(payload: String): String =
    decode[VideoFrame](payload) match {
      case Right(frame) =>
        logger.info(s"[WebSocket] Frame reçu: ${frame.timestamp}")
        
        // TODO: Envoyer la frame au service Python AI (ai_service)
        // et attendre la réponse de prédiction
        
        PredictionResponse(
          `type` = "prediction",
          payload = PredictionPayload(
            gesture = "TODO",
            confidence = 0.0,
            timestamp = System.currentTimeMillis(),
            alternatives = List.empty,
            processingTimeMs = 0L
          )
        ).asJson.noSpaces

      case Left(error) =>
        logger.error(s"[WebSocket] Erreur parsing VideoFrame: $error")
        s"""{"type":"error","payload":"Format VideoFrame invalide"}"""
    }

  def start(): Future[Http.ServerBinding] = {
    val binding =
      Http().newServerAt(host, port).bind(routes)

    binding.onComplete {
      case Success(b) =>
        logger.info(s"✓ WebSocket server démarré sur ${b.localAddress}")
      case Failure(ex) =>
        logger.error(s"✗ Échec du démarrage WebSocket: ${ex.getMessage}")
    }

    binding
  }
}
