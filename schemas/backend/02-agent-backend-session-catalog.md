# Agent ↔ Backend – Support-Session-Katalog

Status: Wartet auf Implementierungserkenntnisse

## Zweck

Dieses Dokument sammelt die aus Konzept und Ablaufbeschreibung explizit ableitbaren Elemente der REST-Schnittstelle zwischen RooK Agent und RooK Backend.

Es dient als Arbeitsgrundlage fuer die spaetere OpenAPI-Spezifikation. Nicht festgelegte Details bleiben bewusst offen und muessen vor weiterer Schaerfung per Rueckfrage geklaert werden.

## Explizit bekannte Rahmendaten

* Transport: HTTPS
* Stil: REST
* Beteiligte Systeme:
  * RooK Agent als Client
  * RooK Backend als serverseitige Control Plane

## Explizit bekannte Aufgaben der Schnittstelle

* Support-Sitzung registrieren
* Zustand melden
* PIN abrufen
* Heartbeats senden
* Session beenden

## Explizit bekannte typische Operationen

* Support-Session starten
* Session-Status abrufen
* Session-Lebenszeichen senden
* Session schließen

## Aus dem Ablauf direkt ableitbare Fakten

* Der Agent startet die Support-Sitzung beim Backend erst nach erfolgreichem VPN-Aufbau.
* Das Backend erzeugt einen kurzlebigen 4-stelligen PIN.
* Der PIN wird der aktiven Konsolen-Sitzung zugeordnet.
* Nach manuellem Ende, Timeout oder Reboot wird die Session beendet.
* Mit Ende der Session wird der PIN ungültig.

## Bereits festgelegte Architekturentscheidungen

* Der Agent legt die Support-Session aktiv per `POST` an.
* Der Start-Endpunkt liefert den PIN direkt in der Response zurueck.
* Die Authentisierung des Agent gegenueber dem Backend stuetzt sich ausschliesslich auf die aktive VPN-Verbindung.
* URL-Muster: `/api/console/{VERSIONSNUMMER}/{OPERATION}`
* Aktuelle Versionsnummer im Pfad: `1`
* Operationsnamen:
  * `beginsession`
  * `endsession`
  * `status`
  * `ping`
* Alle Requests dieser Schnittstelle verwenden `POST`.
* Heartbeat-Frequenz: alle 10 Sekunden.
* Grace Period: 3 Heartbeats.
* Timeout: 30 Sekunden.
* Doppelte Startanfragen: Es gewinnt immer die letzte Startanfrage.
* Heartbeats innerhalb der Grace Period werden normal gewertet.
* Heartbeats nach Ablauf der Grace Period werden ignoriert.
* Laufende Heartbeats halten die Support-Session offen, auch wenn aktuell kein Servicemitarbeiter verbunden ist.
* Das Ende einer Browser- oder Mitarbeiteraktivitaet beendet die Support-Session nicht automatisch.
* Vertrauen gilt, solange Heartbeats fuer eine Session eingehen und `pin` sowie erkannte IP-Adresse zur Session passen.
* Aendert sich die erkannte IP-Adresse bei einem Heartbeat, wird die in der Session hinterlegte IP-Adresse aktualisiert.
* Die Schnittstelle arbeitet vorlaeufig mit einem vereinfachten Vertrauensmodell.

## Fachliche Hauptressource

### Support-Session

Mindestens fachlich ableitbar:

* eine serverseitig verwaltete Session fuer einen aktiven Supportfall
* an diese Session ist ein kurzlebiger PIN gekoppelt
* die Session wird durch Heartbeats am Leben gehalten
* die Session kann beendet oder abgelaufen sein

Noch offen:

* technische Identifikatoren der Session
* vollstaendige Datenfelder der Session-Repräsentation

Festgelegt:

* eine Session ist `open`, wenn sich eine Konsole anmeldet und die Session ohne aktiven Servicemitarbeiter weiterlaufen kann
* eine Session ist `active`, wenn ein Servicemitarbeiter verbunden ist
* eine Session geht bei ausbleibendem Heartbeat nach der Grace Period auf `closed`
* geschlossene Sessions werden nach einer Stunde geloescht, damit die PIN wiederverwendet werden kann
* faellt eine Session von `active` auf `open` zurueck, bleibt sie durch Agent-Heartbeats weiter gueltig
* minimale Session-Felder sind `status`, `pin` und `ipAddress`

## Offene Architekturfragen

* Wie wird das VPN-basierte Vertrauensmodell technisch am Backend durchgesetzt?
* Welche Session-Datenfelder werden ueber `status`, `pin` und `ipAddress` hinaus spaeter noch benoetigt?
* Reicht fuer `status` und `endsession` der bestehende Transportkontext, oder muessen diese Requests ebenfalls den `pin` mitgeben?
* Wie sieht das vollstaendige minimale Response-Modell fuer Start und Status aus?

## Verbindliche Arbeitsregel

* Es duerfen keine zusaetzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rueckfrage geklaert.
* Jede Klaerung aktualisiert dieses Dokument und den zugehoerigen Plan.
