import { Link, NavLink } from "react-router-dom";
import Authorized from "./Auth/Authorized";
import { logout } from "./Auth/HandleJWT";
import { useContext } from "react";
import AuthenticationContext from "./Auth/AuthenticationContext";

export default function Menu() {
    const { update, claims } = useContext(AuthenticationContext);

    const getUserEmail = (): string => {
        return claims.filter(claim => claim.name === 'email')[0]?.value;

    }


    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">Game Reviews</NavLink>
                <div className="collapse navbar-collapse" style={{ display: 'flex', justifyContent: "space-between" }}>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/games/filter">
                                Filter games
                            </NavLink>
                        </li>
                        <Authorized
                            role="admin"
                            authorized={<>

                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/genres">
                                        Genres
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/developers">
                                        Developers
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/platforms">
                                        Platforms
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/games">
                                        Games ?
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/users">
                                        Users
                                    </NavLink>
                                </li>
                            </>}
                        />
                    </ul>
                    <div className="d-flex">
                        <Authorized authorized={<>
                            {/* <span className="nav-link">Welcome, {localStorage.getItem('name')}</span> */}
                            <span className="nav-link">Welcome,  {getUserEmail()}</span>
                            <button className="nav-link btn btn-link" onClick={() => {
                                logout();
                                update([]);
                            }}
                            >Log out</button>
                        </>}
                            notAuthorized={<>
                                <Link to="/register"
                                    className="nav-link btn btn-link">Register</Link>
                                <Link to="/login"
                                    className="nav-link btn btn-link">Login</Link>
                            </>} />
                    </div>
                </div>
            </div>
        </nav >
    )
}