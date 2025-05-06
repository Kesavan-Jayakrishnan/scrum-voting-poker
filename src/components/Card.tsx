type CardProps = {
  value: string;
  onClick: () => void;
};

export default function Card({ value, onClick }: CardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white text-black w-20 h-28 rounded-lg flex items-center justify-center text-2xl font-bold hover:bg-gray-200 transition"
    >
      {value}
    </button>
  );
}
