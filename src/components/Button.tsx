import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation

type ButtonProps = {
  type: "button" | "submit";
  title: string;
  icon?: string;
  variant: "btn_dark_green";
  onClick?: () => void;
};

const Button = ({ type, title, icon, variant, onClick }: ButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior: redirect to /sign-in
      router.push("/sign-in");
    }
  };

  return (
    <button
      className={`flex items-center justify-center gap-3 rounded-full border ${variant}`}
      type={type}
      onClick={handleClick} // Attach handleClick to onClick event
    >
      {icon && <Image src={icon} alt={title} width={24} height={24} />}
      <label className="bold-16 whitespace-nowrap">{title}</label>
    </button>
  );
};

export default Button;
