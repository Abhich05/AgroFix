import React, { useRef, useState } from 'react';
import './ImageGallery.css';

export default function ImageGallery() {
  const [images, setImages] = useState([
    // Demo: pre-populate with some sample images
    {
      url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
      uploader: 'Ravi',
      comments: ['Great crop!', 'Looking healthy!']
    },
    {
      url: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=400&q=80',
      uploader: 'Sunita',
      comments: ['What fertilizer did you use?', 'Superb!']
    }
  ]);
  const [comment, setComment] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(null);
  const fileInput = useRef();

  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImages([
        { url: ev.target.result, uploader: 'You', comments: [] },
        ...images
      ]);
    };
    reader.readAsDataURL(file);
  }

  function handleCommentSubmit(idx) {
    if (!comment.trim()) return;
    setImages(images => images.map((img, i) =>
      i === idx ? { ...img, comments: [...img.comments, comment] } : img
    ));
    setComment('');
    setSelectedIdx(null);
  }

  return (
    <section className="image-gallery">
      <h2 className="gallery-title">Community Gallery</h2>
      <div className="gallery-upload">
        <button className="gallery-upload-btn" onClick={() => fileInput.current.click()}>Upload Photo</button>
        <input type="file" accept="image/*" ref={fileInput} style={{ display: 'none' }} onChange={handleUpload} />
      </div>
      <div className="gallery-grid">
        {images.map((img, idx) => (
          <div className="gallery-card" key={idx}>
            <img src={img.url} alt="crop" className="gallery-img" />
            <div className="gallery-uploader">By: {img.uploader}</div>
            <div className="gallery-comments">
              <strong>Comments:</strong>
              <ul>
                {img.comments.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
              {selectedIdx === idx ? (
                <form onSubmit={e => { e.preventDefault(); handleCommentSubmit(idx); }}>
                  <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment" />
                  <button type="submit">Post</button>
                </form>
              ) : (
                <button className="gallery-comment-btn" onClick={() => setSelectedIdx(idx)}>Add Comment</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
