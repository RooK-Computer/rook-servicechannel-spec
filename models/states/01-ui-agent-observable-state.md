# UI ↔ Agent – Beobachtbare Zustandsbereiche

Status: Wartet auf Implementierungserkenntnisse

## Zweck

Dieses Dokument hält fest, welche Zustandsbereiche die UI laut Konzept über die lokale IPC beobachten oder abrufen können muss.

## Explizit ableitbare Zustandsbereiche

### WLAN-Scan-Zustand

Aus dem Konzept ableitbar:

* verfügbare WLAN-Netze werden angezeigt
* der Agent führt den Scan aus

Noch offen:

* eigener Scan-Zustand oder nur Ergebnis-Event

### WLAN-Verbindungszustand

Aus dem Konzept ableitbar:

* der Agent baut die WLAN-Verbindung auf
* die UI zeigt den Verbindungsstatus an

Noch offen:

* ob erfolgreiche Neuverbindung nach erzwungener Trennung gesondert kenntlich gemacht wird

Aktuell festgelegt:

* verbindliche Zustandswerte: `connected`, `disconnected`

### VPN-Zustand

Aus dem Konzept ableitbar:

* OpenVPN wird im Supportfall gestartet und gestoppt

Noch offen:


Aktuell festgelegt:

* verbindliche Zustandswerte: `connected`, `disconnected`

### Support-Zustand

Aus dem Konzept ableitbar:

* Support-Modus kann lokal gestartet und beendet werden
* Cleanup erfolgt nach Sitzungsende oder Reboot

Aktuell festgelegt:

* bekannte Zustandswerte aus Nutzerklärung: `idle`, `online`, `online+vpnup`, `servicemode`
* es gelten derzeit keine weiteren Support-Zustände als erforderlich

Noch offen:

* vollständige Zustandsmaschine
* Abgrenzung zwischen lokalem Aktivieren, aktiver Sitzung und Cleanup

### PIN-Zustand

Aus dem Konzept ableitbar:

* der Agent verwaltet den Support-PIN
* der PIN ist kurzlebig
* der PIN wird auf der Konsole angezeigt

Aktuell festgelegt:

* zwischen Agent und UI muss mindestens die PIN als Zeichenkette übertragen werden
* der PIN bleibt gültig bis Reboot oder bis der Nutzer den Servicemodus aktiv beendet

Noch offen:

* Sichtbarkeitsdauer
* Ablaufmodell
* leerer oder nicht verfügbarer Zustand

### Fehlerzustand

Aus dem Konzept ableitbar:

* die UI muss Fehler anzeigen können

Noch offen:

* Fehlerpersistenz
* Verhältnis zwischen Fehlerzustand und Error-Event

## Verbindliche Arbeitsregel

* Es dürfen keine zusätzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rückfrage geklärt.