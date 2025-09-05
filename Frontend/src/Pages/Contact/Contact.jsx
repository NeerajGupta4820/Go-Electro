import contact_7 from "../../assets/Images/contact/contact_7.png";
import PropTypes from "prop-types";
import { MdEmail, MdPhone, MdWeb } from "react-icons/md";
import { MdLocationOn, MdAccessTime } from "react-icons/md";
import { SiGmail } from "react-icons/si";
import classNames from "classnames";
import "./Contact.css";

const contactInfoList = [
  {
    icon: <MdEmail />,
    label: "email@GoElectro.com",
    href: "mailto:email@GoElectro.com",
  },
  {
    icon: <MdPhone />,
    label: "+880 1742-0****0",
    href: "callto:+880 1742-0****0",
  },
  { icon: <MdWeb />, label: "GoElectro.com", href: "https://goElectro.com" },
];

const ContactForm = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <form className="contact-form" noValidate onSubmit={handleSubmit}>
      <div className="mb-4">
        <input
          type="text"
          name="name"
          className="form-input"
          placeholder="Enter Name"
          required
        />
      </div>
      <div className="mb-4">
        <input
          type="email"
          name="email"
          className="form-input"
          placeholder="Enter Email"
          required
        />
      </div>
      <div className="mb-4">
        <textarea
          name="message"
          className="form-input"
          placeholder="Enter Message"
          rows="4"
          required
        ></textarea>
      </div>
      <div className="text-start">
        <button type="submit" className="submit-button">
          send
        </button>
      </div>
    </form>
  );
};

const ContactFormCard = () => (
  <div className="contact-form-card">
    <h2>Leave a message</h2>
    <span>We love to hear from you</span>
    <ContactForm />
  </div>
);

const ContactInfo = ({ contactInfoList }) => (
  <div className="contact-info">
    {contactInfoList.map((info, i) => (
      <div className={classNames("info-item", { "mt-6": i })} key={i}>
        {info.icon}
        <a className="info-link" href={info.href || "#!"}>
          {info.label}
        </a>
      </div>
    ))}
  </div>
);

ContactInfo.propTypes = {
  contactInfoList: PropTypes.array.isRequired,
};

const Contact = () => {
  return (
    <section className="contact-section">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-image">
            <div
              className="image-background"
              style={{
                backgroundImage: `url(${contact_7})`,
              }}
            >
              {/* <ContactInfo contactInfoList={contactInfoList} /> */}
            </div>
          </div>
          <div className="contact-form-container">
            <ContactFormCard />
          </div>
        </div>
      </div>
      <section className="contact-details">
        <div className="details">
          <span>Get in touch</span>
          <h2>Visit one of our shop locations or contact us today</h2>
          <h3>Head Office</h3>
          <div>
            <li>
              <MdLocationOn />
              <p>Maharshi Dayanand University, Rohtak, India</p>
            </li>
            <li>
              <SiGmail />
              <p>contact@example.com</p>
            </li>
            <li>
              <MdPhone />
              <p>+01 2222 365 / (+91) 01 2345 6789</p>
            </li>
            <li>
              <MdAccessTime />
              <p>Monday to Saturday: 9.00am to 5.00pm</p>
            </li>
          </div>
        </div>
        <div className="map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3477.485570264696!2d76.62067707422702!3d28.877017772781234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d84ddaef54325%3A0x5c86cf8f3f0e375d!2sMaharshi%20Dayanand%20University%2C%20Rohtak%2C%20Haryana%20124001!5e0!3m2!1sen!2sin!4v1690289945397!5m2!1sen!2sin"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </section>
  );
};

export default Contact;
