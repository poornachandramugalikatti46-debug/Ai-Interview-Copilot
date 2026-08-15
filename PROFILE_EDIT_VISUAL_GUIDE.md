# 🎨 Visual Workflow - Profile Edit Feature

## User Interface Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     DASHBOARD                              │
│  Welcome Back, Poornachandra P Mugalikatti 👋              │
│                                                              │
│     [P] ← Click here                                         │
└─────────────────────────────────────────────────────────────┘
                           ↓ (Click P icon)
┌─────────────────────────────────────────────────────────────┐
│                 PROFILE POPUP (Modal)                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              P                                        │  │
│  │  Poornachandra P Mugalikatti                         │  │
│  │  user                                                │  │
│  │                                                       │  │
│  │  Name: Poornachandra P Mugalikatti                   │  │
│  │  Gender: Male                                        │  │
│  │  Education: BCA                                      │  │
│  │  Location: Haveri, Karnataka                         │  │
│  │  Contact: 9876543210                                 │  │
│  │  Email: poorna@example.com                           │  │
│  │                                                       │  │
│  │  [      Close      ]                                 │  │
│  │  [ ✏️ Edit Profile ] ← Click here                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓ (Click Edit Profile)
┌─────────────────────────────────────────────────────────────┐
│              EDIT PROFILE MODAL (Form)                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Edit Profile                              [×]         │  │
│  │ Update your information                              │  │
│  │                                                       │  │
│  │ Full Name                                            │  │
│  │ [Poornachandra P Mugalikatti        ]                │  │
│  │                                                       │  │
│  │ Gender                                               │  │
│  │ [Male                              ▼]                │  │
│  │   - Male                                              │  │
│  │   - Female                                            │  │
│  │   - Other                                             │  │
│  │   - Prefer not to say                                 │  │
│  │                                                       │  │
│  │ Education                                            │  │
│  │ [BCA                               ]                 │  │
│  │                                                       │  │
│  │ Location                                             │  │
│  │ [Haveri, Karnataka                ]                  │  │
│  │                                                       │  │
│  │ Contact Number                                       │  │
│  │ [9876543210                        ]                 │  │
│  │                                                       │  │
│  │ Email                                                │  │
│  │ [poorna@example.com               ] (disabled)       │  │
│  │ Email cannot be changed.                             │  │
│  │                                                       │  │
│  │ [  Cancel  ]  [ 💾 Save Changes ]                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓ (Make changes, click Save)
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND PROCESSING                         │
│                                                              │
│  1. Receive JWT token from header                            │
│  2. Verify token using authMiddleware                        │
│  3. Extract userId from JWT                                 │
│  4. Find user in MongoDB by ID                              │
│  5. Update user fields:                                      │
│     - gender: "Female"                                       │
│     - education: "B.Tech CSE"                                │
│     - location: "Bangalore"                                  │
│     - phone: "9123456789"                                    │
│  6. Save to MongoDB                                          │
│  7. Return updated user object                               │
│                                                              │
│  Console Output:                                             │
│  ========== UPDATE PROFILE ==========                        │
│  ✅ USER FOUND: poorna@example.com                          │
│  ✅ PROFILE UPDATED: poorna@example.com                     │
└─────────────────────────────────────────────────────────────┘
                           ↓ (Return response)
┌─────────────────────────────────────────────────────────────┐
│                 FRONTEND STATE UPDATE                        │
│                                                              │
│  1. Receive success response from API                        │
│  2. Update React state: setUser(updatedUser)                 │
│  3. Update localStorage: "user": {...}                       │
│  4. Close edit modal                                         │
│  5. Show alert: "✅ Profile updated successfully!"           │
│  6. Display profile popup with new data                      │
│                                                              │
│  Browser Console Output:                                     │
│  📤 Sending profile update: {...}                            │
│  📥 PROFILE UPDATE: {success: true, user: {...}}             │
└─────────────────────────────────────────────────────────────┘
                           ↓ (Modal closes, popup refreshes)
┌─────────────────────────────────────────────────────────────┐
│              PROFILE POPUP (Updated Data)                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              P                                        │  │
│  │  Poornachandra P Mugalikatti                         │  │
│  │  user                                                │  │
│  │                                                       │  │
│  │  Name: Poornachandra P Mugalikatti                   │  │
│  │  Gender: Female          ← UPDATED                   │  │
│  │  Education: B.Tech CSE   ← UPDATED                   │  │
│  │  Location: Bangalore     ← UPDATED                   │  │
│  │  Contact: 9123456789     ← UPDATED                   │  │
│  │  Email: poorna@example.com                           │  │
│  │                                                       │  │
│  │  [      Close      ]                                 │  │
│  │  [ ✏️ Edit Profile ]                                 │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ✅ COMPLETE!
```

---

## Data Flow Diagram

```
┌──────────────┐
│  localStorage│  ← JSON.stringify(user)
│              │
│  {fullname,  │
│   email,     │
│   gender,    │────→ On page load
│   education, │
│   location,  │
│   phone}     │
└──────────────┘
       ↑
       │ Update on save
       │
┌─────────────────────────────────────────────┐
│            React Component State             │
│  ┌───────────────────────────────────────┐  │
│  │ user = {                              │  │
│  │   fullname: "...",                    │  │
│  │   email: "...",                       │  │
│  │   gender: "...",                      │  │
│  │   education: "...",                   │  │
│  │   location: "...",                    │  │
│  │   phone: "..."                        │  │
│  │ }                                     │  │
│  │                                       │  │
│  │ profileForm = {                       │  │
│  │   fullname: "...",                    │  │
│  │   gender: "...",                      │  │
│  │   education: "...",                   │  │
│  │   location: "...",                    │  │
│  │   phone: "..."                        │  │
│  │ }                                     │  │
│  │                                       │  │
│  │ showEditProfile = true|false          │  │
│  │ savingProfile = true|false            │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
       ↑
       │ Send data
       │
┌──────────────────────────────────────────┐
│        API Request (Axios)                 │
│  PUT /api/auth/profile                     │
│                                            │
│  Headers: {                                │
│    Authorization: "Bearer JWT_TOKEN"       │
│  }                                         │
│                                            │
│  Body: {                                   │
│    fullname,                               │
│    gender,                                 │
│    education,                              │
│    location,                               │
│    phone                                   │
│  }                                         │
└──────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│        Backend Processing                  │
│  ┌──────────────────────────────────────┐│
│  │ authMiddleware                       ││
│  │ ├─ Extract token                     ││
│  │ ├─ Verify JWT                        ││
│  │ ├─ Set req.user = decoded            ││
│  │ └─ Call next()                       ││
│  └──────────────────────────────────────┘│
│              ↓                             │
│  ┌──────────────────────────────────────┐│
│  │ updateProfile()                      ││
│  │ ├─ Extract userId from req.user.id   ││
│  │ ├─ Find user in MongoDB              ││
│  │ ├─ Update fields                     ││
│  │ ├─ user.save()                       ││
│  │ └─ Return updated user               ││
│  └──────────────────────────────────────┘│
└──────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│        MongoDB Database                    │
│                                            │
│  users collection                          │
│  ┌──────────────────────────────────────┐│
│  │ {                                    ││
│  │   _id: ObjectId("..."),              ││
│  │   fullname: "...",                   ││
│  │   email: "...",                      ││
│  │   password: "$2b$10$...",            ││
│  │   gender: "Female",      ← UPDATED   ││
│  │   education: "B.Tech",   ← UPDATED   ││
│  │   location: "Bangalore", ← UPDATED   ││
│  │   phone: "9123456789",   ← UPDATED   ││
│  │   role: "user",                      ││
│  │   experience: "fresher"              ││
│  │ }                                    ││
│  └──────────────────────────────────────┘│
└──────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│    API Response (JSON)                     │
│  {                                         │
│    success: true,                          │
│    message: "Profile updated...",          │
│    user: {                                 │
│      id, name, email,                      │
│      gender, education,                    │
│      location, phone,                      │
│      role, experience                      │
│    }                                       │
│  }                                         │
└──────────────────────────────────────────┘
       ↓ Response.data.user
       │
    Frontend State Updates:
    ├─ setUser(updatedUser)
    ├─ localStorage.setItem("user", JSON.stringify(updatedUser))
    ├─ setShowEditProfile(false)
    └─ alert("✅ Profile updated successfully!")
       ↓
    UI Refreshes:
    ├─ Edit modal closes
    ├─ Profile popup shows new data
    └─ All fields display updated values
```

---

## Authentication Flow (JWT)

```
┌────────────────────────────────────────────┐
│           USER LOGIN                        │
│  Email: poorna@example.com                  │
│  Password: Dev@12345                        │
└────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────┐
│     Backend: loginUser()                    │
│  1. Find user by email                      │
│  2. bcrypt.compare(password, user.password) │
│  3. Generate JWT token:                     │
│     {                                        │
│       id: user._id,                         │
│       role: user.role,                      │
│       iat: now,                             │
│       exp: now + 7days                      │
│     }                                        │
└────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────┐
│  Response with JWT Token                    │
│  {                                           │
│    success: true,                            │
│    token: "eyJhbGciOiJIUzI1NiIs..."         │
│    user: { ... }                             │
│  }                                           │
└────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────┐
│  Frontend: Save Token & User                │
│  localStorage.setItem("token", token)       │
│  localStorage.setItem("user", user)         │
└────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────┐
│  Later: Update Profile                      │
│  GET token from localStorage                │
│  Create request:                            │
│  PUT /api/auth/profile                      │
│  Header: {                                  │
│    Authorization: "Bearer " + token         │
│  }                                          │
│  Body: { gender, education, ... }           │
└────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────┐
│  Backend: authMiddleware                    │
│  1. Read Authorization header               │
│  2. Extract token (remove "Bearer ")        │
│  3. jwt.verify(token, JWT_SECRET)           │
│  4. Extract id from decoded token           │
│  5. Set req.user = { id, role, ... }        │
│  6. Call next() → updateProfile()           │
│                                             │
│  ✅ If token valid → Request continues     │
│  ❌ If token invalid/expired → 401 error   │
└────────────────────────────────────────────┘
                     ↓
        Request reaches updateProfile()
                     ↓
        Use req.user.id to find user
                     ↓
        Update user in MongoDB
                     ↓
                    ✅ Success!
```

---

## State Management Lifecycle

```
Initial Load:
────────────
localStorage.getItem("user")
      ↓
storedUser = { fullname, email, ... }
      ↓
useState(storedUser)
      ↓
Render profile popup with data


User Clicks Edit Profile:
──────────────────────────
setProfileForm({
  fullname: user.fullname,
  gender: user.gender,
  education: user.education,
  location: user.location,
  phone: user.phone
})
      ↓
setShowEditProfile(true)
      ↓
Edit modal renders with form pre-filled


User Types in Form:
───────────────────
onChange event fires
      ↓
handleProfileChange(e)
      ↓
setProfileForm({
  ...previous,
  [fieldName]: newValue
})
      ↓
Form re-renders with new value
      ↓
User sees changes in real-time


User Clicks Save:
─────────────────
handleSaveProfile()
      ↓
setSavingProfile(true)
      ↓
API.put("/auth/profile", profileForm)
      ↓
Request sent to backend with JWT
      ↓
Backend updates MongoDB
      ↓
Response: { success: true, user: {...} }
      ↓
setUser(updatedUser)
      ↓
localStorage.setItem("user", JSON.stringify(updatedUser))
      ↓
setShowEditProfile(false)
      ↓
setSavingProfile(false)
      ↓
setShowProfile(true)
      ↓
Render updated profile popup


Data Persists:
───────────────
Page refresh
      ↓
localStorage.getItem("user")
      ↓
storedUser = { ... with new data ... }
      ↓
useState(storedUser)
      ↓
Profile popup shows new data
      ↓
✅ Data persisted!
```

---

## Error Handling Flow

```
User clicks Save Changes
         ↓
   Try API request
   │
   ├─ Success (200): Update state + localStorage
   │
   └─ Error:
      │
      ├─ 401 Unauthorized → "Invalid or expired token"
      │   └─ Try login again
      │
      ├─ 404 Not Found → "User not found"
      │   └─ Clear localStorage, login again
      │
      ├─ 500 Server Error → "Failed to update profile"
      │   └─ Check backend logs
      │
      └─ Network Error → "Failed to update profile"
          └─ Check internet connection


All errors:
───────────
1. Logged to console for debugging
2. Displayed in browser alert
3. Save button becomes clickable again
4. Modal remains open (user can retry)
```

---

## Success Indicators ✅

When everything works correctly:

```
✅ Frontend builds without errors
✅ Backend starts and connects to MongoDB
✅ JWT token stored in localStorage after login
✅ Profile popup displays with correct data
✅ Edit Profile button visible in popup
✅ Edit Profile modal opens with pre-filled form
✅ Form fields update as user types
✅ Save button shows loading state
✅ Backend console shows: ✅ PROFILE UPDATED
✅ Frontend console shows: 📥 PROFILE UPDATE
✅ Profile popup refreshes with new data
✅ MongoDB user document updated
✅ Page refresh shows persisted data
✅ Email field is read-only/disabled
```

---

That's the complete visual workflow! 🎉
