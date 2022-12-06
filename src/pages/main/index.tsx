import { useState } from 'react'
import reactLogo from '../../assets/react.svg'
import login from '../../event/login'
import Import from '../commpent/import'
import Manage from '../commpent/manage'

export default () => {
    const [address, setAddress] = useState('')
    login.on('sendValue', data => {
        setAddress(data)
    })
    return (
        <div className="App">
            {
                address != "" ? address : <Import></Import>
            }
            <Manage></Manage>
        </div>
    )
}


