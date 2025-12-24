import Link from 'next/link';

type LinkTableProps = {
  path: string;
  children: React.ReactNode;
  newTab?: boolean;
};
const LinkTable = ({ path, children, newTab = false }: LinkTableProps) => {
  return (
    <Link href={path} target={newTab ? '_blank' : '_self'} className="text-link">
      {children}
    </Link>
  );
};

export default LinkTable;
