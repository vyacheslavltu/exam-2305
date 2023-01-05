import { useContext } from 'react';
import Cities from "../../Contexts/Cities";
import Line from './Line';

function List() {

    const { cities } = useContext(Cities);

    return (
        <div className="card m-4">
            <h5 className="card-header">Cities List</h5>
            <div className="card-body">
                <ul className="list-group">
                    {
                        cities?.map(m => <Line key={m.id} municipality={m} />)
                    }
                </ul>
            </div>
        </div>
    );
}

export default List;