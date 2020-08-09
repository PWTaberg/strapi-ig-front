import React, { useState } from 'react';

export default () => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  console.log('File: ', file);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description) {
      setError('Please add a description');
      return;
    }
    if (!file) {
      setError('Please add an image');
      return;
    }
    const formData = new FormData();
    formData.append('data', JSON.stringify({ description }));
    formData.append('files.image', file);

    try {
      const response = await fetch('http://localhost:1337/posts', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
    } catch (err) {
      console.log('Error: ', err.message);
      setError(err);
    }
  };
  return (
    <div className='Create'>
      <h2>Create</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder='Description'
          value={description}
          onChange={(e) => {
            setError('');
            setDescription(e.target.value);
          }}
        />
        <input
          type='file'
          placeHolder='Add a File'
          onChange={(e) => {
            setError('');
            setFile(e.target.files[0]);
          }}
        />
        <button>Submit</button>
      </form>
    </div>
  );
};
