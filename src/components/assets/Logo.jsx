import logo from "./svg/logo.svg";
import logoText from "./svg/eccmon_text.svg";

export const Logo = () => {
  return (
    <div className="w-12 pb-6">
      <img src={logo} alt="logo" />
    </div>
  );
};

export const LogoText = () => {
  return (
    <div className="container w-5/12 p-2">
      <img src={logoText} alt="background" />
    </div>
  );
};
