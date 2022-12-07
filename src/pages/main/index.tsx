import { useState } from 'react'
import reactLogo from '../../assets/react.svg'
import login from '../../event/login'
import Import from '../commpent/import'
import Manage from '../commpent/manage'

export default () => {
    return (
        <div className="App">
            <Import></Import>
            <Manage></Manage>
        </div>
    )
}


