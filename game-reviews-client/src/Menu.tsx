import { Link, NavLink, useHistory } from "react-router-dom";
import Authorized from "./Auth/Authorized";
import { logout } from "./Auth/JWTHandler";
import { useContext } from "react";
import AuthenticationContext from "./Auth/AuthenticationContext";

export default function Menu() {
    const history = useHistory();
    const { update, claims } = useContext(AuthenticationContext);

    const getUserEmail = (): string => {
        return claims.filter(claim => claim.name === 'email')[0]?.value;

    }
    const ifUser = () => {
        return claims.findIndex(claim => claim.name === 'type' &&
            claim.value === 'User') > -1;
    }

    const getProfilePicture = (): string => {
        if (claims.filter(claim => claim.name === 'profilePicture')[0]?.value) {
            return claims.filter(claim => claim.name === 'profilePicture')[0]?.value;
        }
        else {
            return 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">
                    <img src="https://gamereviewsapi.blob.core.windows.net/gameresources/SRColor.png" style={{ width: '30px', height: '30px' }} ></img>
                    <span>
                        &nbsp; Starry Reviews
                    </span>
                </NavLink>
                <div className="collapse navbar-collapse" style={{ display: 'flex', justifyContent: "space-between" }}>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/games/filter">
                                Search
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/games">
                                Games
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
                                    <NavLink className="nav-link" to="/users">
                                        Users
                                    </NavLink>
                                </li>
                            </>}
                        />
                        {ifUser() && <li className="nav-item">
                            <NavLink className="nav-link" to="/becomeCritic">
                                Become a Critic
                            </NavLink>
                        </li>}

                    </ul>
                    <div className="d-flex">
                        <Authorized authorized={<>
                            <Link className="nav-link" to="/changeCredentials" >Welcome,  {getUserEmail()}     <img src={getProfilePicture()} alt="profile" style={{ width: '30px', height: '30px', borderRadius: '50%' }} /></Link>
                            <button className="nav-link btn btn-dark" onClick={() => {
                                logout();
                                update([]);
                                history.push('/');
                            }}
                            >Log out</button>

                        </>}
                            notAuthorized={<>
                                <Link to="/register"
                                    className="nav-link btn-link ">Register</Link>
                                <Link to="/login"
                                    className="nav-link btn btn-link">Login</Link>
                            </>} />
                    </div>
                </div>
            </div>
        </nav >
    )
}