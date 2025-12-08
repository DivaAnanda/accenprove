# Accenprove - Berita Acara Management System

Sistem manajemen Berita Acara (BA) digital untuk approval workflow dengan digital signature.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** SQLite + Drizzle ORM
- **Authentication:** JWT (HTTPOnly Cookies)
- **Email:** Nodemailer (Gmail SMTP)
- **Styling:** Tailwind CSS

## Features

✅ Role-based authentication (Admin, Direksi, DK, Vendor)  
✅ Digital signature approval workflow  
✅ Real-time dashboard statistics  
✅ BA creation, edit, approve/reject  
✅ Email verification & password reset  
✅ PDF export for approved BA  

## Getting Started

### 1. Prerequisites

- Node.js 20+ 
- npm or yarn

### 2. Installation

```bash
# Clone repository
git clone <repo-url>
cd accenprove

# Install dependencies
npm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration
# See .env.example for detailed instructions
```

**Required variables:**
- `JWT_SECRET` - Generate secure key (min 32 chars)
- `EMAIL_USER` - Gmail address for sending emails
- `EMAIL_PASSWORD` - Gmail App Password (not regular password)

### 4. Database Setup

```bash
# Initialize database schema
npm run db:push

# (Optional) Seed demo data
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Demo Credentials

After seeding database:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@accenprove.com | password123 |
| Direksi | direksi@accenprove.com | password123 |
| DK | dk@accenprove.com | password123 |
| Vendor | vendor@accenprove.com | password123 |

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio (DB GUI)
npm run db:seed      # Seed demo data
```

## Project Structure

```
accenprove/
├── app/                # Next.js App Router pages
│   ├── api/           # API routes
│   ├── ba/            # BA pages (create, detail, success)
│   └── dashboard/     # Dashboard pages
├── components/        # Reusable React components
├── contexts/          # React Context (Auth)
├── drizzle/           # Database schema & config
├── lib/               # Utility functions & API clients
├── middleware.ts      # Auth middleware
└── scripts/           # Seed scripts
```

## Workflow Overview

1. **Vendor** creates BA with digital signature
2. **Direksi** reviews and approves/rejects BA
3. If rejected, **Vendor** can edit and resubmit
4. If approved, **DK** can download PDF
5. **Admin** has full system access

## Development Notes

- Database: `sqlite.db` (auto-created, gitignored)
- Timestamps: All dates use WIB timezone (UTC+7)
- BA numbering: Auto-increment per month (BA/YYYY/MM/###)

## For New Team Members

1. Pull latest code
2. Run `npm install`
3. Copy `.env.example` to `.env.local` and configure
4. Run `npm run db:push` to create tables
5. Run `npm run db:seed` for demo data
6. Start coding! 🚀

## Troubleshooting

**Error: "Cannot find module '@/drizzle/db'"**  
Run: `npm run db:push`

**Error: "Invalid token" on all pages**  
Clear cookies and login again

**Database locked error**  
Close Drizzle Studio if open

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/)


