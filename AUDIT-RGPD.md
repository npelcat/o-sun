# Audit RGPD : O'Sun - Animal Voice

> Branche : `audit-cyber-rgpd`
> Périmètre : schéma de données (`src/db/schema.ts`, `drizzle/`), use-cases et routes touchant de la donnée personnelle, points de log, config, sous-traitants.
> Rôle du projet : la praticienne exploitante est **responsable de traitement** ; l'audit vérifie que les **moyens techniques** des obligations existent dans le code. Aucune modification de code.
> Ce document est un audit technique de conformité, **pas un avis juridique**. Les décisions marquées « responsable / DPO » relèvent de la responsable de traitement.

## Verdict

**Écarts à corriger avant prod.** Un finding bloquant sur fuite de secret, plusieurs majeurs sur les logs de données personnelles et l'absence de moyens techniques pour les droits des personnes.

Récapitulatif : **1 bloquant, 4 majeurs, 3 mineurs.**

---

## Findings

### [bloquant] Le secret du cron est écrit en clair dans les logs

- **Fichier** : `app/api/cron/cleanup/route.ts:26-27`
- **Risque** : `console.log("[CRON] Auth header reçu:", authHeader)` puis `console.log("[CRON] Secret attendu:", "Bearer ${process.env.CRON_SECRET}")` écrivent le bearer token ET le `CRON_SECRET` attendu dans stdout à chaque exécution légitime. Ce secret protège une route qui exécute une suppression en masse de clients avec une connexion `CRON_DATABASE_URL` à droits complets (rôle postgres). Sa fuite dans les logs (accessibles côté hébergeur/plateforme) permet à quiconque lit les logs de déclencher la purge. **Art. 32** (sécurité du traitement).
- **Qui agit** : responsable de traitement (fait exécuter le code), correction technique côté développeur.
- **Correction attendue** : supprimer purement ces deux `console.log`. Ne jamais logger un secret, même partiellement.

### [majeur] Emails et identités des personnes concernées écrits en clair dans les logs applicatifs

- **Fichier** : `app/api/booking/confirm/route.ts:239` (`logger.info("...Email validé", { clientEmail })`) et `app/api/email/route.ts:105` (`logger.info("POST /email - Data validated", { name, email })`)
- **Risque** : l'email du client (et son nom pour le formulaire de contact) est journalisé en clair via Winston. En prod le logger écrit en JSON sur la console (transport Console, `utils/logger.ts:24-29`), donc récupéré et conservé par l'agrégateur de logs de la plateforme, souvent hors UE et avec une durée de rétention distincte non maîtrisée par le responsable. Un email + un nom sont des données personnelles (**art. 4**). Les journaliser systématiquement viole la minimisation (**art. 5-1-c**) et la sécurité (**art. 32**). Le reste du code est plus prudent (il logue des UUID `clientId`/`bookingId`/`formId` ou seulement le domaine de l'email, `confirm/route.ts:222,268,278`), ce qui montre que ces deux points sont des oublis.
- **Qui agit** : développeur pour le responsable de traitement.
- **Correction attendue** : retirer email et nom des logs, ou les remplacer par un identifiant technique (UUID) ou un hash. Aligner sur le pattern déjà utilisé ailleurs (log du domaine uniquement, ou de l'ID).

### [majeur] Aucun moyen technique pour les droits d'accès, de rectification, d'effacement et de portabilité

- **Fichier** : absence vérifiée par recherche (grep `export/anonymi/portab/effacement/rectif/erasure/dataSubject` sur `lib`, `app`, `src` : aucun résultat fonctionnel) ; la politique de confidentialité les annonce pourtant (`app/privacy-policy/page.tsx:222-308` liste accès, rectification, effacement, opposition, portabilité, limitation).
- **Risque** : le site promet 6 droits RGPD (**art. 15 à 20**) mais aucun mécanisme technique ne les sert. Il n'existe ni endpoint ni fonction d'export structuré (portabilité, **art. 20**), ni de suppression/anonymisation ciblée à la demande (**art. 17**). La seule suppression existante est le cron des 2 ans (globale, temporelle, pas à la demande) et la suppression d'une réservation par l'admin (`deleteBookingAdmin`, qui conserve volontairement le client, `lib/admin/bookings.ts:170-194`). Une demande d'effacement individuel devrait être traitée à la main en SQL. Ce n'est pas illégal en soi (traitement manuel admis pour un petit volume), mais l'écart entre ce qui est promis et ce qui est outillé est à assumer par le responsable, et l'absence de suppression ciblée fiable est un risque.
- **Qui agit** : responsable de traitement (décide du process) ; le développeur doit a minima fournir un moyen fiable de supprimer/exporter les données d'une personne identifiée par email (client + formData + bookings).
- **Correction attendue** : soit documenter et outiller une procédure manuelle sûre (script paramétré par email supprimant client et cascades), soit exposer une action admin d'effacement/export par client. Vérifier que l'effacement d'un client purge bien formData et bookings (la cascade existe : `schema.ts:74-80`).

### [majeur] Route d'envoi d'email de confirmation non authentifiée : divulgation de données personnelles à un tiers

- **Fichier** : `app/api/booking/confirm-email/route.ts:93-134` (aucun `withAdminAuth`, seulement un rate-limit par IP)
- **Risque** : la route `POST /api/booking/confirm-email` prend un `bookingId` (UUID) et envoie un email contenant l'ensemble des données de la réservation (nom, email, téléphone, pronom, animal, infos libres) au client ET à l'admin, via `getBookingById` puis `sendConfirmationEmail` (`send-confirmation-email.tsx:38-70` embarque clientEmail, clientPhone, animalInfo, householdInfo). Elle n'est pas protégée par authentification. Un tiers qui obtient/devine un bookingId peut reprovoquer l'envoi d'un email chargé de données personnelles vers l'adresse enregistrée (spam ciblé, confirmation de l'existence d'une réservation, mail-bombing atténué mais non empêché par le rate-limit IP). L'UUID v4 rend le guessing difficile mais ce n'est pas un secret d'autorisation. **Art. 32.** (recoupe le finding bloquant de l'audit sécurité).
- **Qui agit** : développeur pour le responsable de traitement.
- **Correction attendue** : restreindre l'appel au flux légitime (authentification admin, ou signature/nonce à usage unique lié au booking fraîchement créé), au lieu de s'appuyer uniquement sur la connaissance du bookingId.

### [mineur] Champs libres du formulaire pouvant capter des données sensibles sans garde-fou (art. 9)

- **Fichier** : `src/db/schema.ts:53-58` (`animalInfo`, `householdInfo`, `serviceSpecificAnswers`, `answers` en `text` libre) ; validation permissive `lib/validation/booking.ts:62-71` (chaînes libres, nullable, aucune restriction de contenu)
- **Risque** : ces champs texte libre (contexte de vie de l'animal, composition du foyer, motif de la demande de communication animale) peuvent faire remonter des informations de santé ou des éléments de vie privée sensibles, sur l'animal mais aussi indirectement sur la personne (deuil, maladie, situation familiale). La finalité est légitime et la collecte se fait sur la base de l'**art. 6-1-b**, mais rien n'informe l'utilisateur de ne pas y déposer d'infos sensibles inutiles, et rien ne limite ni ne chiffre ce contenu au repos. Ce n'est pas un traitement de données sensibles au sens strict (données sur l'animal), mais le risque de captation indirecte existe.
- **Qui agit** : responsable de traitement (mention d'information / libellé du champ) ; développeur pour la minimisation technique éventuelle.
- **Correction attendue** : ajouter une mention invitant à ne renseigner que le nécessaire, et évaluer avec le responsable si un chiffrement applicatif de ces colonnes est proportionné. Décision métier / DPO.

### [mineur] Tokens de reset de mot de passe jamais purgés ni révoqués à la désactivation

- **Fichier** : `src/db/schema.ts:88-98` (table `passwordResetTokens` : email + token en clair, expiresAt, used) ; `app/api/cron/cleanup/route.ts:38-41` (le cron ne supprime QUE la table clients) ; `lib/actions/password-reset.ts` (aucune suppression des tokens expirés/utilisés)
- **Risque** : les tokens de réinitialisation (associés à un email admin) s'accumulent indéfiniment en base. Le token est aléatoire 256 bits (`tokens.ts:9`) et vérifié sur `used=false` + non expiré à la consommation (`password-reset.ts:94-101`), donc l'exploitation directe est limitée, mais la rétention sans fin d'une table email+token est contraire à la minimisation (**art. 5-1-e**). Par ailleurs, pas de logique de révocation des tokens en cours si un compte admin est désactivé/supprimé (il n'y a d'ailleurs pas de flux de désactivation). Session en JWT stateless de 8 h (`auth.ts:173-181`) : pas de révocation immédiate possible, connu et acceptable pour un seul admin mais à noter.
- **Qui agit** : développeur pour le responsable de traitement.
- **Correction attendue** : purger les tokens expirés/utilisés (étendre le cron ou une requête dédiée), et invalider les tokens d'un email lors d'un reset réussi.

### [mineur] Doc Swagger publique exposant le modèle de données personnelles ; variable MY_EMAIL non documentée

- **Fichier** : `app/api/swagger/route.ts:4-15` (GET public) ; annotations décrivant clientName/clientEmail/clientPhone en réponse (ex `confirm/route.ts:107-118`) ; `app/api-docs` présent. Et `lib/email/send-contact-email.tsx:30` + `send-confirmation-email.tsx:67` utilisent `process.env.MY_EMAIL` absent de `.env.example`.
- **Risque** : la spec OpenAPI est générée et servie publiquement, exposant la cartographie des champs personnels et la surface d'API (facilite le ciblage). Ce n'est pas une fuite de données réelles mais une exposition d'information utile à un attaquant (défense en profondeur, **art. 32**). Secondairement, `MY_EMAIL` (email destinataire des notifications, donnée personnelle de la praticienne) est utilisé sans figurer dans `.env.example`, ce qui nuit à la traçabilité de la config. Aucun secret n'est commité par ailleurs (`.gitignore` couvre `.env*` et `/logs` ; `git ls-files` confirme que seul `.env.example` est suivi).

  > Note : l'audit sécurité constate le middleware couvrant `/api/swagger` et `/api-docs`. À réconcilier en test dynamique (voir « Non vérifiable statiquement ») pour statuer sur l'exposition réelle de la doc en prod.
- **Qui agit** : développeur pour le responsable de traitement.
- **Correction attendue** : restreindre l'accès à `/api/swagger` et `/api-docs` en prod (auth admin ou désactivation), et documenter `MY_EMAIL` dans `.env.example`.

---

## Points conformes vérifiés (à ne pas régresser)

- Mots de passe hachés en **Argon2id** avec paramètres OWASP (`lib/auth/password.ts:6-13`). Le hash n'est jamais renvoyé (`auth.ts:75-79`).
- Tokens de reset générés via `crypto.randomBytes` 32 octets, expiration 30 min (`tokens.ts`).
- Réponse anti-énumération sur le reset (message identique que l'email existe ou non, `password-reset.ts:42-48`).
- Routes admin protégées par `withAdminAuth` + defense-in-depth (`with-admin-auth.ts`), OAuth Google en whitelist stricte sur la table admins (`auth.ts:104-133`).
- En-têtes de sécurité et CSP restrictive (`next.config.ts`), pas de wildcard CORS constaté.
- Requêtes paramétrées via Drizzle (pas d'injection SQL manuelle).
- Rétention de 2 ans implémentée par cron avec cascade (`cleanup/route.ts` + `schema.ts:74-80`), cohérente avec la politique affichée. **Attention** : la purge se base sur `clients.updatedAt` ; or `createOrUpdateClient` met à jour `updatedAt` à chaque nouvelle réservation (`clients.ts:36-41`), donc un client fidèle ne sera jamais purgé, ce qui est le comportement voulu (2 ans depuis le dernier contact).

---

## Cartographie des données personnelles touchées

| Donnée | Finalité | Base / conservation | Destinataires |
|---|---|---|---|
| Nom, prénom client (`clients.name`) | Identification, suivi réservation | Art. 6-1-b / 2 ans depuis dernier contact (updatedAt) | Praticienne (responsable), Resend (email), Supabase (BDD), hébergeur, |
| Email client (`clients.email`) | Communication réservation | Art. 6-1-b / 2 ans | Praticienne, Resend, Supabase, hébergeur. **Actuellement loggé en clair (à corriger)** |
| Téléphone client (`clients.phone`, optionnel) | Contact complémentaire | Art. 6-1-b / 2 ans | Praticienne, Supabase, email admin |
| Champs libres formData (`animalInfo`, `householdInfo`, `serviceSpecificAnswers`, `answers`) | Réalisation de la prestation | Art. 6-1-b / 2 ans | Praticienne, Supabase, emails de confirmation. **Risque captation indirecte art. 9** |
| Consentements / pronom (`socialMediaConsent`, `preferredPronoun`, `cgvAccepted`, `monthlyPlanningAck`) | Preuve de consentement / CGV, personnalisation | Art. 6-1-b / 2 ans | Supabase |
| Email + nom du formulaire de contact | Traitement du message | Art. 6-1-f ou 6-1-b / non stocké en BDD, transite par Resend | Praticienne (MY_EMAIL), Resend. **Loggé en clair (à corriger)** |
| Email admin, mot de passe haché, username (`admins`) | Authentification back-office | Art. 6-1-b/f / durée du compte | Supabase, Google OAuth (email) |
| Token reset + email (`passwordResetTokens`) | Réinitialisation mot de passe | Art. 6-1-f / **jamais purgé (à corriger)** | Supabase, Resend |
| IP visiteur | Rate-limiting, anti-bot | Art. 6-1-f / en mémoire (LRU, éphémère) + transmise à Cloudflare Turnstile | Cloudflare (Turnstile) |

> Localisation / transferts hors UE des sous-traitants : à confirmer avec le responsable (voir section registre). Le code ne fige pas la région d'hébergement.

---

## À porter au registre / à la doc du responsable

- **Registre des activités de traitement (art. 30)** : traitement « gestion des réservations et contacts », finalités, base légale 6-1-b, catégories de données (dont champs libres), durée 2 ans, destinataires.
- **Liste des sous-traitants et transferts (art. 28 et 44+)** à tenir à jour et à faire correspondre au code réel : Supabase (BDD), hébergeur applicatif, Resend (emails, reçoit email/nom/contenu de réservation), Cloudflare Turnstile (anti-bot, reçoit l'IP visiteur, **NON mentionné dans la politique de confidentialité actuelle : à ajouter**), Google (OAuth admin, reçoit l'email admin), Koyeb/Strapi (CMS, sans donnée client). S'assurer d'un DPA signé pour chacun et confirmer la localisation (UE / hors UE + garanties type CCT).
- **Écart doc/réalité** : la politique de confidentialité (`app/privacy-policy`) cite les principaux sous-traitants mais **omet Cloudflare Turnstile** qui reçoit l'IP des visiteurs : à corriger par le responsable.
- **Décision responsable / DPO** : opportunité d'un chiffrement au repos des champs libres ; procédure documentée de réponse aux demandes d'exercice de droits (le code ne l'outille pas aujourd'hui).
- Confirmer la localisation et le DPA de chaque sous-traitant potentiellement hors UE au titre des transferts.

---

## Top 3 à traiter en priorité

1. **`CRON_SECRET` loggé en clair** (`cleanup/route.ts:26-27`) — protège une purge en masse.
2. **Emails et noms de clients loggés en clair en prod** (`confirm/route.ts:239`, `email/route.ts:105`).
3. **Aucun moyen technique pour les droits d'accès / effacement / portabilité** pourtant promis dans la politique.

Donnée la plus à risque : **l'email du client** (identifiant direct), exposé à la fois dans les logs applicatifs et réenvoyable via une route de confirmation non authentifiée.
