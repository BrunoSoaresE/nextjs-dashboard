import { Revenue } from '@/src/models/revenue';
import { sql } from '@vercel/postgres';

export async function fetchRevenue(): Promise<Revenue[]> {
  try {
    //await new Promise((resolve) => setTimeout(resolve, 1500));
    const data = await sql<Revenue>`SELECT * FROM revenue`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

