# Accenprove - Next.js

Platform web berita acara untuk kebutuhan perusahaan dengan sistem manajemen profil dan dokumentasi BA (Berita Acara).

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** localStorage + React Hooks

## 📁 Project Structure

```
accenprove-next/
├── src/
│   ├── app/
│   │   ├── profile/         # Profile management (View/Edit)
│   │   ├── tentang/          # About page
│   │   ├── pengajuan-ba/     # BA submission info
│   │   ├── dashboard/        # Dashboard (placeholder)
│   │   ├── buat-ba/          # Create BA form (placeholder)
│   │   ├── riwayat-ba/       # BA history (placeholder)
│   │   ├── layout.tsx        # Root layout with sidebar
│   │   └── page.tsx          # Home redirects to /profile
│   ├── components/
│   │   ├── Sidebar.tsx       # Navigation sidebar
│   │   └── Header.tsx        # Page header with user info
│   ├── lib/
│   │   └── storage.ts        # localStorage utilities
│   └── types/
│       └── profile.ts        # TypeScript interfaces
├── public/
│   └── default-avatar.png    # Default user avatar
└── package.json
```

## 🎯 Features Implemented

### ✅ Profile Management
- View profile with read-only fields
- Edit profile with validation
- Upload profile photo (max 2MB, JPG/PNG)
- Role selection (Staff, Admin, Keuangan, Direksi)
- Department field
- Phone number validation
- localStorage persistence
- Profile change history (last 10 entries)

### ✅ Information Pages
- **Tentang:** About Accenprove platform
- **Pengajuan BA:** Step-by-step guide for BA submission

### 🚧 Placeholder Pages (For Team Development)
- Dashboard
- Buat Berita Acara (BA form)
- Riwayat BA (BA history)

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd accenprove-next

# Install dependencies (already done)
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🎨 Design System

### Colors
- **Primary:** `#116669` (Teal)
- **Primary Light:** `#22c9cf` (Cyan)
- **Background:** `#F5F7FA` (Light Gray)
- **Text:** `#333333` (Dark Gray)

### Components
- Sidebar with active state highlighting
- Responsive header with user info
- Card-based layouts
- Toast notifications
- Loading states
- Form validation

## 💾 Data Storage

Profile data is stored in localStorage:

```typescript
// Key: 'capstone_profile_data'
{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: 'Staff' | 'Admin' | 'Keuangan' | 'Direksi';
  department: string;
  photo?: string; // base64
}

// Key: 'capstone_profile_data_history'
Array<ProfileData & { changedAt: string }>
```

## 🔐 User Roles

1. **Staff** - Regular employee
2. **Admin** - System administrator
3. **Keuangan** - Finance department
4. **Direksi** - Director/Management

## 🤝 Team Collaboration

### Your Completed Sections
- ✅ Profile page (View/Edit)
- ✅ Tentang page
- ✅ Pengajuan BA info page
- ✅ Shared components (Sidebar, Header)
- ✅ Storage utilities
- ✅ TypeScript types

### For Other Team Members
Placeholder pages are ready at:
- `/dashboard` - Dashboard overview
- `/buat-ba` - BA creation form
- `/riwayat-ba` - BA history table

Each page already has Header component integrated. Just replace the placeholder content.

## 📦 Adding New Pages

1. Create folder in `src/app/[route-name]/`
2. Add `page.tsx` with your component
3. Import and use `<Header title="Your Title" />`
4. Update sidebar link in `src/components/Sidebar.tsx` if needed

Example:
```tsx
import Header from '@/components/Header';

export default function NewPage() {
  return (
    <>
      <Header title="New Page" />
      <div className="flex-1 p-8">
        {/* Your content */}
      </div>
    </>
  );
}
```

## 🐛 Known Issues

- Profile photo stored as base64 (consider cloud storage for production)
- No backend integration yet (pure frontend)
- No authentication system
- localStorage has ~5-10MB limit

## 🚀 Next Steps

1. **Backend Integration**
   - Setup API routes in `src/app/api/`
   - Connect to database (PostgreSQL/MongoDB)
   - Implement JWT authentication

2. **Features to Add**
   - Dashboard with statistics
   - BA creation workflow
   - BA history with filters
   - Real-time notifications
   - File upload to cloud storage

3. **Improvements**
   - Add form validation library (Zod/Yup)
   - Implement React Query for data fetching
   - Add unit tests (Jest/Vitest)
   - Setup E2E tests (Playwright)

## 📄 License

Internal project for Dicoding Capstone.

## 👥 Team

Capstone Group Project - Accenprove Team

---

**Current Status:** Development Server Running ✅  
**Access:** http://localhost:3000
