import { getCustomers } from "@/src/lib/repository/customer-repository";
import { getInvoiceById } from "@/src/lib/repository/invoice-repository";
import Breadcrumbs from "@/src/ui/invoices/breadcrumbs";
import Form from "@/src/ui/invoices/edit-form";
import { Metadata } from "next";
import { notFound } from "next/navigation";

 
export const metadata: Metadata = {
  title: 'Edit Invoices',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

   const [invoice, customers] = await Promise.all([
    getInvoiceById(id),
    getCustomers(),
   ]);
  
   if (!invoice) {
    return notFound();
  }
  
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}


