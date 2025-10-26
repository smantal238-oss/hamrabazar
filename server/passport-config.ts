import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { storage } from './storage';

export function setupPassport() {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const isVerified = profile.emails?.[0]?.verified;
        
        if (!email || !isVerified) {
          return done(null, false, { message: 'ایمیل تایید نشده است' });
        }
        
        // Check database first by email
        let dbUser = await storage.getUserByEmail(email);
        const { mockUsers } = await import("./mockData");
        let user = mockUsers.find(u => u.phone === email || u.email === email);
        let isNewUser = false;
        
        if (!dbUser && !user) {
          // New user
          user = {
            id: 'user_' + Date.now(),
            name: profile.displayName || 'کاربر',
            email: email,
            phone: email,
            password: 'google_oauth',
            role: 'user',
            createdAt: new Date()
          };
          mockUsers.push(user);
          isNewUser = true;
          console.log(`🎉 New user via Google: ${user.name} (${email})`);
          
          // Save to database
          try {
            await storage.createUser({
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              password: user.password,
              role: user.role
            });
          } catch (dbError) {
            console.error('Error saving user to database:', dbError);
          }
        } else {
          // Existing user - use database user if available
          if (dbUser) {
            user = dbUser as any;
            // Update mockUsers if not there
            if (!mockUsers.find(u => u.id === user!.id)) {
              mockUsers.push(user!);
            }
          }
          console.log(`🔑 User logged in via Google: ${user!.name} (${email})`);
        }
        
        // Add flag to show appropriate message
        (user as any).isNewUser = isNewUser;
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  ));
}
