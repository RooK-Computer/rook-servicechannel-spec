# Browser ↔ Gateway – Fehlerstrategie

Status: Wartet auf Implementierungserkenntnisse

## Zweck

Dieses Dokument haelt die aus dem Konzept bereits ableitbare Fehlerstrategie fuer die Browser-zu-Gateway-Schnittstelle fest.

## Bereits belastbar ableitbar

* Es wird Fehlerfaelle fuer ungueltige oder abgelaufene Terminal-Berechtigungen geben.
* Es wird Fehlerfaelle fuer nicht aufbaubare Terminal-Sitzungen geben.
* Sitzungsende muss dem Browser signalisiert werden.

## Noch offen

* Fehlerobjekt oder Fehlernachrichtenformat
* Close-Code-Strategie
* Unterscheidung zwischen fachlichen Fehlern und Transportabbruechen

## Bereits festgelegte Mindestsignale

* Das Protokoll enthaelt mindestens `error` und `close` als getrennte Nachrichtenarten.
* Reconnects werden nicht als Sitzungsfortsetzung behandelt, sondern als neue Sitzung.

## Verbindliche Arbeitsregel

* Es duerfen keine zusaetzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rueckfrage geklaert.