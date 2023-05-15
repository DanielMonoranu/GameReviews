import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { urlGenres, urlPlatforms } from "../endpoints";
import notify from "../Utilities/ToastErrors";
import GenericList from "../Utilities/GenericList";
import Pagination from "../Utilities/Pagination";
import RecordsPerPageSelect from "../Utilities/RecordsPerPageSelect";
import CustomConfirm from "../Utilities/CustomConfirm";
import { platformDTO } from "../Platforms/platforms.model";

export default function PlatformIndex() {
    const [platforms, setPlatforms] = useState<platformDTO[]>([]);
    const [totalAmountOfPages, setTotalAmountOfPages] = useState(0);
    const [recordsPerPage, setRecordsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadData();
    }, [currentPage, recordsPerPage])

    async function loadData() {
        await axios.get(urlPlatforms, { params: { Page: currentPage, RecordsPerPage: recordsPerPage } })
            .then((response: AxiosResponse<platformDTO[]>) => {
                const totalAmountOfRecords = parseInt(response.headers['totalamountofrecords'], 10);
                setTotalAmountOfPages(Math.ceil(totalAmountOfRecords / recordsPerPage));
                setPlatforms(response.data);
            }).catch(() => {
                notify({
                    type: "error",
                    message: ["Network Error"]
                });
            });
    }

    async function deletePlatform(id: number) {
        try {
            await axios.delete(`${urlPlatforms}/${id}`)
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
            <h3>Platforms</h3>
            <Link className="btn btn-primary" to="platforms/create">Create Platform</Link>

            <RecordsPerPageSelect onChangeRecords={amountOfRecords => {
                setCurrentPage(1);
                setRecordsPerPage(amountOfRecords);
            }} />

            <Pagination currentPage={currentPage} totalPages={totalAmountOfPages}
                onPageChange={newCurrentPage => setCurrentPage(newCurrentPage)}
            />

            <GenericList list={platforms}   >
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {platforms?.map(platform =>
                            <tr key={platform.id}>
                                <td>
                                    {platform.name}
                                </td>
                                <td  >
                                    <Link className="btn btn-success" to={`/platforms/edit/${platform.id}`}>Edit</Link>
                                    <button className="btn btn-danger"
                                        onClick={() => CustomConfirm(() => deletePlatform(platform.id))}>Delete</button>
                                </td>
                            </tr>)}
                    </tbody>
                </table>
            </GenericList >
        </>
    )
}