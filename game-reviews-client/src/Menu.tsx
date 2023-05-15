import { NavLink } from "react-router-dom";

export default function Menu() {

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
                                Games
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/users">
                                Users
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav >
    )
}