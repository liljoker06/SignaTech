package com.signatech.bootstrap

import com.signatech.service.EtablissementService
import com.signatech.repository.SchoolRepository

object AutoImport {

  def run(): Unit = {
    println(" AUTOIMPORT RUN CALLED")

    val records = EtablissementService.fetchAll()
    val repo = new SchoolRepository

    records.foreach { record =>
      repo.insert(record.fields)
    }

    println(s"[BOOT] Import terminé : ${records.size} établissements")
  }
}
