package com.signatech.websocket

import akka.actor.typed.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.ws.{Message, TextMessage, WebSocketRequest}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.scaladsl.{Flow, Keep, Sink, Source}
import akka.stream.{Materializer, OverflowStrategy}
import com.typesafe.scalalogging.StrictLogging
import io.circe.parser._
import io.circe.generic.auto._
import io.circe.syntax._

import scala.collection.mutable
import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.duration._
import scala.util.{Failure, Success}

case class LetterPrediction(`type`: String, value: String, confidence: Double)
case class FilteredResult(`type`: String, value: String, confidence: Double, filtered: Boolean)

class FilterWebSocketServer(implicit system: ActorSystem[_], ec: ExecutionContext, mat: Materializer)
    extends StrictLogging {

  private val host = "0.0.0.0"
  private val port = 8080

  // Buffer de filtrage
  private val letterBuffer = mutable.Queue[LetterPrediction]()
  private val WINDOW_SIZE = 3  // Réduit de 5 à 3 pour plus de réactivité
  private val MIN_OCCURRENCES = 2
  private val CONFIDENCE_THRESHOLD = 0.75  // Augmenté pour filtrer les faux positifs
  private var lastSent: Option[String] = None
  private var lastSentTime: Long = 0

  def routes: Route =
    pathPrefix("ws") {
      path("filter") {
        get {
          logger.info("[Scala Filter] Nouvelle connexion Node.js")
          handleWebSocketMessages(filterFlow)
        }
      } ~
      path("translate") {
        get {
          logger.info("[Scala] Connexion client (legacy)")
          handleWebSocketMessages(legacyFlow)
        }
      }
    } ~
    path("health") {
      get {
        complete("OK - SignaTech Scala Filter Server")
      }
    }

  /**
   * Flow de filtrage : reçoit les prédictions Python et filtre les répétitions
   */
  private def filterFlow: Flow[Message, Message, Any] =
    Flow[Message]
      .collect { case TextMessage.Strict(text) => text }
      .mapConcat { text =>
        decode[LetterPrediction](text) match {
          case Right(prediction) =>
            logger.info(s"[Scala Filter] Reçu: ${prediction.value} (${prediction.confidence})")
            
            val filtered = filterPrediction(prediction)
            
            filtered match {
              case Some(letter) =>
                logger.info(s"[Scala Filter] ✓ Envoi: $letter")
                List(FilteredResult("letter", letter, prediction.confidence, filtered = true).asJson.noSpaces)
              case None =>
                logger.debug(s"[Scala Filter] ✗ Filtré: ${prediction.value}")
                Nil
            }
            
          case Left(error) =>
            logger.error(s"[Scala Filter] Erreur parsing: $error")
            Nil
        }
      }
      .map(TextMessage(_))

  /**
   * Filtre les prédictions pour éviter les répétitions
   */
  private def filterPrediction(prediction: LetterPrediction): Option[String] = {
    val now = System.currentTimeMillis()
    
    // Réinitialiser lastSent après 2 secondes d'inactivité
    if (now - lastSentTime > 2000) {
      lastSent = None
    }
    
    // Ajouter au buffer
    letterBuffer.enqueue(prediction)
    if (letterBuffer.size > WINDOW_SIZE) {
      letterBuffer.dequeue()
    }

    // Si confiance très élevée (>95%) et différent de la dernière lettre, envoi immédiat
    if (prediction.confidence > 0.95 && !lastSent.contains(prediction.value)) {
      lastSent = Some(prediction.value)
      lastSentTime = now
      return Some(prediction.value)
    }

    // Compter les occurrences dans le buffer
    val letterCounts = letterBuffer
      .filter(_.confidence > CONFIDENCE_THRESHOLD)
      .groupBy(_.value)
      .view
      .mapValues(_.size)
      .toMap

    // Trouver la lettre la plus fréquente
    letterCounts.toSeq.sortBy(-_._2).headOption match {
      case Some((letter, count)) if count >= MIN_OCCURRENCES =>
        // Vérifier si c'est différent de la dernière envoyée
        if (!lastSent.contains(letter)) {
          lastSent = Some(letter)
          lastSentTime = now
          Some(letter)
        } else {
          None
        }
      case _ =>
        None
    }
  }

  /**
   * Flow legacy pour compatibilité
   */
  private def legacyFlow: Flow[Message, Message, Any] =
    Flow[Message]
      .collect { case TextMessage.Strict(text) => text }
      .map { text =>
        logger.debug(s"[Scala Legacy] Message: $text")
        TextMessage(s"""{"type":"echo","payload":"$text"}""")
      }

  def start(): Future[Http.ServerBinding] = {
    val binding = Http().newServerAt(host, port).bind(routes)

    binding.onComplete {
      case Success(b) =>
        logger.info(s"✓ Scala Filter Server démarré sur ${b.localAddress}")
        logger.info(s"  - ws://localhost:8080/ws/filter (filtrage)")
        logger.info(s"  - ws://localhost:8080/ws/translate (legacy)")
      case Failure(ex) =>
        logger.error(s"✗ Échec du démarrage Scala: ${ex.getMessage}")
    }

    binding
  }
}
