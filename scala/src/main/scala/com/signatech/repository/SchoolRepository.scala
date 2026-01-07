package com.signatech.repository

import com.signatech.db.Database
import com.signatech.model.Etablissement

class SchoolRepository {

  def insert(e: Etablissement): Unit = {
    val conn = Database.getConnection()

    val sql =
      """
        INSERT INTO schools (
          name, description, city, country, website
        ) VALUES (?, ?, ?, ?, ?)
      """

    val ps = conn.prepareStatement(sql)

    ps.setString(1, e.nom_etablissement.orNull)
    ps.setString(2, e.libelle_region.orNull)
    ps.setString(3, e.libelle_departement.orNull)
    ps.setString(4, "France")

    val website =
      e.site_internet
        .orElse(e.web)
        .orElse(e.url)
        .orNull

    ps.setString(5, website)

    ps.executeUpdate()
    ps.close()
    conn.close()
  }
}
