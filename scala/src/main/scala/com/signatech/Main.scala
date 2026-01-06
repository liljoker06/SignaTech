package com.signatech

import akka.actor.ActorSystem
import com.signatech.websocket.WebSocketServer
import scala.io.StdIn

object Main {
  def main(args: Array[String]): Unit = {
    implicit val system: ActorSystem = ActorSystem("signatech")
    implicit val ec = system.dispatcher

    WebSocketServer.start()

    println("Scala SignaTech engine started. Press Ctrl+C to stop.")
    StdIn.readLine()

    println("Shutting down...")
    system.terminate()
  }
}
