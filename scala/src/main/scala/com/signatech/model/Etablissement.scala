package com.signatech.model

case class Etablissement(
  nom_etablissement: Option[String],
  type_etablissement: Option[String],
  statut_public_prive: Option[String],
  libelle_region: Option[String],
  libelle_academie: Option[String],
  libelle_departement: Option[String],
  web: Option[String],
  url: Option[String],
  site_internet: Option[String],
  latitude: Option[Double],
  longitude: Option[Double]
)

case class Record(fields: Etablissement)
