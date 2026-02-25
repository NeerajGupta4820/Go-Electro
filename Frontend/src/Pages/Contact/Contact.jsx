import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { MdEmail, MdPhone, MdWeb, MdLocationOn, MdAccessTime } from "react-icons/md";
import { SiGmail } from "react-icons/si";
import contact_7 from "../../assets/Images/contact/contact_7.png";

const contactInfoList = [
  {
    icon: <MdEmail className="h-6 w-6 text-teal-600" />,
    label: "email@GoElectro.com",
    href: "mailto:email@GoElectro.com",
  },
  {
    icon: <MdPhone className="h-6 w-6 text-teal-600" />,
    label: "+880 1742-0****0",
    href: "callto:+880 1742-0****0",
  },
  {
    icon: <MdWeb className="h-6 w-6 text-teal-600" />,
    label: "GoElectro.com",
    href: "https://goElectro.com",
  },
];

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity()) {
      toast.success("Message sent successfully!", {
        className: "bg-green-500 text-white p-4 rounded-lg",
        progressClassName: "bg-white",
      });
      setFormData({ name: "", email: "", message: "" });
    } else {
      toast.error("Please fill out all required fields.", {
        className: "bg-red-500 text-white p-4 rounded-lg",
        progressClassName: "bg-white",
      });
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-teal-600">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter Name"
          required
          className="border-teal-500 focus:ring-teal-500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-teal-600">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter Email"
          required
          className="border-teal-500 focus:ring-teal-500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-teal-600">
          Message
        </Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Enter Message"
          rows={4}
          required
          className="border-teal-500 focus:ring-teal-500"
        />
      </div>
      <div className="text-start">
        <Button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white hover:scale-105 transition-all"
        >
          Send
        </Button>
      </div>
    </form>
  );
};

const ContactInfo = ({ contactInfoList }) => (
  <Card className="bg-white shadow-lg border-l-4 border-teal-500">
    <CardContent className="space-y-4 p-6">
      {contactInfoList.map((info, i) => (
        <div key={i} className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-blue-100">
            <AvatarFallback>{info.icon}</AvatarFallback>
          </Avatar>
          <a
            href={info.href || "#!"}
            className="text-teal-600 hover:text-teal-800 transition-colors"
          >
            {info.label}
          </a>
        </div>
      ))}
    </CardContent>
  </Card>
);

const ContactDetails = () => (
  <Card className="bg-white shadow-lg border-l-4 border-teal-500">
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-green-700 sm:text-xl">
        Get in Touch
      </CardTitle>
      <p className="text-teal-600">
        Visit one of our shop locations or contact us today
      </p>
    </CardHeader>
    <CardContent className="space-y-4">
      <h3 className="text-lg font-semibold text-green-700">Head Office</h3>
      <ul className="space-y-3">
        <li className="flex items-center gap-3">
          <Avatar className="h-8 w-8 bg-blue-100">
            <AvatarFallback>
              <MdLocationOn className="h-5 w-5 text-teal-600" />
            </AvatarFallback>
          </Avatar>
          <p className="text-teal-600">
            Maharshi Dayanand University, Rohtak, India
          </p>
        </li>
        <li className="flex items-center gap-3">
          <Avatar className="h-8 w-8 bg-blue-100">
            <AvatarFallback>
              <SiGmail className="h-5 w-5 text-red-500" />
            </AvatarFallback>
          </Avatar>
          <p className="text-teal-600">contact@example.com</p>
        </li>
        <li className="flex items-center gap-3">
          <Avatar className="h-8 w-8 bg-blue-100">
            <AvatarFallback>
              <MdPhone className="h-5 w-5 text-teal-600" />
            </AvatarFallback>
          </Avatar>
          <p className="text-teal-600">+01 2222 365 / (+91) 01 2345 6789</p>
        </li>
        <li className="flex items-center gap-3">
          <Avatar className="h-8 w-8 bg-blue-100">
            <AvatarFallback>
              <MdAccessTime className="h-5 w-5 text-teal-600" />
            </AvatarFallback>
          </Avatar>
          <p className="text-teal-600">Monday to Saturday: 9.00am to 5.00pm</p>
        </li>
      </ul>
    </CardContent>
  </Card>
);

const Contact = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 xs:px-4">
        <ToastContainer toastClassName="min-w-[300px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="contact-image relative">
            <Card className="bg-white shadow-lg border-l-4 border-teal-500">
              <CardContent className="p-0">
                <div
                  className="w-full h-64 bg-cover bg-center rounded-lg"
                  style={{ backgroundImage: `url(${contact_7})` }}
                ></div>
                <div className="p-6">
                  <ContactInfo contactInfoList={contactInfoList} />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="contact-form-container">
            <Card className="bg-white shadow-lg border-l-4 border-teal-500">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-green-700 sm:text-xl">
                  Leave a Message
                </CardTitle>
                <p className="text-teal-600">We love to hear from you</p>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
        <section className="contact-details mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ContactDetails />
            <div className="map">
              <Card className="bg-white shadow-lg border-l-4 border-teal-500">
                <CardContent className="p-0">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3477.485570264696!2d76.62067707422702!3d28.877017772781234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d84ddaef54325%3A0x5c86cf8f3f0e375d!2sMaharshi%20Dayanand%20University%2C%20Rohtak%2C%20Haryana%20124001!5e0!3m2!1sen!2sin!4v1690289945397!5m2!1sen!2sin"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Contact;