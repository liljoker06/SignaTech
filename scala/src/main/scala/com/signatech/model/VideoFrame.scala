package com.signatech.model

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto._

/**
 * Frame vidéo envoyée par le client
 */
final case class VideoFrame(
  frameData: String, // Base64 encoded frame
  timestamp: Long,
  userId: String
)

object VideoFrame {
  implicit val encoder: Encoder[VideoFrame] = deriveEncoder
  implicit val decoder: Decoder[VideoFrame] = deriveDecoder
}
