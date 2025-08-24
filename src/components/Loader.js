import './Loader.css'; // Assicurati di avere il file CSS
import { movieStore } from '../stores/MovieStore';
import { observer } from 'mobx-react-lite';
const Loader = () => {

    const {loading} = movieStore;

    return (
        <>
            {loading &&
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            }
        </>
 
    );
};

export default observer(Loader);