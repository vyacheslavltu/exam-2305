import { useContext } from 'react';
import Home from '../../Contexts/Home';


const Line = ({ comment }) => {
    const { filterWhat, filterOn, setComments } = useContext(Home);
  
    const filterByCity = () => {
      filterOn.current = !filterOn.current;
      if (!filterOn.current) {
        setComments((prevCom) => prevCom.map((c) => ({ ...c, show: true })));
        filterWhat.current = null;
      } else {
        setComments((prevCom) => [
          ...prevCom.map((c) =>
            c.cityTitle === comment.cityTitle
              ? { ...c, show: true }
              : { ...c, show: false }
          ),
        ]);
        filterWhat.current = comment.cityTitle;
      }
    };
  
    const filterByEvents = () => {
      if (!filterOn.current) {
        setComments((prevCom) => prevCom.map((c) => ({ ...c, show: true })));
        filterWhat.current = null;
      } else {
        setComments((prevCom) =>
          prevCom.map((c) =>
            c.eventTitle === comment.eventTitle
              ? { ...c, show: true }
              : { ...c, show: false }
          )
        );
        filterWhat.current = comment.eventTitle;
      }
      filterOn.current = !filterOn.current;
    };
  
    return (
      <li className="list-group-item">
        <div className="line">
          <div className="line__content">
            <div className="line__content__info">
              <div
                className="line__content__info"
                onClick={filterByCity}
              >
                <div className="img-bin">
                <img
                  className="line__content_info"
                  src={comment.cityImage}
                  alt={comment.cityTitle}
                ></img>
                </div>
                <div className="line__content__title">
                  {comment.cityTitle}
                </div>
              </div>
              <div
                className="line__content__info click-link"
                onClick={filterByEvents}
              >
                {comment.eventTitle}
              </div>
            </div>
            <div className="line__content__info">{comment.post}</div>
          </div>
        </div>
      </li>
    );
  };
  


export default Line;