"use client"
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "../components/Footer";
import Cookies from 'js-cookie';


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

const getBackendUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!url) {
    console.warn('NEXT_PUBLIC_BACKEND_URL is not set. Falling back to http://localhost:8080');
    return 'http://localhost:8080';
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    console.warn(`Invalid NEXT_PUBLIC_BACKEND_URL: ${url}. It must start with http:// or https://`);
    return 'http://localhost:8080';
  }
  return url;
};

export default function Home() {

  // State to control alert visibility
  const [showAlert, setShowAlert] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState('');

  // get user from cookie
  var user_cookie = Cookies.get('user');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState(suggestedContent);

  useEffect(() => {
    // Fetch initial contents
    async function fetchData() {
      const res = await fetch(getBackendUrl());
      const data = await res.json();
      setContent(data);
    }

    fetchData();

    // Set up WebSocket connection
    const socket = new WebSocket(`wss://${getBackendUrl().split("//")[1]}/ws`);

    socket.onmessage = (event) => {
      const newContent = JSON.parse(event.data);
      setNotificationMessage(`New post added! "${JSON.parse(event.data).title}"`);
      setShowAlert(true);
      setContent((prevContents) => [newContent, ...prevContents]);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup on component unmount
    return () => {
      socket.close();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Content submitted:', title, description, imageUrl);
    const backendUrl = getBackendUrl();
    console.log(`Using backend URL: ${backendUrl}`);
    fetch(`${backendUrl}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, imageUrl })
    }).then(response => {
      if (response.ok) {
        console.log('Content submitted successfully');
        setTitle('');
        setDescription('');
        setImageUrl('');
      }
      else {
        console.error('Error submitting content');
      }
    }).catch(error => {
      console.error('Error:', error);
    });
  };

  // parse the user_info cookie into a variable
  if (user_cookie) {
    var user_info = JSON.parse(user_cookie);
  } else {
    var user_info = {
      fname: "",
      lname: "",
      username: "",
    }
  }
  console.log(user_info);

  // Function to handle closing the notification
  const handleCloseNotification = () => {
    setShowAlert(false);
  };

  return (
    <>
      <div className="bg-customBeige">
        <Header />

        <div>
          {showAlert &&
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">New Content! </strong>
              <span className="block sm:inline">A user just uploaded.</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={handleCloseNotification}>
                <svg className="fill-current h-6 w-6 text-red-500 cursor-pointer" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <title>Close</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                </svg>
              </span>
            </div>
          }
        </div>

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
            {content.map((content, index) => (
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
        <section className="mt-10 mb-28 p-6 mt-28 bg-white rounded-lg max-w-lg mx-auto">
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
        <Footer />
      </div>
    </>
  );
}
