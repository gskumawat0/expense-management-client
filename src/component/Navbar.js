import React from 'react';
import {NavLink} from 'react-router-dom';
import './Navbar.css'
const NavBar = (props)=>{
    return (
        <nav className="navbar navbar-light bg-light vh-100">
            <ul className="navbar-nav">
                <li className="nav-item active">
                    <NavLink to='/'  > Home</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to='/settings' > Settings</NavLink>

                </li>
                <li className="nav-item">
                    <NavLink to='/profile' > Profile</NavLink>

                </li>
            </ul>
        </nav>
    )
}

export default NavBar;