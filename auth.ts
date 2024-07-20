import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { User } from './src/models/definitions';
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      
      async authorize(credentials) {
        console.log('credentials')
        
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        
        console.log('auth')
 
        if (parsedCredentials.success) {
                  console.log('success')

          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
            console.log('user')
          console.log(user)
          
            if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          
            console.log('passwordsMatch')
          console.log(passwordsMatch)
            if (passwordsMatch) return user;
        }
            
         console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});