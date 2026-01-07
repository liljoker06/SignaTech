file:///D:/Cours/scala/SignaTech/scala/src/main/scala/com/signatech/service/MessageHandler.scala
empty definition using pc, found symbol in pc: 
semanticdb not found
empty definition using fallback
non-local guesses:
	 -msg/`type`.
	 -msg/`type`#
	 -msg/`type`().
	 -scala/Predef.msg.`type`.
	 -scala/Predef.msg.`type`#
	 -scala/Predef.msg.`type`().
offset: 332
uri: file:///D:/Cours/scala/SignaTech/scala/src/main/scala/com/signatech/service/MessageHandler.scala
text:
```scala
package com.signatech.service

import com.signatech.model.SocketMessage

object MessageHandler {

  def handle(msg: SocketMessage): SocketMessage = {
    msg.`type` match {
      case "ping" =>
        SocketMessage("pong", msg.payload)

      case _ =>
        SocketMessage("error", s"unknown message type: ${msg.`type@@`}")
    }
  }
}

```


#### Short summary: 

empty definition using pc, found symbol in pc: 