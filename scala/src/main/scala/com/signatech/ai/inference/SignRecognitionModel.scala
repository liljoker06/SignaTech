package com.signatech.ai.inference

import ai.onnxruntime._
import com.signatech.ai.config.ModelPaths
import com.signatech.ai.model.SignPrediction

import scala.jdk.CollectionConverters._

final class SignRecognitionModel(
  paths: ModelPaths,
  preferCuda: Boolean
) {

  private val session: OrtSession =
    OnnxRuntimeProvider.instance.getSession(
      paths.signRecognitionModelPath,
      preferCuda
    )

  def debug(): Unit = {
    println("====== SIGN RECOGNITION MODEL ======")
    println("Model path : " + paths.signRecognitionModelPath)
    println("Inputs  : " + session.getInputNames.asScala)
    println("Outputs : " + session.getOutputNames.asScala)
    println("===================================")
  }

  /**
   * STUB TEMPORAIRE
   * Le vrai calcul ONNX viendra ensuite
   */
  def predict(any: Any): SignPrediction = {
    SignPrediction(
      gesture = "NOT_READY",
      confidence = 0.0,
      timestamp = System.currentTimeMillis(),
      alternatives = List.empty
    )
  }
}
