package com.signatech.service

import sttp.client3._
import io.circe._
import io.circe.parser._
import io.circe.generic.auto._
import com.signatech.model.{Etablissement, Record}

object EtablissementService {
  
  def fetchAll(): List[Record] = {
    val backend = HttpURLConnectionBackend()
    val pageSize = 100
    var start = 0
    var total = Int.MaxValue
    var allRecords = List.empty[Record]

    while (start < total) {
      val url =
        s"https://data.education.gouv.fr/api/records/1.0/search/?" +
        s"dataset=fr-en-carto-acc-sensoriel" +
        s"&rows=$pageSize" +
        s"&start=$start"

      val response = basicRequest
        .get(uri"$url")
        .response(asString)
        .send(backend)

      response.body match {
        case Left(err) =>
          throw new RuntimeException(s"Erreur HTTP : $err")

        case Right(body) =>
          parse(body) match {
            case Left(err) =>
              throw new RuntimeException(s"Erreur JSON : $err")

            case Right(json) =>
              val cursor = json.hcursor
              val records = cursor.downField("records").as[List[Record]].getOrElse(Nil)
              total = cursor.downField("nhits").as[Int].getOrElse(0)

              allRecords = allRecords ++ records
              start += pageSize

              println(s"[INFO] Telecharge ${allRecords.size} / $total")
          }
      }
    }

    allRecords
  }
}
