import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useRef } from "react";

function App() {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const imgRef = useRef(null);

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingImage, setEditingImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  const [dropDown, setDropDown] = useState(false);
  const [sortOrder, setSortOrder] = useState(() => {
    return localStorage.getItem("sortOrder") || "id desc";
  });

  useEffect(() => {
    listComments();
  }, []);

  useEffect(() => {
    sortComments(null);
  }, [sortOrder]);

  const listComments = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/comments");
      const jsonRes = await res.json();
      const data = jsonRes.data;
      sortComments(data);
      } catch (err) {
        console.error(err);
      }
  }

  const sortComments = (data) => {
    const sortedComments = data === null ? [...comments] : [...data];
    if (sortOrder === "id asc") sortedComments.sort((a, b) => a.id - b.id);
    else if (sortOrder === "id desc") sortedComments.sort((a, b) => b.id - a.id);
    else if (sortOrder === "date asc") sortedComments.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sortOrder === "date desc") sortedComments.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortOrder === "likes asc") sortedComments.sort((a, b) => a.likes - b.likes);
    else if (sortOrder === "likes desc") sortedComments.sort((a, b) => b.likes - a.likes);
    localStorage.setItem("sortOrder", sortOrder);
    setComments(sortedComments);
  }

  const postComment = async () => {
    try {
      const formData = new FormData();
      formData.append("text", text);
      if (image) {
        formData.append("image", image);
      }
      const res = await fetch("http://127.0.0.1:5000/comments", {
        method: "POST",
        body: formData,
      });
      const jsonRes = await res.json();
      alert(jsonRes.message);
      setText("");
      setImage(null);
      imgRef.current.value = "";
      listComments();
    } catch (err) {
      console.error(err);
    }
  }

  const deleteComment = async (id) => {
    const ok = window.confirm("Delete?");
    if (!ok) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/comments/${id}`, {
        method: "DELETE"
      });
      const jsonRes = await res.json();
      alert(jsonRes.message);
      listComments();
    } catch (err) {
      console.error(err);
    }
  }

  const updateComment = async (id) => {
    try {
      const formData = new FormData;
      formData.append("text", editingText);
      if (removeImage) {
        formData.append("remove", "true");
      }
      if (editingImage) {
        formData.append("image", editingImage);
      }
      const res = await fetch(`http://127.0.0.1:5000/comments/${id}`, {
        method: "PATCH",
        body: formData,
      });
      const jsonRes = await res.json();
      alert(jsonRes.message);
      setEditingId(null);
      setRemoveImage(false);
      listComments();
    } catch (err) {
      console.error(err);
    }
  }

  const getImageSrc = (image) =>
    image.startsWith("http") ? image : `http://127.0.0.1:5000${image}`;

  return (
    <div className="App">
      <div style={{ padding: "16px" }}>
        <textarea
          className="comment-input"
          value={text}
          placeholder="Write a comment."
          onChange={(e) => setText(e.target.value)}>
        </textarea>
        <div>
          <input
            type="file"
            ref={imgRef}
            onChange={(e) => setImage(e.target.files[0])}>
          </input>
          <button onClick={postComment}>Post</button>
        </div>
      </div>
      <div className={"dropdown-outer"}>
        <button className={"dropdown-btn"} onClick={(e) => setDropDown(!dropDown)}>Sort By</button>
        {dropDown && (
          <div className={"dropdown-inner"}>
            <button className={"dropdown-btn"} onClick={(e) => setSortOrder("id desc")}>ID Desc</button><br/>
            <button className={"dropdown-btn"} onClick={(e) => setSortOrder("id asc")}>ID Asc</button><br/>
            <button className={"dropdown-btn"} onClick={(e) => setSortOrder("date desc")}>Newest</button><br/>
            <button className={"dropdown-btn"} onClick={(e) => setSortOrder("date asc")}>Oldest</button><br/>
            <button className={"dropdown-btn"} onClick={(e) => setSortOrder("likes desc")}>Most Liked</button><br/>
            <button className={"dropdown-btn"} onClick={(e) => setSortOrder("likes asc")}>Least Liked</button>
          </div>
        )}
      </div>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {editingId === comment.id ? (
              <>
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                {comment.image && !removeImage && (
                  <>
                    <img
                      src={getImageSrc(comment.image)}
                      style={{ maxWidth: "100px", maxHeight: "100px" }}
                    />
                    <button onClick={() => setRemoveImage(true)}>
                      Remove Image
                    </button>
                  </>
                )}
                <input
                  type="file"
                  onChange={(e) => setEditingImage(e.target.files[0])}
                />
                <div>
                  <button onClick={() => updateComment(comment.id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p>
                  <b>{comment.author} </b>
                  <span style={{ color: "gray" }}>
                    {new Date(comment.date).toLocaleString()}
                  </span>
                  <span style={{ color: "red" }}>❤️{comment.likes}</span>
                </p>
                <p>{comment.text}</p>
                {comment.image && (
                  <img
                    src={getImageSrc(comment.image)}
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                )}
                <div>
                  <button
                    onClick={() => {
                      setEditingId(comment.id);
                      setEditingText(comment.text);
                      setEditingImage(null);
                      setRemoveImage(false);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteComment(comment.id)}>Delete</button>
                </div>
              </>
            )}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
