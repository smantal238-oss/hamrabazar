# Messaging and Admin Approval System Implementation

## Phase 1: Database Schema Updates
- [ ] Add `approved` boolean field to listings table
- [ ] Add `role` field to users table (user/admin)
- [ ] Run migration for schema changes

## Phase 2: Backend Message System
- [ ] Add message CRUD routes in server/routes.ts
- [ ] Add message methods to storage.ts (getMessagesByUser, createMessage, etc.)
- [ ] Update listing creation to require approval

## Phase 3: Frontend Message System
- [ ] Add "Message" button to ListingDetailPage.tsx below contact button
- [ ] Create MessagesPage.tsx for viewing/sending messages
- [ ] Add messaging section to DashboardPage.tsx
- [ ] Create MessageCard component for message display

## Phase 4: Admin Panel
- [ ] Create AdminPage.tsx with listing approval interface
- [ ] Add admin authentication routes
- [ ] Update navigation for admin access
- [ ] Add admin role checking in auth context

## Phase 5: UI/UX Polish
- [ ] Add message notifications
- [ ] Style message interface
- [ ] Add loading states and error handling
- [ ] Test messaging flow end-to-end
