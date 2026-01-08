package com.signatech.ai.model

final case class SignPrediction(
  gesture: String,
  confidence: Double,
  timestamp: Long,
  alternatives: List[String]
)