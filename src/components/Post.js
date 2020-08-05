import React from 'react';

const post = {
  id: 1,
  description: 'Hunnebo trip 2019',
  likes: 9,
  author: null,
  created_by: {
    id: 1,
    firstname: 'Peter',
    lastname: 'Welliver',
    username: null,
  },
  updated_by: {
    id: 1,
    firstname: 'Peter',
    lastname: 'Welliver',
    username: null,
  },
  created_at: '2020-08-05T09:00:04.051Z',
  updated_at: '2020-08-05T09:00:04.151Z',
  image: [
    {
      url: '/uploads/IMG_0166_3143f4b1d8.JPG',
    },
  ],
};

const API_URL = 'http://localhost:1337';

const formatImageUrl = (url) => `${API_URL}${url}`;

export default ({ description, likes, url }) => {
  return (
    <div className='Post'>
      <img className='Post__Image' src={formatImageUrl(url)} alt='' />
      <h4>{description}</h4>
      <div>
        <span>Likes: {likes}</span>
      </div>
    </div>
  );
};
