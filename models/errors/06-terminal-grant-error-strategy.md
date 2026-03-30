# Backend ↔ Gateway – Terminal-Grant-Fehlerstrategie

Status: Wartet auf Implementierungserkenntnisse

## Zweck

Dieses Dokument haelt die bereits ableitbare Fehlerstrategie fuer Ausgabe, Validierung und Einloesung von Terminal-Grants fest.

## Bereits belastbar ableitbar

* Es wird Fehlerfaelle fuer ungueltige, abgelaufene oder bereits verwendete Grants geben.
* Es wird Fehlerfaelle fuer nicht mehr gueltige Sessions geben.
* Es wird Fehlerfaelle fuer fehlende Uebereinstimmung zwischen Grant und Session-Kontext geben.
* Es wird Fehlerfaelle fuer Revocation oder spaetes Sitzungsende nach bereits erfolgreicher Validierung geben.

## Noch offen

* fachliche Fehlercode-Liste
* Trennung zwischen Validierungsfehlern und Backend-Ausfall

## Bereits festgelegte Grundlage

* Die Grant-Pruefung selbst muss nicht gesondert auditiert werden.
* Fehlerobjekte enthalten mindestens `code` und `message`.
* Die grobe HTTP-Statuscode-Strategie ist `200` fuer Erfolg und `500` fuer Fehler.

## Fehlercodes als Living Spec

* Die konkrete fachliche Fehlercode-Liste wird spaeter als Living Spec ergaenzt, sobald aus der Implementierung konkrete Fehlerfaelle sichtbar werden.

## Verbindliche Arbeitsregel

* Es duerfen keine zusaetzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rueckfrage geklaert.