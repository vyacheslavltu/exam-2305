import { useContext } from 'react';
import Events from '../../Contexts/Events';

function Line({ event }) {

    const { setDeleteData, setModalData } = useContext(Events);

    return (
        <li className="list-group-item">
            <div className="line">
                <div className="line__content">
                    <div className="line__content__title">
                        <h1>{event.title}</h1>
                    </div>
                </div>
                <div className="line__buttons">
                    <button onClick={() => setModalData(event)} type="button" className="btn btn-outline-success">Edit</button>
                    <button onClick={() => setDeleteData(event)} type="button" className="btn btn-outline-danger">Delete</button>
                </div>
            </div>
        </li>
    )
}

export default Line;