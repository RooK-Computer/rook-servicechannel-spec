# Integrationsbefunde und Folgearbeiten

Status: In Ausarbeitung

## Zweck

Dieses Dokument sammelt die Befunde aus den ersten interaktiven Integrationstests in einer Form, die fuer mehrere Teams gleichzeitig nutzbar ist.

Es dient als zentraler Einstiegspunkt fuer:

* beobachtete Probleme,
* erwartetes Verhalten,
* betroffene Komponenten,
* moeglichen Spezifikationsbedarf,
* moeglichen Recherchebedarf,
* konkrete Folgearbeiten je Team.

Die betroffenen Komponentenstatusdokumente sollen auf dieses Dokument verweisen und ihre jeweils eigenen Arbeiten daraus ableiten.

## Arbeitsregel fuer die Einordnung

Jeder Befund soll in genau eine der folgenden Primaerklassen eingeordnet werden:

* **Implementierungsarbeit**: Das Konzept erklaert das erwartete Verhalten bereits ausreichend; ein oder mehrere Teams muessen die bestehende Absicht nur korrekt umsetzen.
* **Spezifikationsnachschaerfung**: Das Konzept oder ein Vertragsartefakt ist fuer das beobachtete Verhalten noch nicht praezise genug und muss nachgezogen werden.
* **Rechercheauftrag**: Aus dem bisherigen Konzept ist noch nicht belastbar erklaerbar, warum das Verhalten auftritt oder welches Zielverhalten technisch sinnvoll ist.

Ein Befund kann natuerlich Folgearbeiten in mehr als einer Komponente ausloesen. Die Primaerklasse hilft nur bei der Frage, womit begonnen wird.

## Befundcluster

### A. Team-Frontend und Bedienbarkeit

1. Weblayout der Team-Oberflaeche ist im Integrationslauf noch nicht gut genug.
2. Frontend-Komponenten sind in Plain JavaScript statt TypeScript umgesetzt.
3. Konfigurationsmenue und Werkzeugseite sind im Backend-Menue noch nicht eingehaengt.

### B. Browser-Terminal-Lifecycle

4. Das Terminal im Browser laeuft bei laengerer Inaktivitaet in einen Timeout.
5. Der Gateway scheint die Verbindung dann zu unterbrechen, obwohl fuer diesen Anwendungsfall eine laenger offene Sitzung gewuenscht ist.

### C. Agent-/Session-Lifecycle

6. Einmalig beobachtet: Eine vom Agent gestartete Service-Session wurde nach einiger Zeit beendet.
7. Gewuenscht ist, dass die Session offen bleibt, solange weiterhin Agent-Pings eintreffen, auch wenn ein Service-Mitarbeiter die Session gerade nicht aktiv benutzt.

## Befunde im Detail

### Befund 1 - Weblayout der Team-Oberflaeche

**Beobachtung**

Das Layout der Webumgebung ist im ersten interaktiven Integrationslauf noch nicht ausreichend.

**Erwartetes Verhalten**

Die Team-Oberflaeche soll fuer PIN-Eingabe, Session-Status, Shell-Start und Terminal-Nutzung klar, robust und alltagstauglich benutzbar sein.

Konkret fuer den aktuell gewuenschten Integrationsstand:

* Die Seite soll nicht mehr zweispaltig aufgebaut sein.
* Stattdessen sollen zwei vertikale Hauptbloecke untereinander stehen.
* Im oberen Block liegen:
  * PIN-Eingabe,
  * Session koppeln,
  * Terminal verbinden,
  * Terminal trennen.
* Debug-Informationen sollen nicht dauerhaft sichtbar sein, sondern erst nach Klick auf ein kleines Info-Symbol erscheinen.
* Darunter soll das interaktive Terminal vollbreit in einem 4:3-Rahmen erscheinen.
* Die Terminalhoehe soll so begrenzt werden, dass das Terminal vollstaendig sichtbar bleibt und die verfuegbare Bildschirmhoehe nicht ueberschreitet.
* Bereits von Drupal bereitgestellte Oberflaechenelemente wie der Header muessen bei dieser Hoehenbegrenzung beruecksichtigt werden.

**Betroffene Komponenten**

* RooK Web-/API-Backend

**Einordnung**

Implementierungsarbeit

**Konzeptlage**

Das Architekturkonzept verankert die Team-Oberflaeche als Web-Frontend des Backends, macht aber absichtlich kaum Layoutvorgaben. Der Befund ist daher derzeit eher Produkt- und Umsetzungsarbeit als Spec-Arbeit.

**Möglicher Spec-Bedarf**

Aktuell keiner, solange sich nur Struktur, Layout und Bedienfuehrung aendern.

**Recherchebedarf**

Kein eigener Forschungsauftrag noetig, sofern das Problem rein in Layout und Bedienfuehrung liegt.

**Folgearbeiten**

* Backend-/Web-Team: Das zweispaltige Layout auf einen vertikalen Zwei-Block-Aufbau umstellen.
* Backend-/Web-Team: Debug-Informationen hinter ein klickbares Info-Symbol legen.
* Backend-/Web-Team: Den Terminalbereich vollbreit in 4:3 anordnen und seine Hoehe an die verfuegbare Viewport-Hoehe unter Einbezug der Drupal-Oberflaeche koppeln.
* Backend-/Web-Team: Das Zielbild fuer die Team-Oberflaeche im eigenen Repo als UI-Aufgabe und Abnahmekriterium festhalten.

### Befund 2 - Frontend noch in Plain JavaScript

**Beobachtung**

Die Frontend-Komponenten sind aktuell in Plain JavaScript gebaut und nicht in TypeScript.

**Erwartetes Verhalten**

Die Team-Oberflaeche soll in einer fuer die weitere Zusammenarbeit tragfaehigen, typisierten Codebasis fortentwickelt werden.

**Betroffene Komponenten**

* RooK Web-/API-Backend

**Einordnung**

Implementierungsarbeit

**Konzeptlage**

Im Architekturkonzept war fuer browserseitige Oberflaechen bisher React vorgesehen, aber keine Sprache festgelegt. Mit dieser Klaerung wird TypeScript fuer die Team-Oberflaeche nun als verbindliche Zielrichtung festgezogen.

**Möglicher Spec-Bedarf**

Durch die vorliegende Klaerung ist der Spec-Bedarf erledigt: TypeScript wird fuer die browserseitige Team-Oberflaeche als verbindliche Zielrichtung festgehalten.

**Recherchebedarf**

Kein externer Forschungsauftrag erforderlich. Es braucht eher eine bewusste technische Entscheidung des Backend-/Web-Teams.

**Aktueller Beschluss im Spec-Repo**

* Die Team-Oberflaeche soll kuenftig in TypeScript statt in Plain JavaScript fortgefuehrt werden.

**Folgearbeiten**

* Backend-/Web-Team: TypeScript-Migrationspfad fuer die bestehende Team-UI festlegen.
* Backend-/Web-Team: Priorisierung und Schnitt des Migrationsumfangs im eigenen Repo festhalten.

### Befund 3 - Fehlende Menueeinbindung im Backend

**Beobachtung**

Weder das Konfigurationsmenue noch die Seite zum Bedienen des Werkzeugs sind derzeit im Backend-Menue eingehaengt.

**Erwartetes Verhalten**

Die relevanten Seiten sollen fuer berechtigte Nutzer in der Backend-Navigation auffindbar und sauber eingebunden sein.

Konkret fuer den aktuell gewuenschten Integrationsstand:

* Der Zugang zur Team-UI soll direkt in die Hauptnavigation.
* Dieser Eintrag soll dort moeglichst weit oben erscheinen.
* Der Konfigurationszugang soll im Drupal-Menue `Configuration/System` eingehaengt werden.

**Betroffene Komponenten**

* RooK Web-/API-Backend

**Einordnung**

Implementierungsarbeit

**Konzeptlage**

Dieser Befund ist mit dem vorhandenen Konzept gut vereinbar und spricht primaer fuer fehlende Backend-UI-Integration.

**Möglicher Spec-Bedarf**

Keiner, solange keine neuen Rollen-, Rechte- oder Navigationskonzepte eingefuehrt werden.

**Recherchebedarf**

Kein separater Forschungsauftrag erkennbar.

**Folgearbeiten**

* Backend-/Web-Team: Team-UI in der Hauptnavigation einhaengen und dort bevorzugt ganz oben platzieren.
* Backend-/Web-Team: Konfigurationszugang unter `Configuration/System` einhaengen.
* Backend-/Web-Team: Rollen- und Sichtbarkeitsregeln fuer diese Eintraege kurz mitdokumentieren.

### Befund 4 - Browser-Terminal-Timeout bei Inaktivitaet

**Beobachtung**

Wenn das Browser-Terminal laenger nicht benutzt wird, tritt ein Timeout auf und die Verbindung scheint beendet zu werden.

**Erwartetes Verhalten**

Laengere Inaktivitaet eines geoeffneten Browser-Terminals soll den Zugriff nicht automatisch abbrechen, sofern fuer den Support-Fall weiterhin eine offene Sitzung gewuenscht ist.

**Betroffene Komponenten**

* Browser-Terminal-Gateway
* RooK Web-/API-Backend

**Einordnung**

Spezifikationsnachschaerfung

**Konzeptlage**

Das Architekturkonzept beschreibt den Support-Ablauf und kennt zwar Sitzungsende durch Timeout, praezisiert aber nicht sauber genug, welche Idle-Regeln fuer Browser-Terminal, Gateway-Session und uebergeordnete Support-Session gelten sollen. Der Gateway-Status beschreibt bereits ein konfigurierbares Session-Idle-Timeout, aber das gewuenschte Produktverhalten ist noch nicht verbindlich im Spec-Repo festgezogen.

**Möglicher Spec-Bedarf**

* Praezisierung der Idle- und Keepalive-Semantik zwischen Browser und Gateway.
* Klare Abgrenzung zwischen:
  * Browser-WebSocket-Idle,
  * Gateway-Terminal-Session,
  * uebergeordneter Support-Session.

**Recherchebedarf**

Moeglich. Falls unklar bleibt, ob der Timeout aus Browser, Proxy, Gateway, SSH oder Backend stammt, braucht das Gateway-Team einen kurzen technischen Ursachenbefund aus dem echten Integrationspfad.

**Aktueller Beschluss im Spec-Repo**

* Fehlende Terminaleingaben oder ausbleibende Resize-Ereignisse beenden eine autorisierte Browser-Terminal-Sitzung nicht automatisch.
* Browser, Gateway und Zwischeninfrastruktur sollen Keepalive-Mechanismen nutzen duerfen, damit ruhende Browser-Terminals nicht nur wegen Transport-Idle abbrechen.
* Die Browser-Terminal-Sitzung ist fachlich von der uebergeordneten Support-Sitzung zu trennen.

**Folgearbeiten**

* Gateway-Team: Beobachteten Timeout reproduzierbar eingrenzen und die tatsaechliche Abbruchstelle benennen.
* Gateway-Team: Vorschlag fuer gewuenschte Idle-/Keepalive-Regeln liefern.
* Backend-/Spec-Pflege: Nach der Ursachenanalyse die gewuenschte Semantik im Konzept und gegebenenfalls im Gateway-Protokoll nachziehen.

### Befund 5 - Unerwuenschte Verbindungsunterbrechung durch den Gateway

**Beobachtung**

Im Integrationslauf entsteht der Eindruck, dass der Gateway die Verbindung bei laengerer Nichtbenutzung beendet, obwohl dies fuer den Support-Fall unerwuenscht ist.

**Erwartetes Verhalten**

Der Gateway soll eine geoeffnete Browser-Shell nicht allein wegen fehlender Tastatureingaben beenden, wenn keine uebergeordnete Sicherheits- oder Betriebsregel dies verlangt.

**Betroffene Komponenten**

* Browser-Terminal-Gateway
* RooK Web-/API-Backend

**Einordnung**

Spezifikationsnachschaerfung

**Konzeptlage**

Die Verantwortung des Gateways fuer Browser-Terminal und Datenpfad ist klar, aber die Bedingungen fuer einen legitimen Idle-Abbruch sind im Konzept noch nicht praezise genug beschrieben.

**Möglicher Spec-Bedarf**

* Explizite Endgruende fuer Gateway-Sitzungen.
* Entscheidung, ob Keepalive/Ping auf Browser-WebSocket-Ebene benoetigt wird.
* Entscheidung, ob Bedieninaktivitaet und Verbindungsinaktivitaet getrennt behandelt werden muessen.

**Recherchebedarf**

Ja, falls nicht aus Logs oder Tests klar hervorgeht, ob der Abbruch auf Gateway-Laufzeitgrenzen, Infrastruktur-Timeouts oder Browser-/Proxy-Verhalten zurueckgeht.

**Aktueller Beschluss im Spec-Repo**

* Eine geoeffnete Browser-Shell darf nicht allein wegen fehlender Tastatureingaben beendet werden.
* Ein echter Browser-Disconnect beendet die Browser-Terminal-Sitzung, aber nicht automatisch die uebergeordnete Support-Sitzung.
* Terminal-Grants bleiben fachlich an die Support-Sitzung gebunden und koennen nach Browser-Disconnect innerhalb eines kurzen Grace-Fensters fuer einen neuen Browser-Terminal-Aufbau wiederverwendet werden.

**Folgearbeiten**

* Gateway-Team: Laufzeit- und Infrastrukturgrenzen des Integrationspfads dokumentieren.
* Spec-/Backend-/Gateway-Abstimmung: Gewuenschte Endgruende und Keepalive-Regeln verbindlich festhalten.

### Befund 6 - Beobachtetes Ende einer agentgestarteten Service-Session

**Beobachtung**

Einmalig wurde beobachtet, dass eine vom Agent gestartete Service-Session nach einiger Zeit beendet wurde.

**Erwartetes Verhalten**

Solange der Agent weiter gueltige Heartbeats sendet, soll die zugehoerige Support-Session offen bleiben, auch ohne aktive Bedienung durch einen Service-Mitarbeiter.

**Betroffene Komponenten**

* RooK Agent auf der Konsole
* RooK Web-/API-Backend

**Einordnung**

Spezifikationsnachschaerfung

**Konzeptlage**

Das Konzept ordnet den echten Laufzeitzustand dem Agenten zu und beschreibt die Session als Rueckgrat des Systems. Gleichzeitig bleibt aber offen genug, unter welchen Bedingungen eine Support-Session serverseitig trotz weiterlaufender Agent-Pings geschlossen werden darf. Der Backend-Status benennt Heartbeat-Verarbeitung und Session-Ende, legt die Prioritaet laufender Agent-Pings gegen andere Timeout- oder Cleanup-Regeln aber noch nicht explizit als Produktregel fest.

**Möglicher Spec-Bedarf**

* Verbindliche Regel, dass Agent-Pings die Support-Session offen halten.
* Klare Trennung zwischen:
  * Session ohne aktiven Service-Mitarbeiter,
  * Session mit aktivem Browser-Terminal,
  * wirklich beendeter Session.
* Explizite Endgruende auf Backend-Seite.

**Recherchebedarf**

Ja, falls das beobachtete Ende nicht direkt durch bestehende Backend- oder Agent-Logik erklaerbar ist.

**Aktueller Beschluss im Spec-Repo**

* Die uebergeordnete Support-Session bleibt offen, solange gueltige Agent-Heartbeats innerhalb der Grace Period eintreffen.
* Eine fehlende aktive Service-Bedienung beendet die Support-Session nicht automatisch.
* Das fachliche Zurueckfallen von `active` nach `open` ist ein normaler Zustand und kein Session-Ende.

**Folgearbeiten**

* Agent-Team: Sicherstellen, dass Heartbeats im fraglichen Szenario weitergelaufen sind oder sauber beobachtbar werden.
* Backend-Team: Pruefen, welche serverseitigen Cleanup-, Revocation- oder Timeout-Regeln das Session-Ende ausgeloest haben koennten.
* Spec-Pflege: Gewuenschte Heartbeat-vs.-Timeout-Semantik verbindlich nachziehen.

## Empfohlene naechste Bearbeitungsreihenfolge

1. Agent-/Session-Lifecycle zuerst klaeren, weil hier das Rueckgrat des Systems betroffen ist.
2. Danach Browser-Terminal-Lifecycle und Idle-/Keepalive-Semantik nachziehen.
3. Parallel dazu die reinen Backend-/Web-UI-Arbeiten in eigene Repo-Aufgaben ueberfuehren.

## Pflegehinweis

Sobald ein Befund von "unklar" zu "erklärt" oder von "offen" zu "umgesetzt" wechselt, soll dieses Dokument die Einordnung aktualisieren und auf die konkreten Folgeartefakte in den Komponentenstatusdokumenten verweisen.
