import logo from "../../assets/Images/Logo/Logo.webp";
import {
  FaRegEnvelope,
  FaArrowRight,
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaPinterestP,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className="footer-curve" aria-hidden="true">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="footerCurveGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2b3746" stopOpacity="0.98" />
              <stop offset="60%" stopColor="#243141" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#1f2937" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 C150,90 320,110 480,90 C600,76 720,36 840,46 C980,58 1060,86 1200,20 L1200,120 L0,120 Z"
            fill="url(#footerCurveGrad)"
          />
        </svg>
      </div>

      <footer className="relative text-center text-[#e9eef5] overflow-visible">
        <div className="before:content-[''] before:absolute before:-top-[60px] before:left-0 before:right-0 before:h-[120px] before:bg-gradient-to-r before:from-[#2b3746] before:via-[#243141] before:to-[#1f2937] before:rounded-bl-[50%_40px] before:rounded-br-[50%_40px] before:-translate-y-[10%] before:shadow-[0_8px_12px_rgba(0,0,0,0.22)] before:z-[3] before:pointer-events-none">
          <div className="bg-[#1f2937] pt-[60px] pb-7 relative z-[1] -mt-[18px]">
            <div className="w-[88%] mx-auto mb-[18px] flex flex-wrap items-start justify-between gap-[18px] relative z-[2]">
              <div className="flex-1 min-w-[25%] p-[10px] text-[#d4d9df]">
                <Link to="/" className="flex items-center gap-2 shrink-0 group">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                    <span className="text-primary-foreground font-bold text-base lg:text-lg">
                      GE
                    </span>
                  </div>
                  <span className="hidden sm:block text-lg lg:text-xl font-bold text-white">
                    GoElectro
                  </span>
                </Link>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Adipisci veniam numquam maxime inventore sunt tempora quaerat
                  aut temporibus
                </p>
              </div>
              <div className="flex-1 min-w-[15%] p-[10px] text-[#d4d9df]">
                <h3 className="relative mb-[18px] text-[1.05rem] tracking-[0.2px] flex flex-col items-center justify-center text-[#f1f5f9]">
                  Office
                  <div className="underline absolute top-7 left-[36%] w-[28%] h-[6px] bg-[rgba(255,255,255,0.06)] rounded-[6px] overflow-hidden">
                    <span className="animate-moving absolute top-0 left-[10px] w-[18px] h-full bg-[#2563eb] rounded-[3px]"></span>
                  </div>
                </h3>
                <p>MDU Rohtak 124001, Haryana India</p>
                <p className="">goelectro@gmail.com</p>
                <h4>+91-9999999999</h4>
              </div>
              <div className="flex-1 min-w-[15%] p-[10px] text-[#d4d9df]">
                <h3 className="relative mb-[18px] text-[1.05rem] tracking-[0.2px] flex flex-col items-center justify-center text-[#f1f5f9]">
                  Links
                  <div className="underline absolute top-7 left-[36%] w-[28%] h-[6px] bg-[rgba(255,255,255,0.06)] rounded-[6px] overflow-hidden">
                    <span className="animate-moving absolute top-0 left-[10px] w-[18px] h-full bg-[#2563eb] rounded-[3px]"></span>
                  </div>
                </h3>
                <ul className="p-0">
                  <li className="mb-[10px]">
                    <Link
                      to="/"
                      className="text-[#cbd5e1] no-underline hover:text-white transition-colors duration-[0.18s]"
                    >
                      Home
                    </Link>
                  </li>
                  <li className="mb-[10px]">
                    <Link
                      to="/about"
                      className="text-[#cbd5e1] no-underline hover:text-white transition-colors duration-[0.18s]"
                    >
                      About
                    </Link>
                  </li>
                  <li className="mb-[10px]">
                    <Link
                      to="/contact"
                      className="text-[#cbd5e1] no-underline hover:text-white transition-colors duration-[0.18s]"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex-1 min-w-[25%] p-[10px] text-[#d4d9df]">
                <h3 className="relative mb-[18px] text-[1.05rem] tracking-[0.2px] flex flex-col items-center justify-center text-[#f1f5f9]">
                  NewsLetter
                  <div className="underline absolute top-7 left-[36%] w-[28%] h-[6px] bg-[rgba(255,255,255,0.06)] rounded-[6px] overflow-hidden">
                    <span className="animate-moving absolute top-0 left-[10px] w-[18px] h-full bg-[#2563eb] rounded-[3px]"></span>
                  </div>
                </h3>
                <form className="pb-2 flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] mb-[18px]">
                  <FaRegEnvelope className="text-[18px] mr-2 text-[#cbd5e1]" />
                  <input
                    type="email"
                    placeholder="Enter your Email"
                    className="w-full bg-transparent text-[#cbd5e1] border-0 outline-none py-[6px]"
                  />
                  <button
                    type="submit"
                    className="bg-[#2563eb] border-0 text-white text-sm py-2 px-[10px] rounded-[6px] cursor-pointer"
                  >
                    <FaArrowRight />
                  </button>
                </form>
                <div className="social-icon flex">
                  <FaFacebookF className="w-[34px] h-[34px] rounded-full text-center leading-[34px] text-sm text-[#111827] bg-white mr-3 p-[6px] cursor-pointer hover:-translate-y-[3px] transition-transform duration-[0.12s]" />
                  <FaTwitter className="w-[34px] h-[34px] rounded-full text-center leading-[34px] text-sm text-[#111827] bg-white mr-3 p-[6px] cursor-pointer hover:-translate-y-[3px] transition-transform duration-[0.12s]" />
                  <FaWhatsapp className="w-[34px] h-[34px] rounded-full text-center leading-[34px] text-sm text-[#111827] bg-white mr-3 p-[6px] cursor-pointer hover:-translate-y-[3px] transition-transform duration-[0.12s]" />
                  <FaPinterestP className="w-[34px] h-[34px] rounded-full text-center leading-[34px] text-sm text-[#111827] bg-white mr-3 p-[6px] cursor-pointer hover:-translate-y-[3px] transition-transform duration-[0.12s]" />
                </div>
              </div>
            </div>
            <hr className="w-[92%] mx-auto border-0 border-b border-[rgba(255,255,255,0.06)] my-[18px]" />
            <p className="text-center text-[#cbd5e1] mt-2">
              Developed by <b className="text-white">Pankaj</b>
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes moving {
          0% {
            left: -20px;
          }
          100% {
            left: 100%;
          }
        }
        .animate-moving {
          animation: moving 2s linear infinite;
        }
      `}</style>
    </>
  );
};

export default Footer;
