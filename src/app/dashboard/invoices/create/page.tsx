import Form from '@/src/ui/invoices/create-form';
import Breadcrumbs from '@/src/ui/invoices/breadcrumbs';
import { getCustomers } from '@/src/lib/repository/customers.repository';
 
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Create Invoices',
};

export default async function Page() {
  const customers = await getCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}