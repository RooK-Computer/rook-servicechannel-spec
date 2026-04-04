# Lokale IPC UI ↔ Agent – Nachrichtenkatalog

Status: Wartet auf Implementierungserkenntnisse

## Zweck

Dieses Dokument hält ausschließlich die aus dem Konzept explizit ableitbaren Elemente der lokalen IPC zwischen RooK UI und RooK Agent fest.

Es ist noch keine vollständige Vertragsspezifikation. Fehlende Details bleiben bewusst offen und müssen per Rückfrage geklärt werden.

## Explizit bekannte Rahmendaten

* Transport: Unix Domain Socket
* Datenformat: JSON
* OpenAPI ist für diese Schnittstelle ausdrücklich gewünscht
* Kommunikationsmuster:
  * zwei Unix Sockets
  * ein Socket für Request/Response, initiiert durch die UI
  * ein separater Socket für asynchrone Events des Agent
  * üblicher Linux-Ort: `/run/rook-servicechannel/`
  * Request/Response-Socket: `/run/rook-servicechannel/rook-service-channel`
  * Event-Socket: `/run/rook-servicechannel/rook-service-channel-events`
* gemeinsame Nachrichtenfelder laut Nutzerfestlegung:
  * `version` als explizites Feld in jeder Nachricht
  * `type` zur Unterscheidung der Nachrichtentypen
  * Kennzeichnung, ob die Nachricht `request`, `response` oder `event` ist
* Request/Response-Regel laut Nutzerfestlegung:
  * auf jeden Request folgt genau eine Response
  * ein neuer Request darf erst nach Zustellung der vorherigen Response gesendet werden
  * die Response trägt denselben `type`-Wert wie der zugehörige Request

## Explizit genannte Kommandos

### GetStatus

Bekannt aus dem Konzept:

* Die UI kann den aktuellen Zustand beim Agent erneut abfragen.
* Der Agent hält den echten Laufzeitzustand.

Noch offen:

* genaue Request-Struktur
* Umfang weiterer optionaler Teilzustände

Aktuell festgelegt:

* `GetStatus` liefert mindestens `supportActive`, `supportState`, `wifiState`, `vpnState`
* `wifiState` beschreibt weiter den RooK-seitig geführten Support-WLAN-Zustand
* zusätzlich liefert der Status `anyWifiActive`, `supportWifiActive` und optional `activeWifiConnection`
* damit kann die UI zwischen allgemeiner WLAN-Konnektivität des Hosts und dem RooK-Support-WLAN unterscheiden

### ScanWifi

Bekannt aus dem Konzept:

* Der Agent übernimmt den WLAN-Scan.
* Die UI zeigt verfügbare WLANs an.

Aktuell festgelegt:

* `ScanWifi` wird ohne Request-Payload gesendet.
* Die Erfolgs-Response liefert `WiFiScanPayload`.
* `WiFiScanPayload` hat die Form `{"networks":[{"ssid":"Cafe"},{"ssid":"Office"}]}`.
* Der Agent sendet nach erfolgreichem Scan zusätzlich ein `WifiScanCompleted`-Event mit demselben Payload-Typ.

### ConnectWifi

Bekannt aus dem Konzept:

* Die UI ermöglicht die Eingabe von Zugangsdaten.
* Der Agent baut die WLAN-Verbindung auf.

Noch offen:

* mindestens `ssid` und `password` werden übertragen
* Validierungs- und Fehlerfälle
* Response-Inhalt im Erfolgsfall

Festgelegt:

* wenn bereits eine Verbindung zum gleichen WLAN besteht, wird sie getrennt und neu aufgebaut

### DisconnectWifi

Bekannt aus dem Konzept:

* WLAN ist temporär und wird nach Sitzungsende entfernt.

Noch offen:

* ob das Kommando nur manuell oder auch im Cleanup-Kontext verwendet wird
* Response bei fehlender aktiver Verbindung

### StartSupport

Bekannt aus dem Konzept:

* Startet den Support-Modus lokal auf der Konsole.
* Der Agent steuert den Support-Zustand.

Noch offen:

* Vorbedingungen, z. B. vorhandenes WLAN
* Rückgabedaten zum eingeleiteten Support-Start

### StopSupport

Bekannt aus dem Konzept:

* Beendet den Support-Modus.
* Cleanup entfernt temporäre Zugangsdaten und Netzkonfiguration.

Noch offen:

* synchrones oder asynchrones Abschlussverhalten
* welche Teilschritte die Response bereits bestätigt

### GetPin

Bekannt aus dem Konzept:

* Ein Support-PIN wird auf der Konsole angezeigt.
* Der Agent empfängt und verwaltet den PIN.

Noch offen:

* ob `GetPin` den aktuellen PIN liest oder einen Abruf beim Backend auslöst
* ob es über die Zeichenkette `pin` hinaus weitere Metadaten geben soll

## Implementierungserweiterte Kommandos

Die folgenden Kommandos sind aktuell in der Implementierung vorhanden, obwohl sie im Architekturkonzept nicht als explizite UI-Kommandoliste festgezogen wurden. Sie werden derzeit insbesondere fuer den interaktiven Service-Client des Agenten genutzt.

### Ping

Aktueller Zweck:

* fordert den laufenden Service auf, sofort einen manuellen Heartbeat zu senden

### VpnStatus

Aktueller Zweck:

* liefert den aktuell vom Service beobachteten OpenVPN-Zustand inklusive Diagnosefeldern

### VpnStart

Aktueller Zweck:

* fordert den laufenden Service auf, den OpenVPN-Client zu starten

### VpnStop

Aktueller Zweck:

* fordert den laufenden Service auf, den OpenVPN-Client zu stoppen

### Cleanup

Aktueller Zweck:

* fordert den laufenden Service auf, RooK-eigene temporaere WLAN-/VPN-Artefakte zu bereinigen

## Explizit genannte Events

### WifiScanCompleted

Bekannt aus dem Konzept:

* wird nach Zustandsänderung bzw. Abschluss des WLAN-Scans benötigt

Aktuell festgelegt:

* Das Event transportiert `WiFiScanPayload`.
* Das Ergebnis wird als Objekt `{"networks":[...]}` übertragen, nicht als nackte Array- oder String-Liste.
* Pro Netz ist aktuell nur `ssid` verbindlich.

Noch offen:

* Verhalten bei Teilerfolg oder Fehler

### WifiConnectionStateChanged

Bekannt aus dem Konzept:

* die UI zeigt Verbindungsstatus an

Noch offen:

* erlaubte Zustandswerte
* zusätzliche Fehler- oder Diagnosedaten

### VpnStateChanged

Bekannt aus dem Konzept:

* der Agent startet und stoppt OpenVPN

Noch offen:

* erlaubte Zustandswerte
* Bezug zu Fehlerursachen

### SupportStateChanged

Bekannt aus dem Konzept:

* der Agent steuert den Support-Zustand

Noch offen:

* verbindliche Zustandsübergänge und Endzustände

Festgelegt:

* die Zustände `idle`, `online`, `online+vpnup`, `servicemode` gelten derzeit als vollständig

### PinAssigned

Bekannt aus dem Konzept:

* der Server handelt einen 4-stelligen PIN aus
* die Konsole zeigt diesen PIN an

Noch offen:

* Payload-Felder außer dem PIN selbst
* ob zusätzlich zur PIN ein expliziter Ablaufgrund übertragen wird

Aktuell festgelegt:

* die Nutzlast enthält mindestens die PIN als Zeichenkette
* die PIN bleibt gültig, bis die Konsole neu startet oder der Nutzer den Servicemodus aktiv beendet

### PinExpired

Bekannt aus dem Konzept:

* der PIN ist kurzlebig

Noch offen:

* Auslöser des Ablaufs
* mögliche Nachfolgeaktionen in der UI

### ErrorRaised

Bekannt aus dem Konzept:

* Fehlerzustände müssen anzeigbar sein

Noch offen:

* fachliche Fehlercode-Liste
* Fehler-Schweregrade
* Korrelation zu konkreten Teilzuständen

Festgelegt:

* Fehler-Events und Fehler-Responses enthalten mindestens `code` und `message`

## Offene Grundsatzfragen für die eigentliche Vertragsspezifikation

* konkrete Versionssyntax und Kompatibilitätsregeln des `version`-Felds

## Festgelegte Grundsatzentscheidung zur Versionierung

* Jede Nachricht enthält ein explizites Feld `version`.
* Die genaue Syntax und Kompatibilitätsregel des Felds muss bei der nächsten Schärfung der Spezifikation festgezogen werden.

## Verbindliche Arbeitsregel

* Es dürfen keine zusätzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rückfrage geklärt.
* Jede Klärung aktualisiert dieses Dokument und den zugehörigen Plan.
