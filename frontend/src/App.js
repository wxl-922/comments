import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from "react";

function App() {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    const listComments = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/comments");
        const jsonRes = await res.json();
        const data = jsonRes.data;
        setComments(data);
      } catch (err) {
        console.error(err);
      }
    }
    listComments();
  }, [])

  return (
    <div className="App">
      <ul>
        {comments.map(comment =>
          <li key={comment.id}>
            <p>
              <b>{comment.author} </b>
              <span style={{ color: "gray" }}>{comment.date} </span>
              <span style={{ color: "red" }}>❤️{comment.likes}</span>
            </p>
            <p>{comment.text}</p>
            {comment.image && (
              <img
                src={comment.image}
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              />
            )}
            <hr/>
          </li>
        )}
      </ul>
    </div>
  );
}

export default App;
