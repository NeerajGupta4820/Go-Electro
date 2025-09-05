import "./Footer.css";
import logo from "../../assets/Images/Logo/Logo.webp";
import { FaRegEnvelope, FaArrowRight,FaFacebookF, FaTwitter,FaWhatsapp,FaPinterestP } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="f-row">
        <div className="f-col">
          <img src={logo} alt="logo" className="f-logo" />
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci
            veniam numquam maxime inventore sunt tempora quaerat aut temporibus
          </p>
        </div>
        <div className="f-col">
          <h3>Office
            <div className="underline">
              <span></span>
            </div>
          </h3>
          <p>MDU Rohtak 124001, Haryana India</p>
          <p className="email-id">goelectro@gmail.com</p>
          <h4>+91-9999999999</h4>
        </div>
        <div className="f-col">
          <h3>Links<div className="underline">
              <span></span>
            </div></h3>
          <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="f-col">
          <h3>NewsLetter<div className="underline">
              <span></span>
            </div></h3>
          <form action="">
          <FaRegEnvelope />
            <input type="email" placeholder="Enter your Email" />
            <button type="submit"><FaArrowRight/></button>
          </form>
          <div className="social-icon">
            <FaFacebookF/>
            <FaTwitter/>
            <FaWhatsapp/>
            <FaPinterestP/>
          </div>
        </div>
      </div>
      <hr />
      <p>Developed by <b>Neeraj</b></p>
    </footer>
  );
};

export default Footer;
