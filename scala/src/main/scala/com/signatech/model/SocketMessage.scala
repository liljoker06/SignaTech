package com.signatech.model

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto._

/**
 * Message WebSocket générique
 * Utilisé pour router les messages côté serveur
 */
final case class SocketMessage(
  `type`: String,
  payload: String
)

object SocketMessage {
  implicit val encoder: Encoder[SocketMessage] = deriveEncoder
  implicit val decoder: Decoder[SocketMessage] = deriveDecoder
}
