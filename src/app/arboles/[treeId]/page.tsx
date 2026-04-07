import TreesPage from '@/components/pages/TreesPage';

interface Props {
  params: Promise<{ treeId: string }>;
}

export default async function Page({ params }: Props) {
  const { treeId } = await params;
  return <TreesPage treeId={treeId} />;
}
