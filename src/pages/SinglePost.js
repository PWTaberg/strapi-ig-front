import React, { useState, useEffect, useContext } from 'react';
import Post from '../components/Post';

import { UserContext } from '../context/UserContext';
import { LikesContext } from '../context/LikesContext';

export default ({ match, history }) => {
  const { id } = match.params;

  const { user, setUser } = useContext(UserContext);
  console.log('user: ', user);
  console.log('setUser: ', setUser);

  const { likesGiven, reloader } = useContext(LikesContext);

  const isPostAlreadyLiked = (() => {
    return (
      likesGiven && likesGiven.find((like) => like.post && like.post.id == id)
    );
  })();

  console.log('isPostAlreadyLiked', isPostAlreadyLiked);

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
    console.log('user ', user);
    try {
      const response = await fetch(`http://localhost:1337/posts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
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
    console.log('user ', user);

    try {
      const response = await fetch(`http://localhost:1337/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        headers: {
          Authorization: `Bearer ${user.jwt}`,
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

  const handleLike = async () => {
    try {
      const response = await fetch('http://localhost:1337/likes', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post: parseInt(id),
        }),
      });
      fetchPost();
      reloader();
    } catch (err) {
      console.log('Exception', err);
    }
  };

  const handleRemoveLike = async () => {
    try {
      const response = await fetch(`http://localhost:1337/likes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      });
      fetchPost();
      reloader();
    } catch (err) {
      console.log('Exception', err);
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

              {user && (
                <>
                  {isPostAlreadyLiked && (
                    <button onClick={handleRemoveLike}>Remove Like</button>
                  )}

                  {!isPostAlreadyLiked && (
                    <button onClick={handleLike}>Like</button>
                  )}
                </>
              )}

              {user && (
                <>
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
            </>
          )}
          {!post.id && <p>Not found - Something went wrong</p>}
          {error && <p>Error - Something went wrong</p>}
        </>
      )}
    </div>
  );
};
