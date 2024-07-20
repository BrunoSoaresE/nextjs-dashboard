import { Revenue } from "@/src/models/definitions";
import { sql } from "@vercel/postgres";

export async function getRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');
    console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}
