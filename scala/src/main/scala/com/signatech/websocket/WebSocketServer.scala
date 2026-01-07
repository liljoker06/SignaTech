package com.signatech.websocket

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.ws._
import akka.http.scaladsl.server.Directives._
import akka.stream.scaladsl._

import com.signatech.model.SocketMessage
import com.signatech.service.MessageHandler

import io.circe.parser._
import io.circe.syntax._
import io.circe.generic.auto._

import scala.concurrent.ExecutionContextExecutor

object WebSocketServer {

  def start()(implicit system: ActorSystem, ec: ExecutionContextExecutor): Unit = {

    val wsFlow: Flow[Message, Message, Any] =
      Flow[Message].collect {
        case TextMessage.Strict(text) =>
          decode[SocketMessage](text) match {

            case Right(msg) =>
              println(s" ${msg.`type`} → ${msg.payload}")

              val response = MessageHandler.handle(msg)

              TextMessage(response.asJson.noSpaces)

            case Left(_) =>
              TextMessage("""{"type":"error","payload":"invalid json"}""")
          }
      }

    val route =
      path("ws") {
        handleWebSocketMessages(wsFlow)
      }

    Http().newServerAt("0.0.0.0", 9001).bind(route)

    println("Scala WebSocket listening on ws://localhost:9001/ws")
  }
}
