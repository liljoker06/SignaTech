package com.signatech.websocket.model

final case class PythonPrediction(
  `type`: String,
  letter: String,
  confidence: Double,
  timestamp: Long
)
