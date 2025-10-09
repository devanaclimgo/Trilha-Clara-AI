# 🚀 Supabase Migration Guide - Trilha Clara IA

## 📋 Overview

This guide will help you migrate from localStorage to Supabase for a proper multi-tenant SaaS architecture.

## 🎯 What We're Migrating

### Current localStorage Data:

- `tcc-trabalhos` - Array of TCC works
- `tcc-notes` - User notes for each work
- `token` - Authentication token

### New Supabase Structure:

- **Users**: Extended auth.users with profile data
- **TCCs**: Academic works with full metadata
- **Notes**: User notes linked to TCCs
- **Content**: AI-generated content sections

## 🛠️ Step-by-Step Migration

### 1. **Setup Supabase Project**

```bash
# 1. Create Supabase project at https://supabase.com
# 2. Get your project URL and anon key
# 3. Create .env.local file in frontend/

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. **Run Database Schema**

```bash
# In your Supabase SQL editor, run:
# Copy and paste the contents of supabase_schema.sql
```

### 3. **Update Components to Use Supabase**

#### Replace useTccData with useSupabaseTccData:

```typescript
// OLD: import { useTccData } from '@/hooks/useTccData'
// NEW: import { useSupabaseTccData } from '@/hooks/useSupabaseTccData'

const {
  trabalhos,
  trabalhoAtual,
  tccData,
  salvarTrabalho,
  criarNovoTrabalho,
  // ... other methods
} = useSupabaseTccData()
```

#### Replace useAuth with useSupabaseAuth:

```typescript
// OLD: import { useAuth } from '@/hooks/useAuth'
// NEW: import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'

const {
  isAuthenticated,
  isLoading,
  user,
  signIn,
  signUp,
  signOut,
  // ... other methods
} = useSupabaseAuth()
```

### 4. **Update Authentication Pages**

#### Login Page:

```typescript
// Replace fetch calls with Supabase auth
const { signIn, signInWithGoogle } = useSupabaseAuth()

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    await signIn(formData.email, formData.password)
    router.push('/dashboard')
  } catch (error) {
    // Handle error
  }
}
```

#### Signup Page:

```typescript
const { signUp } = useSupabaseAuth()

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    await signUp(formData.email, formData.password, formData.name)
    router.push('/dashboard')
  } catch (error) {
    // Handle error
  }
}
```

### 5. **Update Dashboard Components**

#### WorkEditBasicInfo:

```typescript
// Add onStatusChange prop to handle status updates
interface WorkEditBasicInfoProps {
  workData: TccData
  onStatusChange?: (newStatus: TccData['status']) => void
}

// In the component:
const handleStatusChange = (newStatus: TccData['status']) => {
  onStatusChange?.(newStatus)
  // This will automatically sync to Supabase via useSupabaseTccData
}
```

### 6. **Data Migration Strategy**

#### Automatic Migration:

The `useSupabaseTccData` hook automatically detects localStorage data and migrates it to Supabase on first login.

#### Manual Migration (if needed):

```typescript
// In your component:
const { migrateFromLocalStorage } = useSupabaseTccData()

useEffect(() => {
  if (user && hasLocalData) {
    migrateFromLocalStorage(user.id)
  }
}, [user])
```

## 🔧 Configuration Files

### 1. **Environment Variables**

Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. **Supabase Client Configuration**

The `lib/supabase.ts` file is already configured with:

- Auto-refresh tokens
- Persistent sessions
- Session detection in URL

### 3. **Database Schema**

Run the `supabase_schema.sql` file in your Supabase SQL editor.

## 🚀 Benefits of Migration

### ✅ **Multi-tenant Architecture**

- Each user's data is isolated
- Row Level Security (RLS) ensures data privacy
- Scalable for thousands of users

### ✅ **Real-time Sync**

- Data syncs across devices automatically
- No more localStorage limitations
- Offline support with Supabase

### ✅ **Better Performance**

- Optimized database queries
- Proper indexing
- Connection pooling

### ✅ **Enhanced Security**

- JWT tokens with automatic refresh
- Row-level security policies
- Secure API endpoints

### ✅ **Advanced Features**

- Real-time subscriptions
- File storage (for future features)
- Advanced analytics

## 🔄 Migration Process

### Phase 1: Setup (5 minutes)

1. Create Supabase project
2. Run database schema
3. Configure environment variables

### Phase 2: Code Updates (15 minutes)

1. Replace hooks in components
2. Update authentication flows
3. Test basic functionality

### Phase 3: Data Migration (Automatic)

1. Users sign in with existing accounts
2. localStorage data automatically migrates
3. Old data is preserved during transition

### Phase 4: Cleanup (5 minutes)

1. Remove localStorage dependencies
2. Clean up old authentication code
3. Test all features

## 🧪 Testing the Migration

### 1. **Test User Authentication**

```bash
# Test signup
curl -X POST 'https://your-project.supabase.co/auth/v1/signup' \
  -H 'apikey: your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. **Test Data Operations**

- Create a new TCC work
- Add notes
- Update status
- Verify data persists across sessions

### 3. **Test Multi-user**

- Create multiple user accounts
- Verify data isolation
- Test concurrent access

## 🚨 Troubleshooting

### Common Issues:

#### 1. **Authentication Errors**

```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### 2. **Database Connection Issues**

```bash
# Check Supabase project status
# Verify database is running
# Check RLS policies
```

#### 3. **Migration Issues**

```bash
# Check browser console for errors
# Verify localStorage data format
# Check network requests
```

## 📊 Performance Monitoring

### Supabase Dashboard:

- Monitor database performance
- Track API usage
- View real-time logs
- Set up alerts

### Application Monitoring:

- Track user authentication
- Monitor data operations
- Performance metrics
- Error tracking

## 🎉 Post-Migration

### 1. **Remove Old Code**

- Delete localStorage-based hooks
- Remove old authentication code
- Clean up unused imports

### 2. **Optimize Performance**

- Add database indexes
- Implement caching strategies
- Optimize queries

### 3. **Add Advanced Features**

- Real-time collaboration
- File uploads
- Advanced analytics
- Export functionality

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **Community**: https://github.com/supabase/supabase
- **Discord**: https://discord.supabase.com

## 🎯 Next Steps

1. ✅ Complete migration
2. ✅ Test all functionality
3. ✅ Deploy to production
4. ✅ Monitor performance
5. ✅ Add advanced features

---

**Ready to migrate? Let's go! 🚀**
