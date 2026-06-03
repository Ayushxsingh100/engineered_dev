import EditProjectClient from "./EditProjectClient";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;

  return <EditProjectClient slug={id} />;
}
