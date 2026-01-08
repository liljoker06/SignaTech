package com.signatech.websocket.model

import com.signatech.ai.model.SignPrediction

final case class PredictionPayload(
  gesture: String,
  confidence: Double,
  timestamp: Long,
  alternatives: List[String],
  processingTimeMs: Long
)

final case class PredictionResponse(
  `type`: String,
  payload: PredictionPayload
)
