# Web-Frontend ↔ Backend – Session- und Grant-Katalog

Status: Wartet auf Implementierungserkenntnisse

## Zweck

Dieses Dokument sammelt die aus Konzept und Ablaufbeschreibung explizit ableitbaren Elemente der REST-Schnittstelle zwischen Web-Frontend und RooK Backend.

Es dient als Arbeitsgrundlage fuer die spaetere OpenAPI-Spezifikation. Nicht festgelegte Details bleiben bewusst offen und muessen vor weiterer Schaerfung per Rueckfrage geklaert werden.

## Explizit bekannte Rahmendaten

* Transport: HTTPS
* Stil: REST
* Beteiligte Systeme:
  * Web-Frontend des RooK-Teams als Client
  * RooK Backend als serverseitige Control Plane

## Explizit bekannte Aufgaben der Schnittstelle

* Benutzer-Login
* PIN-Eingabe
* Session-Auswahl
* Terminal-Zugang anfordern
* Session-Status anzeigen

## Aus dem Ablauf direkt ableitbare Fakten

* Ein RooK-Mitarbeiter meldet sich im Web-Frontend an.
* Der Mitarbeiter gibt einen PIN ein.
* Das Backend findet die zugehoerige aktive Konsolen-Sitzung.
* Das Backend erstellt eine kurzlebige Terminal-Berechtigung.
* Das Web-Frontend oeffnet anschliessend ein Browser-Terminal.

## Bereits festgelegte Produktentscheidungen

* Der Team-Login liegt ausserhalb dieser API und wird ueber Drupal-Standards abgedeckt.
* Die PIN-Eingabe koppelt oder reserviert die Session direkt fuer den Mitarbeiter.
* Ein Mitarbeiter kann mehrere Sessions parallel bedienen, indem er mehrere Browserfenster verwendet.
* Das Frontend zeigt aktuell nur den Session-Status an.
* Die Terminal-Berechtigung ist ein opaque Token.
* Die Terminal-Berechtigung ist fuer den jeweiligen Mitarbeiter so lange gueltig, wie die Session laeuft oder die Terminalverbindung getrennt wird.
* Das Token ist grundsaetzlich nicht wiederverwendbar.
* Ausnahme: Innerhalb des 30-Sekunden-Reconnect-Fensters darf derselbe Grant fuer eine neue Browser-Sitzung erneut verwendet werden.
* Fuer diese API wird die Rolle `Service` vorausgesetzt.
* Ein expliziter manueller Session-Ende-Endpunkt im Frontend ist zunaechst nicht vorgesehen.
* URL-Muster: `/api/client/{VERSION}/{OPERATION}`
* Alle Requests dieser Schnittstelle verwenden `POST`.
* Aktuelle Versionsnummer im Pfad: `1`
* Operationsnamen:
  * `pinlookup`
  * `sessionstatus`
  * `requestshell`
* Die Kopplung der Session an den Mitarbeiter bleibt fuer das Frontend implizit.
* Wenn ein Mitarbeiter fuer eine Session ein Terminal anfordert, erzeugt das Backend automatisch ein Token, das Mitarbeiter und Session koppelt.
* Es ist erlaubt, dass mehrere Mitarbeiter gleichzeitig an dieselbe Session gekoppelt sind.
* Fuer die erste technische Umsetzung tragen `pinlookup`, `sessionstatus` und `requestshell` jeweils explizite Session-/PIN-Daten im Request.

## Fachliche Hauptressourcen

### Support-Session

Mindestens fachlich ableitbar:

* aktive oder relevante Support-Sitzung zur Anzeige im Frontend
* anhand des PIN auffindbar
* mit einem sichtbaren Status versehen

Noch offen:

* derzeit keine weiteren offenen Fragen zu Sichtfeldern und Rollenstruktur

### Terminal-Berechtigung

Mindestens fachlich ableitbar:

* kurzlebige Berechtigung zum Oeffnen des Browser-Terminals
* wird durch das Backend erzeugt
* wird spaeter durch das Gateway validiert

Noch offen:

* keine weiteren offenen Fragen zum Grundmodell der Terminal-Berechtigung ausser fachlichen Fehlerfaellen

## Offene Architekturfragen

* Welche fachlichen Fehlercodes sollen als erste verbindliche Eintraege reserviert werden?

## Verbindliche Arbeitsregel

* Es duerfen keine zusaetzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rueckfrage geklaert.
* Jede Klaerung aktualisiert dieses Dokument und den zugehoerigen Plan.
