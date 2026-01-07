package com.signatech.service

import com.signatech.model.SocketMessage

object MessageHandler {

  def handle(msg: SocketMessage): SocketMessage = {
    msg.`type` match {
      case "ping" =>
        SocketMessage("pong", msg.payload)

      case _ =>
        SocketMessage("error", s"unknown message type: ${msg.`type`}")
    }
  }
}
