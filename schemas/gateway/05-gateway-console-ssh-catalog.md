# Gateway ↔ Konsole – SSH-over-VPN-Katalog

Status: Wartet auf Implementierungserkenntnisse

## Zweck

Dieses Dokument sammelt die aus Konzept und Ablaufbeschreibung explizit ableitbaren Elemente der serverseitigen Verbindung vom Terminal-Gateway zur Konsole.

Es dient als Arbeitsgrundlage fuer die spaetere Spezifikation der SSH-over-VPN-Verbindung. Nicht festgelegte Details bleiben bewusst offen und muessen vor weiterer Schaerfung per Rueckfrage geklaert werden.

## Explizit bekannte Rahmendaten

* Transport: SSH ueber das OpenVPN-Netz
* Beteiligte Systeme:
  * Terminal-Gateway als initiierender Client
  * Konsole als Zielsystem
* Aufgabe:
  * Aufbau der Shell-Sitzung zur richtigen Konsole
  * Weiterleitung der Terminaldaten

## Aus dem Ablauf direkt ableitbare Fakten

* Das Gateway baut die eigentliche Verbindung zur Konsole serverseitig auf.
* Der Browser kennt die Konsole nicht direkt und verbindet sich nicht selbst zur Zielkonsole.
* Die Verbindung zur Konsole wird erst nach erfolgreicher Validierung der Terminal-Berechtigung aufgebaut.
* Sitzungsende oder Reboot beenden den Support-Zustand.

## Bereits festgelegte Architekturentscheidungen

* Beim Verbindungsaufbau des Browsers wird das Token uebermittelt.
* Das Gateway fragt mit diesem Token die Session-Metadaten beim Backend an.
* Ueber die in den Session-Metadaten hinterlegte IP-Adresse wird die Zielkonsole identifiziert.
* Fuer die SSH-Authentisierung wird ein Gateway-Schluessel verwendet.
* Dieser Schluessel wird als `authorized_keys`-Eintrag auf den Konsolen hinterlegt.
* Es wird kein eigener kurzlebiger Zugang pro Support-Sitzung angelegt.
* Die SSH-Credentials werden vom Team gepflegt, das Gateway implementiert und betreibt.
* Der SSH-Login erfolgt ueber den Account `pi`.
* Laufzeit und Rotation des Gateway-Schluessels werden nicht in dieser Spezifikation festgelegt.
* Die Shell soll sich moeglichst wie ein regulaeres Terminal verhalten, so dass auch Werkzeuge wie `htop`, `btop` und `tmux` funktionieren.
* Mindestregeln fuer das Terminalverhalten sind:
  * `TERM=xterm-256color`
  * initiale Zeilen- und Spaltenwerte werden an die PTY uebergeben
  * Resize-Aenderungen werden weitergereicht
  * die Shell-Umgebung muss eine UTF-8-faehige Locale unterstuetzen
* Beim Aufbau und Ende der SSH-Sitzung werden mindestens `pin` und `mitarbeiteraccount` protokolliert.
* Diese Schnittstelle wird durch OpenAPI als strukturierendes Artefakt plus ergaenzendes Markdown dokumentiert.

## Fachliche Hauptressourcen

### Zielkonsole im Supportfall

Mindestens fachlich ableitbar:

* es gibt genau eine zur aktiven Support-Sitzung passende Zielkonsole
* das Gateway muss diese Konsole ueber den serverseitigen Session-Kontext finden

Noch offen:

* ob neben der IP-Adresse spaeter zusaetzliche Zielmerkmale noetig werden

### SSH-Zugang zur Konsole

Mindestens fachlich ableitbar:

* ein lokaler SSH-Dienst oder dedizierter Support-Zugang ist vorgesehen
* das Gateway authentisiert sich gegenueber der Konsole

Noch offen:

* keine weiteren offenen Fragen zu Schluessellaufzeit und Zielaccount innerhalb dieser Spezifikation

## Offene Architekturfragen

* Braucht es neben `pin` und `mitarbeiteraccount` weitere Audit-Daten?
* Welche fachlichen Fehlercodes sollen fuer Zielauflosung, SSH-Aufbau und Sitzungsabbruch reserviert werden?

## Verbindliche Arbeitsregel

* Es duerfen keine zusaetzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rueckfrage geklaert.
* Jede Klaerung aktualisiert dieses Dokument und den zugehoerigen Plan.