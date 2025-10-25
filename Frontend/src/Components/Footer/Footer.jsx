import "./Footer.css";
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
          {/* pronounced wave / water-drop like curve with subtle gradient */}
          <path
            d="M0,0 C150,90 320,110 480,90 C600,76 720,36 840,46 C980,58 1060,86 1200,20 L1200,120 L0,120 Z"
            fill="url(#footerCurveGrad)"
          />
        </svg>
      </div>

      <footer className="footer">
        {/* Decorative curved top */}
        <div className="footer-inner">
          <div className="f-row">
            <div className="f-col">
              <img src={logo} alt="logo" className="f-logo" />
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Adipisci veniam numquam maxime inventore sunt tempora quaerat
                aut temporibus
              </p>
            </div>
            <div className="f-col">
              <h3>
                Office
                <div className="underline">
                  <span></span>
                </div>
              </h3>
              <p>MDU Rohtak 124001, Haryana India</p>
              <p className="email-id">goelectro@gmail.com</p>
              <h4>+91-9999999999</h4>
            </div>
            <div className="f-col">
              <h3>
                Links
                <div className="underline">
                  <span></span>
                </div>
              </h3>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div className="f-col">
              <h3>
                NewsLetter
                <div className="underline">
                  <span></span>
                </div>
              </h3>
              <form action="">
                <FaRegEnvelope />
                <input type="email" placeholder="Enter your Email" />
                <button type="submit">
                  <FaArrowRight />
                </button>
              </form>
              <div className="social-icon">
                <FaFacebookF />
                <FaTwitter />
                <FaWhatsapp />
                <FaPinterestP />
              </div>
            </div>
          </div>
          <hr />
          <p className="footer-credit">
            Developed by <b>Neeraj</b>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
