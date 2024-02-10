import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.NEXT_PUBLIC_GITHUB_ID ?? "",
            clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET ?? "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                uid: { label: "UID", type: "text" },
            },
            async authorize(credentials: any) {
                // Here, you should validate the credentials (e.g., check if the UID and email match a user in your database)
                console.log('here', credentials);
                const user = { id: credentials?.uid, email: credentials?.email };
                // Return null if the user cannot be found or credentials are invalid
                if (!user) return null;
                // Otherwise, return the user object
                return user;
            },
        }),
    ],
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };