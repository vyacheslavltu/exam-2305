import { useContext } from 'react';
import Events from "../../Contexts/Events";
import Line from './Line';

function List() {

    const { events } = useContext(Events);

    return (
        <div className="card m-4">
            <h5 className="card-header">Events List</h5>
            <div className="card-body">
                <ul className="list-group">
                    {
                        events?.map(s => <Line key={s.id} service={s} />)
                    }
                </ul>
            </div>
        </div>
    );
}

export default List;