import { getCustomers } from "@/src/lib/repository/customer-repository";
import Breadcrumbs from "@/src/ui/invoices/breadcrumbs";
import Form from "@/src/ui/invoices/create-form";
import { Metadata } from "next";

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