import { useContext } from 'react';
import Cities from '../../Contexts/Cities';

function Line({ city }) {

    const { setDeleteData, setModalData } = useContext(Cities);

    return (
        <li className="list-group-item">
            <div className="line">
                <div className="line__content">
                    <div className="line__content__info">
                        {city.image ? <div className='img-bin'>
                            <img src={city.image} alt={city.title}>
                            </img>
                        </div> : <span className="red-image">No image</span>}
                    </div>
                    <div className="line__content__title">
                        <h1>{city.title}</h1>
                    </div>
                </div>
                <div className="line__buttons">
                    <button onClick={() => setModalData(city)} type="button" className="btn btn-outline-success">Edit</button>
                    <button onClick={() => setDeleteData(city)} type="button" className="btn btn-outline-danger">Delete</button>
                </div>
            </div>
        </li>
    )
}

export default Line;