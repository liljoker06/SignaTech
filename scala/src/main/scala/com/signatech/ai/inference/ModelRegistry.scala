package com.signatech.ai.inference

import com.signatech.ai.config.ModelPaths

/**
 * Registre des modèles IA
 * Chargés UNE SEULE FOIS
 */
object ModelRegistry {

  private val paths = ModelPaths.local()
  private val preferCuda = true // Préférer CUDA si disponible pour les tdc qui le supportent pas force à vous CPU

  lazy val signRecognitionModel: SignRecognitionModel =
    new SignRecognitionModel(paths, preferCuda)
}
