import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from "react";

function App() {
  const [comments, setComments] = useState([]);
  const [dropDown, setDropDown] = useState(false);
  const [sortOrder, setSortOrder] = useState(() => {
    return localStorage.getItem("sortOrder") || "id asc";
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
    localStorage.setItem("sortOrder", sortOrder);
    setComments(sortedComments);
  }

  return (
    <div className="App">
      <div className={"dropdown-outer"}>
        <button className={"dropdown-btn"} onClick={(e) => setDropDown(!dropDown)}>Sort By</button>
        {dropDown && (
          <div className={"dropdown-inner"}>
            <button className={"dropdown-btn"} onClick={(e) => setSortOrder("id asc")}>ID Asc</button><br/>
            <button className={"dropdown-btn"} onClick={(e) => setSortOrder("id desc")}>ID Desc</button><br/>
            <button className={"dropdown-btn"} onClick={(e) => setSortOrder("date asc")}>Oldest</button><br/>
            <button className={"dropdown-btn"} onClick={(e) => setSortOrder("date desc")}>Newest</button>
          </div>
        )}
      </div>
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
