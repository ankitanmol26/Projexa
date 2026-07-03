export default function Button({
  variant = "primary",
  className = "",
  children,
  type = "button",
  ...props
}) {
  const variants = {
    primary: "primary-button",
    secondary: "secondary-button",
    ghost:
      "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition hover:opacity-80",
  };

  return (
    <button
      type={type}
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}