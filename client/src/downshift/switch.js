import React, {Fragment} from 'react';
import './switch.scss';

const Switch=()=>{

    return(
        <Fragment>
            
                <div className="switch-toggle">
                    <input type="checkbox" id="bluetooth"/>
                    <label for="bluetooth"></label>
                </div>
        </Fragment>

    );
}
    
export default Switch;
