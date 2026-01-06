package com.signatech

import java.io.{PrintStream, OutputStreamWriter}
import java.nio.charset.StandardCharsets
import com.signatech.service.EtablissementService
import com.signatech.model.Etablissement

object FetchEtablissements {
  def main(args: Array[String]): Unit = {
    // Configurer l'encodage UTF-8 pour la console
    System.setOut(new PrintStream(System.out, true, StandardCharsets.UTF_8))
    System.setErr(new PrintStream(System.err, true, StandardCharsets.UTF_8))
    
    try {
      val allRecords = EtablissementService.fetchAll()
      
      println(s"\n[OK] TOTAL ETABLISSEMENTS RECUPERES : ${allRecords.size}\n")

      allRecords.foreach { r =>
        val e = r.fields

        val siteWeb =
          e.web
            .orElse(e.url)
            .orElse(e.site_internet)
            .getOrElse("N/A")

        val position =
          (e.latitude, e.longitude) match {
            case (Some(lat), Some(lon)) => s"lat=$lat, lon=$lon"
            case _ => "N/A"
          }

        println("========================================")
        println(s"Nom        : ${e.nom_etablissement.getOrElse("N/A")}")
        println(s"Type       : ${e.type_etablissement.getOrElse("N/A")}")
        println(s"Statut     : ${e.statut_public_prive.getOrElse("N/A")}")
        println(s"Region     : ${e.libelle_region.getOrElse("N/A")}")
        println(s"Academie   : ${e.libelle_academie.getOrElse("N/A")}")
        println(s"Departement: ${e.libelle_departement.getOrElse("N/A")}")
        println(s"Site web   : $siteWeb")
        println(s"Position   : $position")
        println()
      }
    } catch {
      case e: Exception =>
        println(s"[ERREUR] : ${e.getMessage}")
        sys.exit(1)
    }
  }
}
