import PropTypes from "prop-types";
import { useState } from "react";
import img1 from "../../assets/Images/about/1.png";
import img2 from "../../assets/Images/about/2.jpg";
import img3 from "../../assets/Images/about/About Us.webp";
import img4 from "../../assets/Images/about/Conviennce.webp"
import img5 from "../../assets/Images/about/Execptional Service.webp";
import img6 from "../../assets/Images/about/Quality Assurance.webp";
import "./About.css";

const stories = [
  {
    title: "The journey to relaxation.",
    description:
      "Finding a hammock you can truly relax in didn’t happen overnight. It started with a chance discovery while on vacation, and took a lot of hard work (and a lot of hanging around) to bring the softest, most comfortable, and thoughtfully crafted hammocks to your backyard.",
    image: img1,
  },
  {
    title: "The way to heaven.",
    description:
      "More off this less hello salamander lied porpoise much over tightly circa horse taped so innocuously outside crud mightily rigorous negative one inside gorilla and drew humbly shot tortoise inside opaquely. Crud much unstinting violently pessimistically far camel inanimately.",
    image: img2,
  },
];

const StoryItem = ({ item, index }) => {
  const { title, description, image } = item;
  return (
    <>
      <div className={`column ${index % 2 === 0 ? "reverse-order" : ""}`}>
        <div className={`story-text ${index % 2 === 0 ? "padding-left" : "padding-right"}`}>
          <h4 className="story-title">{title}</h4>
          <p className="story-description">{description}</p>
        </div>
      </div>
      <div className={`column ${index % 2 === 0 ? "" : "reverse-order"}`}>
        <div className="story-image-wrapper">
          <img src={image} alt={title} className="story-image" />
        </div>
      </div>
    </>
  );
};

StoryItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

const About = () => {
  const [clickedDiv, setClickedDiv] = useState(null);

  const handleDivClick = (index) => {
    setClickedDiv(clickedDiv === index ? null : index);
  };

  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Us</h1>
        <hr />
      </div>
      <div className="about-content" >
        <img className="about-image" src={img3} alt="About Us" />
        <div className="about-text">
          <p style={{color: "grey"}}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo odit
            alias tenetur, quidem dolorem sit commodi illum deserunt impedit, at
            ullam. Corrupti dolorum magni sapiente est dignissimos fugit quos
            rerum.
          </p>
          <p style={{color: "grey"}}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod at
            voluptas facilis est unde magnam vero odit! Doloribus, nihil dolor,
            nemo numquam harum cum, laboriosam dolores quisquam sint libero
            delectus.
          </p>
          <b className="mission-title">Our Mission</b>
          <p style={{color: "grey"}}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti,
            magni quibusdam ea voluptas iste voluptates illo quo distinctio
            facilis alias officiis at inventore sequi similique aut accusantium
            ex suscipit animi.
          </p>
        </div>
      </div>

      <div className="why-choose-us">
        <h2>Why Choose Us</h2>
      </div>

      <div className="why-content">
        {[
          {
            title: "Quality Assurance:",
            image: img4,
            description:
              " Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, iste voluptates illo quo distinctio facilis alias officiis at inventore sequi similique aut accusantium ex suscipit animi.",
          },
          {
            title: "Convenience:",
            image: img5,
            description:
              "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, iste voluptates illo quo distinctio facilis alias officiis at inventore sequi similique aut accusantium ex suscipit animi.",
          },
          {
            title: "Exceptional Service:",
            image: img6,
            description:
              " Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, iste voluptates illo quo distinctio facilis alias officiis at inventore sequi similique aut accusantium ex suscipit animi.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="why-item"
            onClick={() => handleDivClick(index)}
          >
            {clickedDiv === index ? (
              <p className="why-description">{item.description}</p>
            ) : (
              <>
                <img className="why-icon" src={item.image} alt={item.title} />
                <h3 className="why-title">{item.title}</h3>
              </>
            )}
          </div>
        ))}
      </div>

      <section className="story-section">
        <div className="story-container">
          <h2 className="section-title">Our Story</h2>
          <p className="section-description" style={{color: "grey"}}>
            We not only make the world’s most comfortable hammocks, but
            through training and sustainable job creation, we empower our
            weavers and their families to break the cycle of poverty and build
            a brighter future.
          </p>

          {stories.map((item, i) => (
            <div className="story-row" key={i}>
              <StoryItem item={item} index={i} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
