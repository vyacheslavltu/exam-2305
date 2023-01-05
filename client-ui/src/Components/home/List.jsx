import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import Home from "../../Contexts/Home";
import Line from "./Line";

const List = () => {
  const [cityId, setCityId] = useState(0);
  const [eventId, setEventId] = useState(0);

  const {
    comments,
    setComments,
    cities,
    events,
    filterOn,
    filterWhat,
  } = useContext(Home);

  useEffect(() => {
    setComments((prevCom) =>
      prevCom?.map((c) =>
        (Number(c.sid) === Number(eventId) || Number(eventId) === 0) &&
        (Number(c.mid) === Number(cityId) ||
          Number(cityId) === 0)
          ? { ...c, show: true }
          : { ...c, show: false }
      )
    );
  }, [eventId, cityId, setComments]);

  const resetFilter = () => {
    setCityId("");
    setEventId("");
    setComments((prevCom) => prevCom.map((c) => ({ ...c, show: true })));
    filterOn.current = false;
    filterWhat.current = null;
  };

  return (
    <>
      <div className="card m-4">
        <h5 className="card-header">Filter Comments</h5>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">By city</label>
            <select
              className="form-select"
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
            >
              <option value={0}>All cities</option>
              {cities?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">By a type of event</label>
            <select
              className="form-select"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
            >
              <option value={0}>All events</option>
              {events?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="card m-4">
        <h5 className="card-header">Comments List:</h5>
        <button
          onClick={resetFilter}
          type="button"
          className="mx-auto btn btn-outline-success"
        >
          Show all comments
        </button>
        <div className="card-body">
          <ul className="list-group">
            {comments?.map((c) =>
              c.show ? <Line key={c.id} comment={c} /> : null
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default List;
