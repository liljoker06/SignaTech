package com.signatech.db

import java.sql.{Connection, DriverManager}

object Database {

  private val url = "jdbc:postgresql://localhost:5432/signatech"
  private val user = "postgres"
  private val password = "root"

  def getConnection(): Connection = {
    DriverManager.getConnection(url, user, password)
  }
}
