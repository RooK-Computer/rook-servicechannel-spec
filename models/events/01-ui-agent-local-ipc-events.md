# UI ↔ Agent – Eventkatalog

Status: Auf Implementierungsstand nachgezogen

## Zweck

Dieses Dokument sammelt die aus dem Konzept explizit ableitbaren Event-Typen der lokalen IPC.

## Event-Liste

### WifiScanCompleted

Aus dem Konzept ableitbare Semantik:

* signalisiert das Vorliegen eines Scan-Ergebnisses nach einem WLAN-Scan

Aktuell festgelegt:

* das Event-Payload ist `WiFiScanPayload`
* `WiFiScanPayload` hat die Form `{"networks":[{"ssid":"Cafe"},{"ssid":"Office"}]}`
* pro Netz ist dafür aktuell nur `ssid` verbindlich

Noch nicht festgelegt:

* Fehlerdarstellung
* ob leere Ergebnisse zulässig und wie sie dargestellt werden

### WifiConnectionStateChanged

Aus dem Konzept ableitbare Semantik:

* signalisiert Änderungen des WLAN-Verbindungszustands
* dient der Statusanzeige in der UI

Noch nicht festgelegt:

* Übergangsregeln
* optionale Diagnosefelder

Aktuell festgelegt:

* erlaubte Zustandswerte sind `connected` und `disconnected`

### VpnStateChanged

Aus dem Konzept ableitbare Semantik:

* signalisiert Änderungen des VPN-Zustands

Noch nicht festgelegt:

* Fehler- und Retry-Informationen

Aktuell festgelegt:

* erlaubte Zustandswerte sind `connected` und `disconnected`

### SupportStateChanged

Aus dem Konzept ableitbare Semantik:

* signalisiert Änderungen des Support-Lebenszyklus

Noch nicht festgelegt:

* erlaubte Übergänge
* Zusammenhang zu WLAN-, VPN- und PIN-Zustand

Aktuell festgelegt:

* das Zustandsmodell umfasst `idle`, `online`, `online+vpnup`, `servicemode`
* wenn `SupportStateChanged` den Status-Payload des Agenten transportiert, bleibt `wifiState` die Support-WLAN-Sicht
* zusätzliche WLAN-Sicht für die UI wird über getrennte Felder wie `anyWifiActive`, `supportWifiActive` und optional `activeWifiConnection` modelliert

### PinAssigned

Aus dem Konzept ableitbare Semantik:

* signalisiert, dass ein kurzlebiger 4-stelliger PIN zur Anzeige verfügbar ist

Noch nicht festgelegt:

* vollständige Payload
* Ablaufzeit

Aktuell festgelegt:

* die Nutzlast muss mindestens die PIN als Zeichenkette enthalten
* die PIN bleibt gültig bis Reboot oder bis der Nutzer den Servicemodus beendet

### PinExpired

Aus dem Konzept ableitbare Semantik:

* signalisiert, dass ein zuvor zugewiesener PIN nicht mehr gültig ist

Noch nicht festgelegt:

* Payload-Felder
* erwartete UI-Reaktion

### ErrorRaised

Aus dem Konzept ableitbare Semantik:

* signalisiert einen anzuzeigenden Fehlerzustand

Noch nicht festgelegt:

* Fehlerklassifikation
* Nutzerrelevanz
* Korrelation zu Requests und Teilzuständen

Aktuell festgelegt:

* die Nutzlast enthält mindestens `code` und `message`
* `code` ist numerisch
* die konkrete Fehlerliste wird als Living Spec fortgeschrieben

## Verbindliche Arbeitsregel

* Es dürfen keine zusätzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rückfrage geklärt.
