import type { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { GithubProfile } from "next-auth/providers/github"

export const options: NextAuthOptions = {
  // ==== Oauth Providers ==== //
  providers: [
    GitHubProvider({
      profile(profile: GithubProfile) {
        // console.log(profile)
        return {
          ...profile,
          role: profile.role ?? "user",
          id: profile.id.toString(),
          image: profile.avatar_url,
        }
      },
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),

    // Local Login //
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Your username...",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your password...",
        },
      },
      async authorize(credentials) {
        // This is where you need to retrieve user data
        // to verify with credentials.
        const user = {
          id: "42",
          name: "Dave",
          password: "next",
          role: "admin",
        }

        if (
          credentials?.username === user.name &&
          credentials?.password === user.password
        ) {
          return user
        } else {
          return null
        }
      },
    }),
  ],
  // ==== Persist Login ==== //
  callbacks: {
    async jwt({ token, user }) {
      // User is available  during sign-in
      if (user) {
        token.role = user.role
      }
      return token
    },
    // If you want to use the role in client components
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role
      return session
    },
  },
}
