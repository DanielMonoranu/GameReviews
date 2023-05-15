import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { developerDTO } from "../Developers/developers.model";
import axios, { AxiosResponse } from "axios";
import { urlDevelopers } from "../endpoints";
import notify from "../Utilities/ToastErrors";
import RecordsPerPageSelect from "../Utilities/RecordsPerPageSelect";
import Pagination from "../Utilities/Pagination";
import GenericList from "../Utilities/GenericList";
import CustomConfirm from "../Utilities/CustomConfirm";


export default function DevelopersIndex() {
    const [developers, setDevelopers] = useState<developerDTO[]>([]);
    const [totalAmountOfPages, setTotalAmountOfPages] = useState(0);
    const [recordsPerPage, setRecordsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadData();
    }, [currentPage, recordsPerPage])

    async function loadData() {
        await axios.get(urlDevelopers, { params: { Page: currentPage, RecordsPerPage: recordsPerPage } })
            .then((response: AxiosResponse<developerDTO[]>) => {
                const totalAmountOfRecords = parseInt(response.headers['totalamountofrecords'], 10);
                setTotalAmountOfPages(Math.ceil(totalAmountOfRecords / recordsPerPage));
                setDevelopers(response.data);
            }).catch(() => {
                notify({
                    type: "error",
                    message: ["Network Error"]
                });
            });
    }

    async function deleteDeveloper(id: number) {
        try {
            await axios.delete(`${urlDevelopers}/${id}`)
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
            <h3>Developers</h3>
            <Link className="btn btn-primary" to="developers/create">Create Developer</Link>


            <RecordsPerPageSelect onChangeRecords={amountOfRecords => {
                setCurrentPage(1);
                setRecordsPerPage(amountOfRecords);
            }} />

            <Pagination currentPage={currentPage} totalPages={totalAmountOfPages}
                onPageChange={newCurrentPage => setCurrentPage(newCurrentPage)}
            />

            <GenericList list={developers}   >
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {developers?.map(developer =>
                            <tr key={developer.id}>
                                <td>
                                    {developer.name}
                                </td>
                                <td  >
                                    <Link className="btn btn-success" to={`/developers/edit/${developer.id}`}>Edit</Link>
                                    <button className="btn btn-danger"
                                        onClick={() => CustomConfirm(() => deleteDeveloper(developer.id))}>Delete</button>
                                </td>
                            </tr>)}
                    </tbody>
                </table>
            </GenericList >
        </>
    )
}