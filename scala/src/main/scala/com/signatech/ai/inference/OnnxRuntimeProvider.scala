package com.signatech.ai.inference

import ai.onnxruntime.{OrtEnvironment, OrtSession, OrtException}
import com.typesafe.scalalogging.StrictLogging

import java.util.concurrent.ConcurrentHashMap

final class OnnxRuntimeProvider private () extends StrictLogging {

  private val env: OrtEnvironment = OrtEnvironment.getEnvironment
  private val sessions = new ConcurrentHashMap[String, OrtSession]()

  /** Charge (ou renvoie) une session ONNX. tente CUDA si échec -> CPU */
  def getSession(modelPath: String, preferCuda: Boolean = true): OrtSession = {
    sessions.computeIfAbsent(modelPath, _ => createSession(modelPath, preferCuda))
  }

  private def createSession(modelPath: String, preferCuda: Boolean): OrtSession = {
    val options = new OrtSession.SessionOptions()

    if (preferCuda) {
      try {
        // Nécessite onnxruntime-gpu + CUDA libs compatibles sur la machine
        options.addCUDA()
        logger.info(s"[ONNX] CUDA enabled for model: $modelPath")
      } catch {
        case e: Throwable =>
          logger.warn(s"[ONNX] CUDA not available, fallback to CPU for: $modelPath (${e.getMessage})")
      }
    } else {
      logger.info(s"[ONNX] Using CPU for model: $modelPath")
    }

    try {
      env.createSession(modelPath, options)
    } catch {
      case e: OrtException =>
        logger.error(s"[ONNX] Failed to create session for: $modelPath", e)
        throw e
    }
  }

  def close(): Unit = {
    val it = sessions.values().iterator()
    while (it.hasNext) {
      try it.next().close()
      catch { case _: Throwable => () }
    }
    sessions.clear()
    try env.close()
    catch { case _: Throwable => () }
  }
}

object OnnxRuntimeProvider {
  // Singleton simple pour ton app (server)
  lazy val instance: OnnxRuntimeProvider = new OnnxRuntimeProvider()
}
