type TitleGroupProps = {
  title: string;
  className?: string;
};

const TitleGroup = ({ title, className }: TitleGroupProps) => {
  return (
    <div className={className}>
      <h2 className="font-medium text-lg mb-0">{title}</h2>
      <hr className="mt-2 mb-5" />
    </div>
  );
};

export default TitleGroup;
