package com.signatech.websocket.client

import akka.actor.typed.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.ws._
import akka.stream.scaladsl.{Flow, Sink, Source}
import com.signatech.websocket.model.PythonPrediction
import com.typesafe.scalalogging.StrictLogging
import io.circe.generic.auto._
import io.circe.parser.decode

import scala.concurrent.ExecutionContext

final class PythonAIClient(pythonWsUrl: String)(
  implicit system: ActorSystem[_],
  ec: ExecutionContext
) extends StrictLogging {

  private val incoming: Sink[Message, _] =
    Sink.foreach {
      case TextMessage.Strict(text) =>
        decode[PythonPrediction](text) match {
          case Right(p) =>
            logger.info(s"[AI] Lettre reçue : ${p.letter} (${p.confidence})")
          case Left(err) =>
            logger.error(s"[AI] JSON invalide: $err | raw=$text")
        }
      case _ => ()
    }

  private val outgoing: Source[Message, _] =
    Source.maybe // on n'envoie rien à Python pour l'instant

  private val flow: Flow[Message, Message, _] =
    Flow.fromSinkAndSource(incoming, outgoing)

  def connect(): Unit = {
    Http().singleWebSocketRequest(WebSocketRequest(pythonWsUrl), flow)
    logger.info(s"[AI] Connexion à Python: $pythonWsUrl")
  }
}
