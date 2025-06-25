export default function Button({ label }) {
  return (
    <button className="bg-blue-500 hover:bg-transparent hover:text-black text-white w-full rounded-lg mt-5 py-[5px] duration-[0.2s] border-2 border-blue-500">
      {label}
    </button>
  );
}
