import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { genreDTO } from "../Genres/genres.model";
import { urlGenres } from "../endpoints";
import notify from "../Utilities/ToastErrors";
import GenericList from "../Utilities/GenericList";
import Pagination from "../Utilities/Pagination";
import RecordsPerPageSelect from "../Utilities/RecordsPerPageSelect";
import CustomConfirm from "../Utilities/CustomConfirm";

export default function GenresIndex() {
    const [genres, setGenres] = useState<genreDTO[]>([]);
    const [totalAmountOfPages, setTotalAmountOfPages] = useState(0);
    const [recordsPerPage, setRecordsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadData();
    }, [currentPage, recordsPerPage])

    async function loadData() {
        await axios.get(urlGenres, { params: { Page: currentPage, RecordsPerPage: recordsPerPage } })
            .then((response: AxiosResponse<genreDTO[]>) => {
                const totalAmountOfRecords = parseInt(response.headers['totalamountofrecords'], 10);
                setTotalAmountOfPages(Math.ceil(totalAmountOfRecords / recordsPerPage));
                setGenres(response.data);
            }).catch(() => {
                notify({
                    type: "error",
                    message: ["Network Error"]
                });
            });
    }

    async function deleteGenre(id: number) {
        try {
            await axios.delete(`${urlGenres}/${id}`)
                .then(() => { loadData(); notify({ message: ["Deleted successfully"], type: "success" }); })
        }
        catch (error) {
            notify({
                type: "error",
                message: ["Network Error"]
            });
        }
    }

    return (
        <div className="container">
            <h1 style={{ marginTop: '15px', marginBottom: '15px', fontFamily: 'Helvetica', fontWeight: "bold" }}  >All Genres </h1>
            <Link className="btn btn-primary" style={{ marginBottom: "10px" }} to="genres/create">Create Genre</Link>

            <RecordsPerPageSelect onChangeRecords={amountOfRecords => {
                setCurrentPage(1);
                setRecordsPerPage(amountOfRecords);
            }} />

            <GenericList list={genres}>
                <div style={{ border: ' 1px solid black', borderRadius: '20px' }}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>
                                    <span style={{ color: "#7A82FF" }}>  Name</span>
                                </th>
                                <th>
                                    <span style={{ color: "#7A82FF" }}> Modify</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {genres?.map(genre =>
                                <tr key={genre.id}>
                                    <td>
                                        {genre.name}
                                    </td>
                                    <td  >
                                        <  Link className="btn btn-success" style={{ marginRight: '25px', backgroundColor: "#7A82FF", border: "#7A82FF" }} to={`/genres/edit/${genre.id}`}>Edit</Link>
                                        <button className="btn btn-danger" style={{ marginRight: '25px', backgroundColor: "#DC3545", border: "#DC3545" }} onClick={() => CustomConfirm(() => deleteGenre(genre.id))}>Delete</button>

                                    </td>
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