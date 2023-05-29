import { useEffect, useState } from "react";
import RecordsPerPageSelect from "../Utilities/RecordsPerPageSelect";
import Pagination from "../Utilities/Pagination";
import { userDTO } from "../Auth/auth.models";
import GenericList from "../Utilities/GenericList";
import { Link } from "react-router-dom";
import CustomConfirm from "../Utilities/CustomConfirm";
import axios, { AxiosResponse } from "axios";
import { urlAccounts } from "../endpoints";
import { genreDTO } from "../Genres/genres.model";
import notify from "../Utilities/ToastErrors";

export default function UsersIndex() {
    const [users, setUsers] = useState<userDTO[]>([]);
    const [totalAmountOfPages, setTotalAmountOfPages] = useState(0);
    const [recordsPerPage, setRecordsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadData();
    }, [currentPage, recordsPerPage])

    const loadData = async () => {
        await axios.get(urlAccounts, { params: { Page: currentPage, RecordsPerPage: recordsPerPage } })
            .then((response: AxiosResponse<userDTO[]>) => {
                //console.log(response.data);
                const totalAmountOfRecords = parseInt(response.headers['totalamountofrecords'], 10);
                setTotalAmountOfPages(Math.ceil(totalAmountOfRecords / recordsPerPage));
                setUsers(response.data);
            }).catch(() => {
                notify({
                    type: "error",
                    message: ["Network Error"]
                });
            });
    }

    const removeAdmin = async (id: string) => {
        ///console.log(id);
        try {
            await axios.post(`${urlAccounts}/removeAdmin`, JSON.stringify(id), { headers: { 'Content-Type': 'application/json' } })
                .then(() => { notify({ message: ["Removed successfully"], type: "success" }); })
        }
        catch (error) {
            notify({
                type: "error",
                message: ["Network Error"]
            });
        }
    }
    const makeAdmin = async (id: string) => {
        try {
            await axios.post(`${urlAccounts}/makeAdmin`, JSON.stringify(id), { headers: { 'Content-Type': 'application/json' } })
                .then(() => { notify({ message: ["Admin created successfully"], type: "success" }); })
        }
        catch (error) {
            notify({
                type: "error",
                message: ["Network Error"]
            });
        }
    }

    return (
        //userdto
        //title
        // urlaccounts

        <>
            <h3>Users</h3>
            <RecordsPerPageSelect onChangeRecords={amountOfRecords => {
                setCurrentPage(1);
                setRecordsPerPage(amountOfRecords);
            }} />

            <Pagination currentPage={currentPage} totalPages={totalAmountOfPages}
                onPageChange={newCurrentPage => setCurrentPage(newCurrentPage)}
            />
            <GenericList list={users}   >
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Email </th>
                            <th></th>

                        </tr>
                    </thead>
                    <tbody>
                        {users?.map(user =>
                            <tr key={user.id}>
                                <td>
                                    {user.email}
                                    <img src={user.profilePicture} alt="user" style={{ width: "3rem", marginLeft: "1rem" }} />
                                </td>

                                <td  >
                                    <button className="btn btn-success" style={{ marginRight: "1rem" }}
                                        onClick={() => CustomConfirm(() => makeAdmin(user.id), `Do you wish to make ${user.email} an admin?`, `Do it`)}  >Make Admin</button>
                                    <button className="btn btn-danger"
                                        onClick={() => CustomConfirm(() => removeAdmin(user.id),
                                            `Do you wish to remove ${user.email} as an admin?`, `Do it`)}>Remove Admin</button>
                                </td>
                            </tr>)}
                    </tbody>
                </table>
            </GenericList >


        </>

    )
}