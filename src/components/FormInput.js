export default function FormInput({label, name, type, placeholder, onChange, error, autoFocus}) {
  return(
    <div className="flex flex-col mb-5 w-full">
      <label>{label}</label>
      <input
        autoFocus={autoFocus}
        className="mt-2 bg-blue-100 px-4 py-[5px] border-[2px] border-transparent outline-none rounded-lg focus:border-blue-500"
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}