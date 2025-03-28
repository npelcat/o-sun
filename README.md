# ☀️ O'Sun - Animal Voice

## 📜 Description

Creation of a showcase website for a self-employed woman offering services related to animals.  
The site includes a service showcase, a contact form, and calls-to-action for booking one or more services.

## 🎉 Current Features

- Home Page (`index.tsx` in the `pages/` folder)
- Navigation between different pages via Next.js routing
- Contact form allowing users to send messages

## ⏳ Upcoming Features

- **Admin Account Management**: admin roles allowing content editing by the site owner, with PostgreSQL database
- **Online Service Booking**: directly from the site
- **Online Payment**: ability to pay directly through the site and track orders

## 🔬 Technologies Used

- **Next.js**: for server-side rendering and dynamic page management
- **React**: for creating a responsive user interface
- **TypeScript**: for stronger, more maintainable code with static typing
- **PostgreSQL**: relational database to manage users, services, and bookings
- **Next.js API Routes**: for backend API management within the same project

---

## 💿 Installation and Setup

### 🔧 Prerequisites

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/) (optional but recommended for local development)
- PostgreSQL (only if not using Docker)

---

### 📦 Option 1 – Install Without Docker

1. **Clone this repository**:

   ```bash
   git clone https://github.com/npelcat/o-sun.git
   cd o-sun
   ```

````

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up your environment variables**:

   Create a `.env.local` file at the root of the project based on the `.env.example` provided:

   ```bash
   cp .env.example .env.local
   ```

   Then fill in your credentials.

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. Open your browser at [http://localhost:3000](http://localhost:3000)

---

### 🐳 Option 2 – Install With Docker (recommended for dev)

1. **Clone this repository**:

   ```bash
   git clone https://github.com/npelcat/o-sun.git
   cd o-sun
   ```

2. **Set up your environment variables**:

   ```bash
   cp .env.example .env.local
   ```

   Fill in your values (e.g. API keys, database URLs, etc.).

3. **Start the container**:

   ```bash
   docker-compose up
   ```

4. Visit your app at [http://localhost:3001](http://localhost:3001) (or the port defined in your `docker-compose.yml`)

5. To stop the container:

   ```bash
   docker-compose down
   ```

⚠️ Your code updates will be reflected live if volumes are correctly mounted (default behavior in development setup).

---

## 💾 Database

🔜 The project will use **PostgreSQL** to manage data related to admin, bookings and services.
A detailed database schema and SQL queries will be included in future updates.

---

## 🌱 Deployment

The site is currently deployed on **Vercel**:
👉 [https://www.osun-voixanimale.com/](https://www.osun-voixanimale.com/)

---

## 🔒 Security

* Session management and admin role (**in progress**)
* Secured API via authentication (**upcoming feature**)

---

## 📫 Contributing

All feedback, improvement suggestions, and contributions are welcome!
Feel free to open an issue or submit a pull request.

---

## \:octocat: Author

* **@nad\_cat** – Passionate Full Stack Developer, France
* Learn more about my experience: [LinkedIn](https://www.linkedin.com/in/nadege-pelcat/)

````
