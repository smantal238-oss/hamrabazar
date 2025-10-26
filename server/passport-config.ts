import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

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
        
        // ایجاد یا پیدا کردن کاربر
        const { mockUsers } = await import("./mockData");
        let user = mockUsers.find(u => u.phone === email || u.email === email);
        
        if (!user) {
          user = {
            id: 'user_' + Date.now(),
            name: profile.displayName || 'کاربر',
            email: email,
            phone: email,
            role: 'user',
            createdAt: new Date()
          };
          mockUsers.push(user);
          console.log(`🎉 New user via Google: ${user.name} (${email})`);
        } else {
          console.log(`🔑 User logged in via Google: ${user.name} (${email})`);
        }
        
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  ));
}
