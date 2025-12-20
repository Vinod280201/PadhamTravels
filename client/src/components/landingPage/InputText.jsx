export const InputText = ({ image, placeholder, label, extrastyle }) => {
  return (
    <div>
      <div
        className={`flex border border-gray-400 rounded-sm px-2 py-2 ${extrastyle}`}
      >
        <div className="border-r border-r-gray-400 px-3">{image}</div>
        <input
          className="h-5 mt-0.5 outline-none border-none focus:outline-none focus:ring-0 text-sm w-full"
          placeholder={placeholder}
        />
        <p className="text-sm font-medium text-yellow-600 text-center">
          {label}
        </p>
      </div>
    </div>
  );
};
