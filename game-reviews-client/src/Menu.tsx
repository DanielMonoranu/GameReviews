import { Link, NavLink, useHistory } from "react-router-dom";
import Authorized from "./Auth/Authorized";
import { logout } from "./Auth/JWTHandler";
import { useContext, useEffect, useState } from "react";
import AuthenticationContext from "./Auth/AuthenticationContext";
import axios, { AxiosResponse } from "axios";
import { urlAccounts } from "./endpoints";
import notify from "./Utilities/ToastErrors";

export default function Menu() {
    const history = useHistory();
    const { update, claims } = useContext(AuthenticationContext);
    const [profilePicture, setProfilePicture] = useState('');
    const [emptyProfilePicture, setEmptyProfilePicture] = useState(false);

    const getUserEmail = (): string => {
        return claims.filter(claim => claim.name === 'email')[0]?.value;
    }

    const ifUser = () => {
        return claims.findIndex(claim => claim.name === 'type' &&
            claim.value === 'User') > -1;
    }

    useEffect(() => {
        loadProfilePicutre();
    }, [getUserEmail()])

    const loadProfilePicutre = async () => {
        await axios.get(`${urlAccounts}/getProfilePicture`, { params: { Email: getUserEmail() } })
            .then((response: AxiosResponse<string>) => {
                if (response.data.length == 0) {
                    setEmptyProfilePicture(true);
                }
                else {
                    setEmptyProfilePicture(false);
                    setProfilePicture(response.data);
                }
            })
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">
                    <img src={process.env.PUBLIC_URL + '/SRMov.png'} style={{ width: '30px', height: '30px' }} ></img>
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
                            <Link className="nav-link" to="/changeCredentials" >Welcome,   {getUserEmail()} &nbsp;
                                <img
                                    src={emptyProfilePicture ? 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'
                                        : `data:image/jpeg;base64,${profilePicture}`}
                                    alt="profile" style={{ width: '30px', height: '30px', borderRadius: '50%' }} /></Link>
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