import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginGoogle, login } from "@/lib/api";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        
        try {
          const ideTechSession = await login({
            tenant_slug: "demo",
            identity: credentials.username,
            password: credentials.password
          });
          
          return {
            id: ideTechSession.user.id,
            name: ideTechSession.user.username,
            email: ideTechSession.user.email,
            role: ideTechSession.user.role,
            accessToken: ideTechSession.access_token,
            tenant: ideTechSession.tenant,
          } as any;
        } catch (error) {
          console.error("Credentials login failed:", error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // First time login: initialize token with Google user info
      if (user) {
        let calculatedRole = "student";
        if (user.email === "the.real.ferilee@gmail.com") {
          calculatedRole = "admin";
        } else if (
          user.email?.endsWith("@guru.smk.belajar.id") ||
          user.email?.endsWith("@guru.sma.belajar.id") ||
          user.email?.endsWith("@guru.smp.belajar.id") ||
          user.email?.endsWith("@guru.sd.belajar.id")
        ) {
          calculatedRole = "teacher";
        }
        
        token.role = (user as any).role || calculatedRole;
        token.accessToken = (user as any).accessToken || token.accessToken;
        token.tenant = (user as any).tenant || token.tenant;
        
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          username: (user as any).username || user.name,
          role: (user as any).role || calculatedRole,
          image: user.image,
        };
      }

      // Exchange with IdeTech Backend for Google Login
      if (account?.provider === "google" && account.id_token) {
        try {
          const ideTechSession = await loginGoogle({
            tenant_slug: "demo", 
            id_token: account.id_token,
          });
          
          token.accessToken = ideTechSession.access_token;
          // Merge backend user data if successful
          token.user = {
            ...(token.user as any),
            ...ideTechSession.user,
          };
          token.tenant = ideTechSession.tenant;
        } catch (error) {
          console.error("Backend login failed:", error);
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.tenant = token.tenant;
      
      // Merge user data from token (backend or fallback) into the session user
      if (token.user) {
        session.user = {
          ...session.user,
          ...token.user,
        };
      }
      
      // Ensure role is explicitly set from token.role (the fallback) if not in token.user
      if (!session.user.role && token.role) {
        session.user.role = token.role;
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
