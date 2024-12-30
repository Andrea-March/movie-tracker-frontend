import React, {useEffect, useState} from 'react'
import './Error.css'

const Error = ({error}) => {

    const [showSelf, setShowSelf] = useState(false);
    
    useEffect(()=>{
        const showError = () => {
            setShowSelf(true);
            setTimeout(() => {
                setShowSelf(false);
            }, 3000);
        }
        error && showError();
    },[error]);

    return (
        <>
        {showSelf &&
            <div className='error-popup'>
                {error}
            </div>
        }
        </>
    )
}

export default Error;