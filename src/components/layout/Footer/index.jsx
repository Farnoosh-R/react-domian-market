import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="absolute bottom-0 right-0 left-0 w-full h-[50px] flex gap-2 justify-center py-4 z-10 bg-transparent">
      <Link to="https://domigo.ir" className="hover:text-blue-500 cursor-pointer">Domigo.ir</Link>
      <div>Powered by</div>
    </div>
  );
};
export default Footer;
