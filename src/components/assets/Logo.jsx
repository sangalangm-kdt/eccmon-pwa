import logo from "./svg/logo.svg";
import logoText from "./svg/logotext_revised3.svg";

export const Logo = () => {
  return (
    <div className="mr-4">
      <img src={logo} alt="logo" />
    </div>
  );
};

export const LogoText = () => {
  return (
    <div className="w-50">
      <img src={logoText} alt="background" />
    </div>
  );
};
