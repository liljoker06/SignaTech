package com.signatech.repository

import com.signatech.db.Database
import com.signatech.model.Etablissement

class SchoolRepository {

  def insert(e: Etablissement): Unit = {
    val conn = Database.getConnection()

    val sql =
      """
        INSERT INTO schools (
          name, description, , country, website, contact_email, latitude, longitude
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      """

    val ps = conn.prepareStatement(sql)

    // 1️⃣ name
    ps.setString(1, e.nom_etablissement.orNull)

    // 2️⃣ description (on garde académie ici)
    val descriptionParts = Seq(
      e.type_etablissement,
      e.statut_public_prive,
      e.libelle_region,
      e.libelle_academie,
      e.libelle_departement
    ).flatten
    ps.setString(2, if (descriptionParts.isEmpty) null else descriptionParts.mkString(" | "))

    // 3️⃣ city
    ps.setString(3, e.libelle_departement.orNull)

    // 4️⃣ country
    ps.setString(4, "France")

    // 5️⃣ website
    val website = e.site_internet.orElse(e.web).orElse(e.url).orNull
    ps.setString(5, website)

    // 6️⃣ contact_email
    ps.setNull(6, java.sql.Types.VARCHAR)

    // 7️⃣ latitude
    e.latitude match {
      case Some(lat) => ps.setDouble(7, lat)
      case None => ps.setNull(7, java.sql.Types.DOUBLE)
    }

    // 8️⃣ longitude
    e.longitude match {
      case Some(lon) => ps.setDouble(8, lon)
      case None => ps.setNull(8, java.sql.Types.DOUBLE)
    }

    ps.executeUpdate()
    ps.close()
    conn.close()
  }
}
