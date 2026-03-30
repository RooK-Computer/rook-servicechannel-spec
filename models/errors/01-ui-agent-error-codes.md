# UI ↔ Agent – Fehlercodes

Status: Wartet auf Implementierungserkenntnisse

## Zweck

Dieses Dokument legt die Fehlercode-Strategie für die lokale IPC zwischen RooK UI und RooK Agent fest.

## Festgelegte Regeln

* Fehlercodes sind numerisch.
* Fehlerobjekte enthalten mindestens `code` und `message`.
* Die Fehlercode-Liste ist als Living Spec zu verstehen.
* Neue fachliche Fehlercodes werden ergänzt, sobald die jeweilige Komponente konkret umgesetzt wird.

## Aktueller Stand

Zum aktuellen Zeitpunkt werden noch keine verbindlichen Einzelfehler reserviert, weil die spätere Komponentenentwicklung die konkrete Fehlerlandschaft erst sichtbar macht.

## Pflegehinweis

Bei der Ergänzung neuer Fehlercodes muss dieses Dokument fortgeschrieben werden. Bereits vergebene Codes dürfen nicht stillschweigend umdefiniert werden.