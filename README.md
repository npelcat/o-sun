# ☀️ O'Sun - Animal Voice

## 📜 Description

Showcase website and booking platform for a self-employed professional offering animal communication services. The site includes service presentations, an online booking system, and an admin area for managing appointments and time slots.

---

## 🎉 Current Features

### Client Side

- **Presentation pages**: services, ethics, testimonials
- **Booking system**: select time slots and submit detailed forms
- **Contact form**: send messages with automatic email confirmation
- **Legal pages**: terms & conditions, legal notices

### Admin Side (in development)

- **Secure authentication**: admin login via NextAuth.js with Google OAuth
- **Booking management**: view, confirm, cancel, and add private notes
- **Time slot management**: create, edit, and disable availability _(in development)_

### Technical

- **REST API**: secure routes for data management
- **API documentation**: integrated Swagger accessible via `/api-docs`
- **Data validation**: Zod schemas on client and server side
- **Email notifications**: automatic emails via Resend (client confirmations and admin alerts)

---

## ⏳ Upcoming Features

- **Online payment**: integration of secure payment solution (Stripe/PayPal)
- **Google reviews integration**: display customer testimonials

---

## 🔬 Technologies Used

### Frontend

- **Next.js 16**: App Router for server rendering and page management
- **React**: interactive and responsive user interface
- **TypeScript**: static typing for robust and maintainable code
- **Tailwind CSS**: custom design system with DaisyUI

### Backend & Database

- **Next.js API Routes**: backend endpoint management
- **PostgreSQL**: database hosted on Supabase (production and test)
- **Drizzle ORM**: SQL migrations and query management
- **Zod**: data validation in frontend and backend

### External Services

- **Strapi CMS**: content management (hosted on Koyeb)
- **Resend**: transactional email service
- **NextAuth.js**: authentication with Google OAuth
- **Supabase**: PostgreSQL database hosting

### Development Tools

- **Docker**: containerization for easy installation and development
- **Swagger**: interactive API documentation
- **Vitest**: unit testing framework

---

## 💿 Installation and Setup

### 🔧 Prerequisites

- **Node.js** (v22+ recommended)
- **npm** or **pnpm**
- **Docker** (optional but recommended for development)

---

### 📦 Option 1 – Installation Without Docker

#### 1. Clone the repository

```bash
git clone https://github.com/npelcat/o-sun.git
cd o-sun
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Configure environment variables

Create a `.env.local` file at the project root:

```bash
cp .env.example .env.local
```

Then fill in the required values (see **Environment Variables** section below).

#### 4. Run the development server

```bash
npm run dev
```

#### 5. Access the application

Open your browser at: **http://localhost:3000**

---

### 🐳 Option 2 – Installation With Docker (Recommended)

#### 1. Clone the repository

```bash
git clone https://github.com/npelcat/o-sun.git
cd o-sun
```

#### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in the values in `.env.local` (see **Environment Variables** section).

#### 3. Start the container

```bash
docker-compose up
```

#### 4. Access the application

The app will be available at: **http://localhost:3001**

#### 5. Stop the container

```bash
docker-compose down
```

---

### 🔑 Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# Environment
NODE_ENV=development  # development | production | test
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Strapi CMS API
NEXT_PUBLIC_API_URL=http://localhost:1337

# Supabase Database
DATABASE_URL=postgresql://user:password@host:5432/database
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Email Service (Resend)
RESEND_API_KEY=re_xxxxx
RESEND_SENDER_EMAIL=sender@domain.com

# Google OAuth Authentication
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
```

---

## 💾 Database

### Architecture

- **Production**: PostgreSQL hosted on Supabase
- **Test**: Dedicated Supabase database to validate migrations
- **Development**: Local database with test data

### Migration Management

Migrations are managed via **Drizzle ORM**. Files are located in the `/drizzle` folder.

#### Generate a migration

```bash
npm run drizzle:generate
```

#### Apply migrations

```bash
npm run drizzle:migrate
```

---

## 🛠️ Available Scripts

- `npm run dev` – Start development server
- `npm run build` – Build the application for production
- `npm run start` – Start the production application
- `npm run test` – Run unit tests
- `npm run lint` – Check code quality with ESLint
- `npm run drizzle:generate` – Generate a Drizzle migration
- `npm run drizzle:migrate` – Apply Drizzle migrations

---

## 🌱 Deployment

### Production

The site is deployed on **Vercel**:  
👉 **https://www.osun-voixanimale.com/**

### Connected Services

- **Database**: Supabase (PostgreSQL)
- **CMS**: Strapi hosted on Koyeb
- **Emails**: Resend

---

## 📂 Project Structure

```
/app
  /about              # Static pages (ethics, testimonials)
  /admin              # Admin interface (protected)
  /api                # API routes
    /admin            # Time slots and bookings management
    /auth             # NextAuth authentication
    /bookings         # Client bookings
    /email            # Contact form
    /strapi           # Strapi CMS connection
    /swagger          # API documentation
  /api-docs           # Swagger interface
  /booking            # Booking process
  /contact            # Contact form
  /login              # Admin login page
  /services           # Services presentation
  /cgv                # Terms and conditions
  /mentions-legales   # Legal notices

/drizzle              # Drizzle ORM migrations
/lib                  # Services and business logic
  /admin              # Admin functions
  /validation         # Zod validation schemas

/src
  /components         # Reusable React components
  /db                 # Drizzle + Supabase configuration
  /hooks              # Custom hooks
  /styles             # Global styles

/tests                # Unit tests
/utils                # Utilities (logger, emails, error handler)
```

---

## 🧪 Testing

Unit tests are organized in the `/tests` folder:

```bash
npm run test
```

---

## 🔒 Security

- **Admin authentication**: NextAuth.js with Google OAuth
- **Data validation**: Zod (frontend + backend)
- **Environment variables**: never exposed client-side (except `NEXT_PUBLIC_*`)
- **Secure APIs**: JWT session verification via NextAuth middleware for `/api/admin/*` routes

---

## 🌿 Versioning Strategy

This project follows the **GitHub Flow** branching strategy:

- `main` — production branch, always stable and deployed
- `feature/feature-name` — one branch per feature or fix, branched from `main`

> Direct pushes to `main` are blocked by a branch protection rule.
> Every change must go through a **Pull Request**, and the CI pipeline
> (lint, build, tests) must pass before merging.

---

## ✍️ Commit Conventions

Commits follow the **[Gitmoji](https://gitmoji.dev/)** convention.
Each commit starts with an emoji that indicates the type of change at a glance,
followed by a clear and explicit message.

| Emoji | Code                 | Meaning                 |
| ----- | -------------------- | ----------------------- |
| ✨    | `:sparkles:`         | New feature             |
| 🐛    | `:bug:`              | Bug fix                 |
| ♻️    | `:recycle:`          | Refactoring             |
| 🔒    | `:lock:`             | Security fix            |
| 📝    | `:memo:`             | Documentation           |
| 🚀    | `:rocket:`           | Deployment              |
| 💄    | `:lipstick:`         | UI / styles             |
| ✅    | `:white_check_mark:` | Tests                   |
| 🗃️    | `:card_file_box:`    | Database                |
| 🔧    | `:wrench:`           | Configuration           |
| ⬆️    | `:arrow_up:`         | Upgrade dependencies    |
| 🎨    | `:art:`              | Code structure / format |

**Example:**

```
✨ Add booking form with Zod validation and email confirmation
🐛 Fix time slot not releasing after 15min timeout
📝 Update README with versioning and commit conventions
```

---

## 📫 Contributing

Feedback, improvement suggestions, and contributions are welcome!  
Feel free to open an **issue** or submit a **pull request**.

---

## 👩‍💻 Author

**@nad_cat** – Passionate Full Stack Developer, France  
📧 [LinkedIn](https://www.linkedin.com/in/nadege-pelcat)

---

## 📄 License

This project is under private license. All rights reserved.
