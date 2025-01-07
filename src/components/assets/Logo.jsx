import logo from "./svg/logo.svg";
import logoText from "./svg/logotext_revised3.svg";

export const Logo = () => {
  return (
    <div className="mr-4 xs:hidden">
      <img src={logo} alt="logo" width={100} height={100} />
    </div>
  );
};

export const LogoText = () => {
  return (
    <div className="w-[180px]">
      <img src={logoText} alt="background" width={200} height={200} />
    </div>
  );
};
