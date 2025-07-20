export default function Title({ label, className }) {
  return(
    <div className={`text-[32px] font-semibold border-b-[2px] border-[#dddddd] pb-2 ${className}`}>
      {label}
    </div>
  );
}