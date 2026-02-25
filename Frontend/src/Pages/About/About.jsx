import PropTypes from "prop-types";
import { useState } from "react";
import img1 from "../../assets/Images/about/1.png";
import img2 from "../../assets/Images/about/2.jpg";
import img3 from "../../assets/Images/about/About Us.webp";
import img4 from "../../assets/Images/about/Conviennce.webp"
import img5 from "../../assets/Images/about/Execptional Service.webp";
import img6 from "../../assets/Images/about/Quality Assurance.webp";
import { Card } from "@/Components/ui/card";

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
    <Card className="p-6 mb-6">
      <div className={`flex flex-col md:flex-row items-center gap-6 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
        <div className="md:w-1/2">
          <h4 className="text-2xl font-semibold text-foreground mb-3">{title}</h4>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img src={image} alt={title} className="w-full max-w-sm rounded-lg shadow-md" />
        </div>
      </div>
    </Card>
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
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground">About Us</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo odit alias tenetur, quidem dolorem sit commodi illum deserunt impedit, at ullam. Corrupti dolorum magni sapiente est dignissimos fugit quos rerum.
        </p>
      </header>

      <Card className="flex flex-col md:flex-row items-center gap-6 p-6 mb-8">
        <img src={img3} alt="About Us" className="w-full md:w-1/2 rounded-lg shadow-md" />
        <div className="md:w-1/2">
          <p className="text-muted-foreground">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod at voluptas facilis est unde magnam vero odit! Doloribus, nihil dolor, nemo numquam harum cum, laboriosam dolores quisquam sint libero delectus.</p>
          <p className="mt-4 text-muted-foreground">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, magni quibusdam ea voluptas iste voluptates illo quo distinctio facilis alias officiis at inventore sequi similique aut accusantium ex suscipit animi.</p>

          <h3 className="mt-6 text-lg font-semibold text-foreground">Our Mission</h3>
          <p className="text-muted-foreground mt-2">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, magni quibusdam ea voluptas iste voluptates illo quo distinctio facilis alias officiis at inventore sequi similique aut accusantium ex suscipit animi.</p>
        </div>
      </Card>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Why Choose Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "Quality Assurance",
              image: img4,
              description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, iste voluptates illo quo distinctio facilis alias officiis at inventore sequi similique aut accusantium ex suscipit animi.",
            },
            {
              title: "Convenience",
              image: img5,
              description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, iste voluptates illo quo distinctio facilis alias officiis at inventore sequi similique aut accusantium ex suscipit animi.",
            },
            {
              title: "Exceptional Service",
              image: img6,
              description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, iste voluptates illo quo distinctio facilis alias officiis at inventore sequi similique aut accusantium ex suscipit animi.",
            },
          ].map((item, index) => (
            <Card key={index} onClick={() => handleDivClick(index)} className="p-6 cursor-pointer hover:shadow-lg">
              {clickedDiv === index ? (
                <p className="text-muted-foreground">{item.description}</p>
              ) : (
                <div className="flex flex-col items-center text-center gap-4">
                  <img src={item.image} alt={item.title} className="w-16 h-16 object-contain" />
                  <h3 className="text-lg font-medium text-foreground">{item.title}</h3>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <p className="text-muted-foreground mb-6">We not only make the world’s most comfortable hammocks, but through training and sustainable job creation, we empower our weavers and their families to break the cycle of poverty and build a brighter future.</p>

        <div className="space-y-6">
          {stories.map((item, i) => (
            <StoryItem item={item} index={i} key={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
