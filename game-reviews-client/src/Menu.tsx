import { Link, NavLink } from "react-router-dom";
import Authorized from "./Auth/Authorized";
import { logout } from "./Auth/JWTHandler";
import { useContext } from "react";
import AuthenticationContext from "./Auth/AuthenticationContext";

export default function Menu() {
    const { update, claims } = useContext(AuthenticationContext);

    const getUserEmail = (): string => {
        return claims.filter(claim => claim.name === 'email')[0]?.value;

    }
    // 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'
    const getProfilePicture = (): string => {
        if (claims.filter(claim => claim.name === 'profilePicture')[0]?.value) {
            return claims.filter(claim => claim.name === 'profilePicture')[0]?.value;
        }
        else {
            return 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'
        }
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
                                        Games ??
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
                            {/* modify profile picture */}
                            <img src={getProfilePicture()} alt="profile" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
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