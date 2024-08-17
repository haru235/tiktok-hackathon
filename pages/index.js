import { useState } from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



// Sample content data for the cards
const suggestedContent = [
  {
    title: "Content 1",
    description: "Description for content 1",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    title: "Content 2",
    description: "Description for content 2",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    title: "Content 3",
    description: "Description for content 3",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    title: "Content 4",
    description: "Description for content 4",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    title: "Content 5",
    description: "Description for content 5",
    imageUrl: "https://via.placeholder.com/150",
  }
];


const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,  // Show 4 slides at a time
  slidesToScroll: 1,  // Scroll one slide at a time
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
      }
    }
  ]
};


export default function Home() {


  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState(suggestedContent);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Content submitted:', content);
    setContent('');
  };



  return (
    <>
    <div className="bg-customBeige">
      <Header />
      
      {/* hero */}
      <section className="flex flex-col justify-center items-center py-40 p-6 rounded-lg">
        <h2 className=" text-center text-5xl mb-5 font-semibold text-gray-800">
          TikTok Shop Hackathon Project
        </h2>
        <p className="text-center px-20 text-gray-700 mb-5">
          This project is built as part of the TikTok Shop Hackathon, aimed at developing innovative solutions for content e-commerce.
          The goal is to create a web application that allows users to submit and manage text-based content, with features such as notifications and content recommendations.
        </p>
        {/*<a className="px-40 text-center text-white  font-medium py-3 rounded cursor-pointer bg-customRed hover:bg-customBrighterRed">
                Join now
        </a>*/}
      </section>

      {/* suggested content */}
      <section className="mt-10 p-6 py-20 bg-white rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Suggested Content</h2>
        <Slider {...sliderSettings}>
          {suggestedContent.map((content, index) => (
            <div key={index}>
              <Card
                title={content.title}
                description={content.description}
                imageUrl={content.imageUrl}
              />
            </div>
          ))}
        </Slider>
      </section>


      {/* submit content */}
      <section className="mt-10 p-6 bg-white rounded-lg max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800">Submit Your Content</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter the title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customTeal focus:border-transparent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Enter the description"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customTeal focus:border-transparent"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-gray-700 font-medium mb-2">Image URL</label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="text"
              placeholder="Enter the image URL"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customTeal focus:border-transparent"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-customRed text-white font-semibold rounded-lg hover:bg-customBrighterRed focus:outline-none focus:ring-2 focus:ring-customRed focus:ring-opacity-50"
          >
            Submit
          </button>
        </form>
      </section>
      </div>
    </>
  );
}
