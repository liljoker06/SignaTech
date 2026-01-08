package com.signatech.ai.inference

import ai.onnxruntime._
import com.signatech.ai.config.ModelPaths
import com.signatech.ai.model.SignPrediction

import java.nio.FloatBuffer
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

  private val numberOfFeatures = 258
  private val numberOfGlosses = 100

  /** Mapping temporaire index → gloss (sera remplacé par un vrai fichier plus
    * tard)
    */
  private val glossLabels: Vector[String] =
    (0 until numberOfGlosses).map(i => s"GLOSS_$i").toVector

  def debug(): Unit = {
    println("====== SIGN RECOGNITION MODEL ======")
    println("Model path : " + paths.signRecognitionModelPath)
    println("Inputs  : " + session.getInputNames.asScala)
    println("Outputs : " + session.getOutputNames.asScala)
    println("===================================")
  }

  def debugIO(): Unit = {
    session.getInputInfo.forEach { (name, info) =>
      println(s"[ONNX] INPUT  $name -> $info")
    }

    session.getOutputInfo.forEach { (name, info) =>
      println(s"[ONNX] OUTPUT $name -> $info")
    }
  }

  /** Inference ONNX réelle (CPU)
    */
  def predict(poseSequence: Array[Float]): SignPrediction = {

    val timeSteps = poseSequence.length / numberOfFeatures

    require(
      poseSequence.length == timeSteps * numberOfFeatures,
      s"Invalid pose sequence length: expected multiple of $numberOfFeatures"
    )

    // Création du tensor d'entrée
    val inputBuffer: FloatBuffer =
      FloatBuffer.wrap(poseSequence)

    val inputTensor: OnnxTensor =
      OnnxTensor.createTensor(
        OnnxRuntimeProvider.instance.environment,
        inputBuffer,
        Array(1L, timeSteps.toLong, numberOfFeatures.toLong)
      )

    val inputMap =
      Map("pose_seq" -> inputTensor).asJava

    // Exécution ONNX
    val result: OrtSession.Result =
      session.run(inputMap)

    val outputTensor =
      result.get("gloss_logits").get().asInstanceOf[OnnxTensor]

    val rawLogits: Array[Float] =
      outputTensor.getFloatBuffer.array()

    // On récupère le dernier timestep
    val offsetForLastFrame =
      (timeSteps - 1) * numberOfGlosses

    val lastFrameLogits: Array[Float] =
      rawLogits.slice(
        offsetForLastFrame,
        offsetForLastFrame + numberOfGlosses
      )

    // Softmax + argmax
    val probabilities = softmax(lastFrameLogits)
    val bestGlossIndex = argmax(probabilities)

    val predictedGloss = glossLabels(bestGlossIndex)
    val confidenceScore = probabilities(bestGlossIndex)

    // Nettoyage mémoire native
    inputTensor.close()
    outputTensor.close()
    result.close()

    SignPrediction(
      gesture = predictedGloss,
      confidence = confidenceScore,
      timestamp = System.currentTimeMillis(),
      alternatives = probabilities.zipWithIndex
        .sortBy(-_._1)
        .take(5)
        .map { case (_, index) => glossLabels(index) }
        .toList
    )
  }

  // ===== Utils math propres =====

  private def argmax(values: Array[Float]): Int =
    values.zipWithIndex.maxBy(_._1)._2

  private def softmax(values: Array[Float]): Array[Float] = {
    val maxValue = values.max
    val expValues = values.map(v => math.exp(v - maxValue).toFloat)
    val sumExp = expValues.sum
    expValues.map(_ / sumExp)
  }
}
