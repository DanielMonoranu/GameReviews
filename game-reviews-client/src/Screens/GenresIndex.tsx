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
        <>
            <h3>Genres</h3>
            <Link className="btn btn-primary" to="genres/create">Create Genre</Link>


            <RecordsPerPageSelect onChangeRecords={amountOfRecords => {
                setCurrentPage(1);
                setRecordsPerPage(amountOfRecords);
            }} />

            <Pagination currentPage={currentPage} totalPages={totalAmountOfPages}
                onPageChange={newCurrentPage => setCurrentPage(newCurrentPage)}
            />

            <GenericList list={genres}   >
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {genres?.map(genre =>
                            <tr key={genre.id}>
                                <td>
                                    {genre.name}
                                </td>
                                <td  >
                                    <Link className="btn btn-success" to={`/genres/edit/${genre.id}`}>Edit</Link>
                                    <button className="btn btn-danger"
                                        onClick={() => CustomConfirm(() => deleteGenre(genre.id))}>Delete</button>
                                </td>
                            </tr>)}
                    </tbody>
                </table>
            </GenericList >
        </>
    )
}