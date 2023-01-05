import React, { useContext, useState } from "react";
import Home from "../../Contexts/Home";
import DataContext from "../../Contexts/DataContext";

const Create = () => {
  const [city, setCity] = useState(0);
  const [event, setEvent] = useState(0);
  const [post, setPost] = useState("");

  const { setCreateData, cities, events } = useContext(Home);
  const { makeMsg } = useContext(DataContext);

  const addComment = () => {
    if (city === 0) {
      makeMsg("Please choose a city.");
      return;
    }
    if (event === 0) {
      makeMsg("Please choose a event.");
      return;
    }
    if (post.length === 0) {
      makeMsg("You haven't posted anything.");
      return;
    }
    setCreateData({
      mun_id: city,
      service_id: event,
      post,
    });
    setCity("");
    setEvent("");
    setPost("");
  };

  return (
    <div className="card m-4">
      <h5 className="card-header">Add a comment</h5>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">city</label>
          <select
            className="form-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value={0} disabled>
              Choose from list
            </option>

            {cities?.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">event</label>
          <select
            className="form-select"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
          >
            <option value={0} disabled>
              Choose from list
            </option>

            {events?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Comment</label>
          <input
            type="text"
            className="form-control"
            value={post}
            onChange={(e) => setPost(e.target.value)}
          />
        </div>
        <button
          onClick={addComment}
          type="button"
          className="btn btn-outline-success"
        >
          Add comment
        </button>
      </div>
    </div>
  );
};

export default Create;
