# Gateway ↔ Konsole – Fehlerstrategie

Status: Wartet auf Implementierungserkenntnisse

## Zweck

Dieses Dokument haelt die aus dem Konzept bereits ableitbare Fehlerstrategie fuer die serverseitige SSH-Verbindung zur Konsole fest.

## Bereits belastbar ableitbar

* Es wird Fehlerfaelle fuer die Zielauflosung der Konsole geben.
* Es wird Fehlerfaelle fuer den Aufbau der SSH-Verbindung geben.
* Es wird Fehlerfaelle fuer Sitzungsabbrueche durch Reboot oder Session-Ende geben.

## Noch offen

* fachliche Fehlercode-Liste
* Trennung zwischen Authentisierungs-, Netzwerk- und Sitzungsfehlern
* Auditierbarkeit einzelner Fehlerereignisse

## Fehlercodes als Living Spec

* Die konkrete fachliche Fehlercode-Liste wird spaeter als Living Spec ergaenzt, sobald aus der Implementierung konkrete Fehlerfaelle sichtbar werden.

## Bereits festgelegte Grundlage

* Fehlerereignisse muessen mindestens mit `pin` und `mitarbeiteraccount` korrelierbar sein.

## Verbindliche Arbeitsregel

* Es duerfen keine zusaetzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rueckfrage geklaert.