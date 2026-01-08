package com.signatech.ai.config

final case class ModelPaths(
  signRecognitionModelPath: String
)

object ModelPaths {

  def local(): ModelPaths =
    ModelPaths(
      signRecognitionModelPath =
        "src/main/scala/models/sign/sign-recognition.onnx"
    )
}
