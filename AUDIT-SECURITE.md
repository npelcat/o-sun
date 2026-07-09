# Audit sécurité (OWASP) : O'Sun - Animal Voice

> Branche : `audit-cyber-rgpd`
> Périmètre : ensemble des endpoints API exposés (`app/api/**/route.ts`), auth, autorisation, config.
> Méthode : audit statique selon OWASP API Security Top 10 (2023) et OWASP Top 10 web. Aucune modification de code. Chaque finding est vérifié dans le code et assorti d'un scénario d'exploitation.

## Verdict

**Écarts à corriger avant prod.** Un finding bloquant exploitable : BOLA sur `POST /api/booking/confirm-email` exposant les données personnelles de tout client et permettant l'envoi d'emails non authentifié.

Récapitulatif : **1 bloquant, 3 majeurs, 3 mineurs.**

---

## Findings

### [bloquant] Fuite de données personnelles clients via BOLA sur confirm-email (OWASP API1 — Broken Object Level Authorization)

- **Fichier** : `app/api/booking/confirm-email/route.ts:93-134` ; `lib/bookings.ts:46-61` (getBookingById) ; `src/db/queries.ts:3-33` (bookingSelectFields)
- **Faille** : la route `POST /api/booking/confirm-email` est publique (aucun `withAdminAuth`, hors matcher du middleware). Elle accepte un `bookingId` (UUID) et appelle `getBookingById(bookingId)` qui joint `clients` + `formData` et renvoie l'objet complet (nom, email, téléphone du client, nom/type/infos de l'animal, réponses de formulaire, consentements) à `sendConfirmationEmail`. Il n'existe aucun contrôle liant l'appelant au booking (pas de token de possession, pas de session). L'ID de booking n'est pas un secret : il est retourné en clair par `POST /api/booking/confirm` (`data.booking.id`) et sert précisément d'entrée à cet endpoint.
- **Scénario d'exploitation** : un attaquant non authentifié qui obtient un `bookingId` (UUID v4, non énumérable en force brute directe, mais tout ID obtenu via un client légitime, un log, un lien partagé, ou une réservation faite par l'attaquant lui-même) déclenche l'envoi d'un email de confirmation contenant les données personnelles du client vers l'adresse enregistrée. Impact principal : déclenchement illimité et non authentifié d'emails (spam/harcèlement de la boîte de la praticienne et des clients, épuisement du quota Resend). Impact secondaire : si un `bookingId` valide fuit, l'attaquant peut re-déclencher l'envoi vers la victime. La route n'exige ni preuve de propriété ni preuve d'origine (Turnstile absent ici alors qu'il est exigé sur `/confirm` et `/email`).
- **Correction attendue** : lier l'envoi à la transaction de confirmation (émettre les emails côté serveur dans `/api/booking/confirm` au lieu d'un endpoint public séparé), ou exiger un jeton à usage unique généré à la confirmation et transmis au client, ou passer la route derrière `withAdminAuth`. A minima ajouter Turnstile + rate limit par booking.

### [majeur] Absence d'anti-brute-force réel sur le login admin, rate limit contournable (OWASP API2 — Broken Authentication)

- **Fichier** : `lib/auth/auth.ts:33` ; `lib/security/rate-limit-simple.ts:28-46,61-64`
- **Faille** : le `loginRateLimiter` est clé sur `normalizedEmail` (l'email fourni par l'attaquant), pas sur l'IP. Surtout, le store est un `LRUCache` en mémoire de process : sur un hébergement serverless/multi-instances (Vercel/Koyeb), chaque instance a son propre cache, donc la limite de 5/15 min est diluée par le nombre d'instances et remise à zéro à chaque cold start. Le rate limit n'est donc pas fiable en production distribuée.
- **Scénario d'exploitation** : un attaquant lance une attaque par dictionnaire sur l'email admin (une seule praticienne, email potentiellement devinable). Grâce à la répartition multi-instances et aux redémarrages, il dépasse largement 5 tentatives effectives par fenêtre. Argon2id ralentit chaque essai mais ne bloque pas l'attaque en ligne.
- **Correction attendue** : rate limiter distribué (Redis/Upstash/table DB) clé sur IP + email normalisé, verrouillage temporaire du compte après N échecs, et idéalement 2FA sur l'admin.

### [majeur] Endpoints reserve et release-slot publics sans rate limit ni contrôle de possession (OWASP API6 — Unrestricted Resource Consumption / API1)

- **Fichier** : `app/api/booking/reserve/route.ts:85-112` ; `app/api/booking/release-slot/route.ts:66-83` ; `lib/timeslots.ts:44-83`
- **Faille** : les deux routes sont publiques, sans Turnstile ni rate limit (aucun `apiRateLimiter` importé). `reserveSlot` pose un verrou de 15 min sur un créneau ; `releaseSlot` remet `isActive=true, lockedAt=null` sur n'importe quel `timeSlotId` fourni, sans vérifier qui a verrouillé le créneau ni son état courant.
- **Scénario d'exploitation** : (1) déni de service métier — un attaquant appelle en boucle `/api/booking/reserve` sur tous les `timeSlotId` (listés publiquement par `/api/booking/timeslots`) et verrouille tous les créneaux pendant 15 min, rendant le calendrier inréservable en continu. (2) `release-slot` peut réactiver/déverrouiller un créneau déjà verrouillé par un autre visiteur en cours de réservation, perturbant sa transaction. Aucun coût pour l'attaquant.
- **Correction attendue** : appliquer `apiRateLimiter` (par IP) sur reserve et release, exiger Turnstile, et dans `releaseSlot` ne libérer que si le créneau n'est pas déjà confirmé (ne pas réactiver aveuglément `isActive=true`).

### [majeur] Mass assignment : le DTO admin de création de booking accepte status et adminNotes (OWASP API3 — Broken Object Property Level Authorization)

- **Fichier** : `lib/validation/admin.ts:92-146` (createBookingAdminSchema, champs `status` défaut CONFIRMED et `adminNotes`)
- **Faille** : le schéma Zod de création manuelle accepte `status` et `adminNotes` en entrée. La route est protégée par `withAdminAuth` (donc l'auteur est bien admin), l'impact est limité au mono-tenant admin, ce n'est pas exploitable par un visiteur. Le flux public est correctement scellé : `confirmBookingSchema` (public) force `status:"pending"` côté serveur (`createBooking`) et n'expose pas `adminNotes` (vérifié `lib/bookings.ts:15-32`). Écart théorique tant que la route reste admin, d'où le classement majeur / à confirmer.
- **Scénario d'exploitation** : aucun chemin non-admin identifié aujourd'hui. Risque résiduel : si un endpoint public réutilise un jour `createBookingAdminSchema`, un visiteur pourrait s'auto-attribuer `status:confirmed` et écrire des `adminNotes`.
- **Correction attendue** : maintenir la séparation stricte des DTO publics et admin (déjà en place), documenter que `createBookingAdminSchema` ne doit jamais être branché sur une route publique.

### [mineur] Logs verbeux du secret CRON et journalisation de PII / corps de requête (OWASP API8 — Security Misconfiguration / Logging)

- **Fichier** : `app/api/cron/cleanup/route.ts:26-27` (console.log du header Authorization et du `Bearer ${CRON_SECRET}`) ; `app/api/admin/bookings/[id]/route.ts:158-160` et `timeslots/[id]/route.ts:161-163` (`updates: body` loggé) ; `confirm/route.ts:239` (`clientEmail` loggé)
- **Faille** : la route cron logge en clair le secret attendu `Bearer ${CRON_SECRET}` et le header reçu à chaque appel. Toute personne ayant accès aux logs récupère le secret cron, qui donne accès à une connexion DB à privilèges complets (`CRON_DATABASE_URL`, rôle postgres) capable de supprimer tous les clients. D'autres handlers loggent le corps de requête et des emails clients (recoupe l'audit RGPD).
- **Scénario d'exploitation** : un tiers avec lecture des logs (sous-traitant, fuite de dashboard d'hébergement, log shipping mal configuré) lit `CRON_SECRET`, puis appelle `GET /api/cron/cleanup` avec le bon Bearer et déclenche la suppression en masse de clients (bookings/formulaires en cascade).
- **Correction attendue** : supprimer les `console.log` du secret cron (lignes 26-27), retirer le logging des corps de requête et des emails, comparer le secret en temps constant (`crypto.timingSafeEqual`).

### [mineur] Reset de mot de passe : anciens tokens non révoqués à l'émission (OWASP API2 — Broken Authentication)

- **Fichier** : `lib/actions/password-reset.ts:51-60` (insert d'un nouveau token sans invalider les précédents) ; `tokens.ts:7-18`
- **Faille** : génération correcte (crypto.randomBytes 32 o), expiration 30 min, usage unique (`used=true` en transaction), anti-énumération OK (message identique). Mais chaque demande crée un nouveau token sans marquer les précédents `used=true`. Plusieurs tokens valides peuvent donc coexister pour un même email jusqu'à expiration.
- **Scénario d'exploitation** : si un token fuit (email intercepté, historique de proxy) et que la victime en génère un nouveau croyant invalider l'ancien, l'ancien reste exploitable jusqu'à 30 min. Fenêtre limitée mais réelle.
- **Correction attendue** : à chaque `requestPasswordReset`, invalider (`used=true` ou delete) tous les tokens non utilisés de cet email avant d'insérer le nouveau.

### [mineur] Endpoint cron : comparaison de secret non constante et pré-connexion DB privilégiée au chargement du module (OWASP API8)

- **Fichier** : `app/api/cron/cleanup/route.ts:16,22-24`
- **Faille** : `authHeader !== \`Bearer ${...}\`` est une comparaison de chaîne non constante (timing). Par ailleurs `cronClient`/`cronDb` (rôle postgres, droits complets) sont instanciés au niveau module, donc la connexion privilégiée est créée même quand l'appel est non autorisé.
- **Scénario d'exploitation** : timing attack théorique sur le secret (peu praticable sur HTTP mais à corriger). Surface élargie : la connexion à privilèges élevés existe dès le chargement de la route.
- **Correction attendue** : `crypto.timingSafeEqual`, et instancier la connexion cron seulement après validation du secret.

---

## Surface d'attaque (endpoints audités)

| Endpoint | Méthode | Accès attendu | Statut protection |
|---|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | public (NextAuth) | OK, secret contrôlé en prod (auth.ts:184-196) |
| `/api/booking/timeslots` | GET | public lecture | OK (créneaux uniquement, pas de PII) |
| `/api/booking/reserve` | POST | public | **MAJEUR** (pas de rate limit ni Turnstile) |
| `/api/booking/release-slot` | POST | public | **MAJEUR** (pas de rate limit, réactivation aveugle) |
| `/api/booking/confirm` | POST | public | OK (Turnstile + apiRateLimiter IP + Zod + status forcé pending) |
| `/api/booking/confirm-email` | POST | public | **BLOQUANT** (BOLA, PII, envoi email non authentifié) |
| `/api/email` (contact) | POST | public | OK (Turnstile + contactRateLimiter IP + Zod) |
| `/api/admin/bookings` | GET/POST | admin | OK (`withAdminAuth` + Zod) |
| `/api/admin/bookings/[id]` | GET/PUT/DELETE | admin | OK (`withAdminAuth` par méthode + Zod) |
| `/api/admin/timeslots` | GET/POST | admin | OK (`withAdminAuth` + Zod) |
| `/api/admin/timeslots/[id]` | GET/PUT/DELETE | admin | OK (`withAdminAuth` par méthode + Zod) |
| `/api/cron/cleanup` | GET | Bearer CRON_SECRET | Protégé mais secret loggé en clair (voir finding) |
| `/api/swagger` | GET | protégé par middleware | OK (matcher inclut `/api/swagger` et `/api-docs/:path*`) |

---

## Points sûrs notables (à ne pas régresser)

- Toutes les routes admin (y compris `[id]`) appliquent `withAdminAuth` par méthode, en défense en profondeur du middleware. **Aucun BFLA trouvé** côté admin.
- Requêtes 100 % Drizzle paramétrées (`eq`/`and`/`or`/`lt`/`gte`), aucune concaténation SQL. **Pas d'injection SQL identifiée.**
- Mot de passe admin haché en **Argon2id** avec paramètres OWASP (mémoire 19 Mo, 2 itérations). Hash jamais renvoyé (`authorize` ne retourne pas `passwordHash`).
- Google OAuth restreint par **whitelist en base** (signIn refuse les emails absents de `admins`, auth.ts:104-141).
- `NEXTAUTH_SECRET` obligatoire en prod (crash explicite sinon), session JWT 8 h avec rotation. Pas de secret en dur committé (`.env` ignoré, seul `.env.example` suivi).
- Anti-énumération correct sur `forgot-password` (message identique) et login (null uniforme).
- CSP stricte, `X-Frame-Options DENY`, `nosniff`, `frame-ancestors none`, `object-src none` dans `next.config.ts`.
- `withErrorHandler` ne divulgue pas la stack au client (stack seulement en log serveur ; réponse générique 500).
- `reserveSlot` utilise une transaction `FOR UPDATE` (verrou pessimiste) contre les races de double réservation.

---

## Non vérifiable statiquement (à traiter en DAST / pentest / revue infra)

- Comportement réel du rate limit en production (nombre d'instances serverless, cold starts) — à tester en charge.
- Configuration effective du header `x-forwarded-for` par le reverse proxy : si l'attaquant peut le spoofer, le rate limit par IP est contournable.
- Rôle et privilèges réels du user DB applicatif vs `postgres` (cron) côté Supabase — le code suppose une restriction à vérifier en base.
- Contenu exact des emails générés (`send-confirmation-email.tsx`) : quelles données PII y figurent réellement.
- Rotation effective des secrets (`RESEND_API_KEY`, `CRON_SECRET`, `GOOGLE_CLIENT_SECRET`) et exposition des logs de la plateforme.
- Comportement de `getSlotById` après `reserveSlot` sur un `timeSlotId` inexistant.

---

## Top 3 à traiter en priorité

1. **BOLA sur `POST /api/booking/confirm-email`** (API1) — PII client exposée + envoi d'emails non authentifié.
2. **`reserve` / `release-slot` publics sans rate limit ni contrôle de possession** (API6/API1) — DoS du calendrier.
3. **Anti-brute-force login en cache mémoire non distribué et clé sur email** (API2) — inefficace en serverless.

Flux le plus exposé : `POST /api/booking/confirm-email` (public, BOLA, PII, déclenchement d'emails).
