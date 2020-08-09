import React, { useState, useEffect, useContext } from 'react';
import Post from '../components/Post';

//import { UserContext } from '../context/UserContext';

export default ({ match, history }) => {
  const { id } = match.params;

  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  // Used for edit form
  const [description, setDescription] = useState('');

  const [error, setError] = useState(false);

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:1337/posts/${id}`);
      const data = await response.json();
      setPost(data);
      setLoading(false);
      setDescription(data.description);
      setError(false);
    } catch (err) {
      console.log(err.message);
      setLoading(false);
      setError(true);
    }
  };

  const handleDelete = async () => {
    console.log(`handle delete ${id}`);
    try {
      const response = await fetch(`http://localhost:1337/posts/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      history.push('/');
      console.log('Done');
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log('handleEditSubmit');
    try {
      const response = await fetch(`http://localhost:1337/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
        }),
      });
      const data = await response.json();
      fetchPost();
      console.log('Data: ', data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && (
        <>
          {post.id && (
            <>
              <Post
                likes={post.likes}
                description={post.description}
                url={post.image[0] && post.image[0].url}
              />
              <button onClick={handleDelete}>Delete this Post</button>
              <button onClick={() => setEdit(true)}>Edit this Post</button>
              {edit && (
                <form onSubmit={handleEditSubmit}>
                  <input
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    placeholder='New description'
                  />
                  <button>Confirm</button>
                </form>
              )}
            </>
          )}
          {!post.id && <p>Not found - Something went wrong</p>}
          {error && <p>Error - Something went wrong</p>}
        </>
      )}
    </div>
  );
};
