import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './components/Post';

const mockPosts = [
  {
    likes: 20,
    description: 'This is a post',
    image: [
      {
        url: '/uploads/IMG_0166_3143f4b1d8.JPG',
      },
    ],
  },
  {
    likes: 33,
    description: 'This is another post',
    image: [
      {
        url: '/uploads/IMG_0166_3143f4b1d8.JPG',
      },
    ],
  },
];

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch('http://localhost:1337/posts');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.log(`Error: ${err.message}`);
      }
    };
    getPosts();
  }, []);

  return (
    <div className='App'>
      {posts.map((post) => (
        <Post
          likes={post.likes}
          description={post.description}
          url={post.image[0] && post.image[0].url}
        />
      ))}
    </div>
  );
}

export default App;
