export default function Button({
  variant = "primary",
  icon,
  iconPosition = "left",
  className = "",
  children,
}) {
  const baseStyles = "border-[2px] rounded-lg font-semibold duration-[0.3s] px-4 py-[5px]";
  
  const variants = {
    primary: "bg-[#089bab] text-white hover:bg-transparent hover:text-black border-[#089bab]",
    secondary: "bg-gray-300 text-black hover:bg-gray-400",
  };

  return (
    <button
      className={`flex items-center justify-center ${baseStyles} ${variants[variant]} ${className}`}
    >
      {icon && iconPosition === "left" && <span>{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span>{icon}</span>}
    </button>
  );
}
