import { Link } from "react-router-dom";
import TwitchLink from "../Utilities/TwitchLink";
import SteamLink from "../Utilities/SteamLink";
import Review from "../Reviews/Review";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { ReviewDTO } from "../Reviews/reviews.model";
import { urlGames, urlReviews } from "../endpoints";
import RecordsPerPageSelect from "../Utilities/RecordsPerPageSelect";
import { genreDTO } from "../Genres/genres.model";
import Pagination from "../Utilities/Pagination";
import GenericList from "../Utilities/GenericList";
import { gameDTO } from "../Games/games.model";
import notify from "../Utilities/ToastErrors";
import { claim } from "../Auth/auth.models";
import { getClaims } from "../Auth/JWTHandler";
import CustomConfirm from "../Utilities/CustomConfirm";

export default function GameIndex() {
    const [games, setGames] = useState<gameDTO[]>([]);
    const [totalAmountOfPages, setTotalAmountOfPages] = useState(0);
    const [recordsPerPage, setRecordsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [claims, setClaims] = useState<claim[]>([]);

    const isAdmin = () => {
        return claims.findIndex(claim => claim.name === 'role' &&
            claim.value === 'admin') > -1;
    }

    const deleteGame = async (id: number) => {
        try {
            await axios.delete(`${urlGames}/${id}`).then(() => {
                notify({ message: ["Game deleted successfully"], type: "success" });
                loadData();
            });
        }
        catch (error) {
            notify({
                type: "error",
                message: ["Network Error"]
            });
        }
    }

    useEffect(() => {
        setClaims(getClaims());
        loadData();
    }, [currentPage, recordsPerPage])

    async function loadData() {
        await axios.get(`${urlGames}/filter`, { params: { Page: currentPage, RecordsPerPage: recordsPerPage, OnlySearch: false } })
            .then((response: AxiosResponse<gameDTO[]>) => {
                const totalAmountOfRecords = parseInt(response.headers['totalamountofrecords'], 10);
                setTotalAmountOfPages(Math.ceil(totalAmountOfRecords / recordsPerPage));
                setGames(response.data);
            }).catch(() => {
                notify({
                    type: "error",
                    message: ["Network Error"]
                });
            });
    }
    return (

        <div className="container">
            <h1 style={{ marginTop: '15px', marginBottom: '15px', fontFamily: 'Helvetica', fontWeight: "bold" }}  >All Games </h1>
            {isAdmin() && <Link className="btn btn-primary" style={{ marginBottom: "10px" }} to="games/create">Create Game</Link>}

            <RecordsPerPageSelect onChangeRecords={amountOfRecords => {
                setCurrentPage(1);
                setRecordsPerPage(amountOfRecords);
            }} />
            <GenericList list={games}   >
                <div style={{ border: ' 1px solid black', borderRadius: '20px' }}>
                    <table className="table table-striped"  >
                        <thead>
                            <tr>
                                <th >
                                    <span style={{ color: "#7A82FF" }}>&nbsp; Poster</span> </th>
                                <th> <span style={{ color: "#7A82FF" }}>Name</span> </th>
                                {isAdmin() && <th> <span style={{ color: "#7A82FF" }}>Modify</span></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {games?.map(game =>
                                <tr key={game.id}>
                                    <td>
                                        <Link to={`games/${game.id}`} >
                                            <img src={`data:image/jpeg;base64,${game.poster}`} alt="poster" style={{ width: "120px", borderRadius: '10px' }} />
                                        </Link>
                                    </td>
                                    <td>

                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <Link to={`games/${game.id}`} style={{ textDecoration: 'none', color: 'black' }} >
                                                <h4> {game.name}  </h4>
                                            </Link>
                                            <h4 style={{ color: "#7A82FF" }}> Release Date: {new Date(game.releaseDate).toLocaleDateString()}</h4>
                                        </div>
                                        <h4>
                                            {game.averageScoreCritics > -1 && game.averageScoreUsers > -1 ?

                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span>Rating: {((game.averageScoreCritics + game.averageScoreUsers) / 2).toFixed(2)}</span>
                                                    {(game.averageScoreCritics + game.averageScoreUsers) / 2 > 5 ?
                                                        <img src={process.env.PUBLIC_URL + '/star.png'} style={{ width: '50px', height: '50px', marginTop: '10px' }}></img> :
                                                        <img src={process.env.PUBLIC_URL + '/blackhole.png'} style={{ width: '50px', height: '50px', marginTop: '10px' }}></img>}</div>
                                                :
                                                game.averageScoreCritics > -1 ?
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}> <span>Rating: {game.averageScoreCritics.toFixed(2)}</span>
                                                        {game.averageScoreCritics > 5 ?
                                                            <img src={process.env.PUBLIC_URL + '/star.png'} style={{ width: '50px', height: '50px', marginTop: '10px' }}></img> :
                                                            <img src={process.env.PUBLIC_URL + '/blackhole.png'} style={{ width: '50px', height: '50px' }}></img>}
                                                    </div> :
                                                    game.averageScoreUsers > -1 ?
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span>Rating: {game.averageScoreUsers.toFixed(2)}</span>
                                                            {game.averageScoreUsers > 5 ?
                                                                <img src={process.env.PUBLIC_URL + '/star.png'}style={{ width: '50px', height: '50px', marginTop: '10px' }}></img> :
                                                                <img src={process.env.PUBLIC_URL + '/blackhole.png'} style={{ width: '50px', height: '50px', marginTop: '10px' }}></img>}
                                                        </div> :
                                                        <span>Not yet rated</span>}
                                        </h4>
                                    </td>
                                    {isAdmin() &&
                                        <td  >
                                            <  Link className="btn btn-success" style={{ marginRight: '25px', backgroundColor: "#7A82FF", border: "#7A82FF" }} to={`/games/edit/${game.id}`}>Edit</Link>
                                            <button className="btn btn-danger" style={{ marginRight: '25px', backgroundColor: "#DC3545", border: "#DC3545" }} onClick={() => CustomConfirm(() => deleteGame(game.id))}>Delete</button>
                                        </td>
                                    }
                                </tr>)}
                        </tbody>
                    </table>
                </div>
            </GenericList >
            <div style={{ marginTop: "20px" }}>
                <Pagination currentPage={currentPage} totalPages={totalAmountOfPages}
                    onPageChange={newCurrentPage => setCurrentPage(newCurrentPage)} />
            </div>
        </div >
    )
}