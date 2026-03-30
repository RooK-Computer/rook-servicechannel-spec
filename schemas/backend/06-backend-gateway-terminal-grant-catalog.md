# Backend ↔ Gateway – Terminal-Grant-Katalog

Status: Wartet auf Implementierungserkenntnisse

## Zweck

Dieses Dokument sammelt die aus Konzept und bereits geklaerten Nachbarplaenen ableitbaren Elemente der Schnittstelle zwischen RooK Backend und Terminal-Gateway fuer die Ausgabe und Validierung von Terminal-Berechtigungen.

Es dient als Arbeitsgrundlage fuer die spaetere Spezifikation des Grant-Lebenszyklus. Nicht festgelegte Details bleiben bewusst offen und muessen vor weiterer Schaerfung per Rueckfrage geklaert werden.

## Explizit bekannte Rahmendaten

* Das Backend stellt eine kurzlebige Terminal-Berechtigung aus.
* Das Gateway validiert diese Berechtigung, bevor es die Verbindung zur Konsole aufbaut.
* Das Gateway fragt mit dem Token Session-Metadaten beim Backend an.

## Bereits konsistent aus Nachbarplaenen ableitbar

* Das Token ist ein opaque Token.
* Das Token wird vom Web-Frontend ueber den Header an das Gateway uebergeben.
* Das Token ist grundsaetzlich nicht wiederverwendbar.
* Ausnahme: Innerhalb des 30-Sekunden-Reconnect-Fensters darf derselbe Grant fuer eine neue Browser-Sitzung erneut verwendet werden.
* Das Token ist fuer den Mitarbeiter so lange gueltig, wie die Session laeuft oder bis die Terminalverbindung getrennt wird.
* Das Token koppelt Mitarbeiter und Session.
* Das Gateway verwendet das Token, um die zugehoerigen Session-Metadaten vom Backend zu erhalten.

## Bereits festgelegte Architekturentscheidungen

* Gateway und Backend laufen auf demselben System, das Backend bleibt aber ueber seine oeffentliche HTTPS-URL erreichbar.
* Die Grant-Validierung erfolgt online gegen das Backend.
* Der Grant ist an Drupal-User, Session und die ueber den PIN identifizierte Konsole gekoppelt.
* Die Konsole wird dabei ueber den Session-Kontext und die hinterlegte IP-Adresse mitgebunden.
* Bei erfolgreicher Validierung gilt der Grant sofort als eingeloest und damit verbraucht.
* Es gibt keine zusaetzlichen Minimalinformationen im Grant selbst jenseits des opaque Tokens.
* Die Grant-Pruefung muss nicht gesondert auditiert werden.
* Wenn die Browser-Sitzung abbricht, beendet der Gateway die Verbindung mit 30 Sekunden Verzoegerung, um ein Wiederverbinden zu ermoeglichen.
* Plan 06 darf nicht ueberspezifischer werden als Plan 03 bis Plan 05.
* URL-Muster fuer die Validierung: `/api/gateway/{VERSION}/{OPERATION}`.
* Aktuelle Validierungsoperation: `/api/gateway/1/validateToken` per `POST`.
* Bei erfolgreicher Validierung werden dem Gateway nur die technisch noetigen Daten fuer den SSH-Sitzungsaufbau zurueckgegeben, aktuell mindestens die Konsolen-IP-Adresse.
* Wenn Revocation oder Sitzungsende nach erfolgreicher Validierung eintreten, baut der Gateway sowohl die Browser- als auch die Konsolenverbindung ab, um eine frische Umgebung zu erzwingen.

## Fachliche Hauptressourcen

### Terminal-Grant

Mindestens fachlich ableitbar:

* vom Backend ausgestellte Berechtigung
* an Session und Mitarbeiter gebunden
* durch das Gateway validierbar

Noch offen:

* keine weiteren offenen Fragen zur Minimalfeldliste des Grants
* keine weiteren offenen Fragen zur aktuellen Grundform der Validierungsoperation

### Grant-Validierung

Mindestens fachlich ableitbar:

* findet vor Aufbau der Gateway-zu-Konsole-Verbindung statt
* liefert dem Gateway Session-Metadaten fuer die Zielidentifikation

Noch offen:

* wie die fachliche Fehlercode-Liste und Fehlerklassifikation aussehen

## Offene Architekturfragen

* Welche fachlichen Fehlercodes sollen als erste verbindliche Eintraege reserviert werden?
* Wie werden Validierungsfehler fachlich von Backend-Ausfaellen getrennt?

## Verbindliche Arbeitsregel

* Es duerfen keine zusaetzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rueckfrage geklaert.
* Jede Klaerung aktualisiert dieses Dokument und den zugehoerigen Plan.