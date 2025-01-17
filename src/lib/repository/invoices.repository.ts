import { sql } from '@vercel/postgres';


import { formatCurrency } from '../utils';
import { LatestInvoiceRaw, InvoicesTable, InvoiceForm, InvoicesCards, LatestInvoice } from '@/src/models/invoice';


export async function getLatestInvoices(): Promise<LatestInvoice[]> {
  try {

    console.log('get getLatestInvoices...');
    console.log('get getLatestInvoices...');
    await new Promise((resolve) => setTimeout(resolve, 1000));




    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;
    
    console.log('Data get completed after 3 seconds. getLatestInvoices');
    console.log('Data get completed after 3 seconds. getLatestInvoices');
    
    

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));



    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get the latest invoices.');
  }
}

export async function getCardData(): Promise<InvoicesCards> {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    } as InvoicesCards;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function getFilteredInvoices(
  query: string,
  currentPage: number,
): Promise<InvoicesTable[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get invoices.');
  }
}

export async function getInvoicesPages(query: string): Promise<number> {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get total number of invoices.');
  }
}

export async function getInvoiceById(id: string): Promise<InvoiceForm> {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id}
      order by invoices.id;
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));
    


    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get invoice.');
  }
}



export async function addInvoices(customerId: string, amountInCents: number, status: string, date: string): Promise<void> {
  try {

      await sql`
          INSERT INTO invoices (customer_id, amount, status, date)
          VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    
    
  } catch (error) {
    console.error('Database Error: Failed to Create Invoice:', error);
    throw new Error('Database Error: Failed to Create Invoice.');
  }
}



export async function updateInvoices(id: string,customerId: string, amountInCents: number, status: string): Promise<void>{
  try {

      await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
    
    
  } catch (error) {
    console.error('Database Error: Failed to Update Invoice:', error);
    throw new Error('Database Error: Failed to Update Invoice.');
  }
}

export async function deleteInvoices(id: string): Promise<void> {
  try {

       await sql`DELETE FROM invoices WHERE id = ${id}`;
    
  } catch (error) {
    console.error('Database Error: Failed to Delete Invoice:', error);
    throw new Error('Database Error: Failed to Delete Invoice.');
  }
}





