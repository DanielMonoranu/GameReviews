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
              //  console.log(response.data)
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

    const makeAdmin = async (id: string) => {
        try {
            await axios.post(`${urlAccounts}/makeAdmin`, JSON.stringify(id), { headers: { 'Content-Type': 'application/json' } })
                .then(() => { notify({ message: ["Admin created successfully"], type: "success" }); loadData(); })
        }
        catch (error) {
            notify({
                type: "error",
                message: ["Network Error"]
            });
        }
    }

    const removeAdmin = async (id: string) => {
        try {
            await axios.post(`${urlAccounts}/removeAdmin`, JSON.stringify(id), { headers: { 'Content-Type': 'application/json' } })
                .then(() => { notify({ message: ["Removed successfully"], type: "success" }); loadData(); })
        }
        catch (error) {
            notify({
                type: "error",
                message: ["Network Error"]
            });
        }
    }


    const makeCritic = async (id: string) => {
        try {
            await axios.post(`${urlAccounts}/makeCritic`, JSON.stringify(id), { headers: { 'Content-Type': 'application/json' } })
                .then(() => { notify({ message: ["Critic created successfully"], type: "success" }); loadData(); })
        }
        catch (error) {
            notify({
                type: "error",
                message: ["Network Error"]
            });
        }
    }

    const removeCritic = async (id: string) => {
        try {
            await axios.post(`${urlAccounts}/removeCritic`, JSON.stringify(id), { headers: { 'Content-Type': 'application/json' } })
                .then(() => { notify({ message: ["Critic removed successfully"], type: "success" }); loadData(); })
        }
        catch (error) {
            notify({
                type: "error",
                message: ["Network Error"]
            });
        }
    }

    const deleteAccount = async (id: string) => {
        try {
            await axios.post(`${urlAccounts}/deleteAccount`, JSON.stringify(id), { headers: { 'Content-Type': 'application/json' } })
                .then(() => { notify({ message: ["Account deleted successfully"], type: "success" }); loadData(); })
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
            <h1 style={{ marginTop: '15px', marginBottom: '15px', fontFamily: 'Helvetica', fontWeight: "bold" }}  >All Users </h1>
            <RecordsPerPageSelect onChangeRecords={amountOfRecords => {
                setCurrentPage(1);
                setRecordsPerPage(amountOfRecords);
            }} />

            <GenericList list={users}   >
                <div style={{ border: ' 1px solid black', borderRadius: '20px' }}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>
                                    <span style={{ color: "#7A82FF" }}>  Email</span>
                                </th>
                                <th>
                                    <span style={{ color: "#7A82FF" }}>  Type</span>
                                </th>
                                <th>
                                    <span style={{ color: "#7A82FF" }}>  Modify</span>
                                </th>
                                <th>
                                    <span style={{ color: "#7A82FF" }}>  Admin state</span>
                                </th>
                                <th>
                                    <span style={{ color: "#7A82FF" }}>  Remove</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map(user =>
                                <tr key={user.id}>
                                    <td>
                                        <div style={{ display: 'flex' }}>
                                            <img src={user.profilePicture} alt="user" style={{ width: "3rem", marginLeft: "1rem" }} />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td>
                                        {user.type}
                                    </td>
                                    <td  >

                                        {user.type !== 'Critic' && user.type !== 'Admin' &&
                                            <button className="btn btn-success" style={{ marginRight: '25px', backgroundColor: "#7A82FF", border: "#7A82FF" }}
                                                onClick={() => CustomConfirm(() => makeCritic(user.id), `Do you wish to make ${user.email} a critic?`, `Do it`)}  >Make Critic</button>}
                                        {user.type === "Critic" &&
                                            <button className="btn btn-danger" style={{ marginRight: '25px', backgroundColor: "#DC3545", border: "#DC3545" }}
                                                onClick={() => CustomConfirm(() => removeCritic(user.id),
                                                    `Do you wish to remove ${user.email} as a critic?`, `Do it`)}>Remove Critic </button>}
                                    </td>
                                    <td  >
                                        {user.type !== 'Admin' &&
                                            <button className="btn btn-success" style={{ marginRight: '25px', backgroundColor: "#7A82FF", border: "#7A82FF" }}
                                                onClick={() => CustomConfirm(() => makeAdmin(user.id), `Do you wish to make ${user.email} an admin?`, `Do it`)}  >Make Admin</button>}
                                        {user.type === "Admin" &&
                                            <button className="btn btn-danger" style={{ marginRight: '25px', backgroundColor: "#DC3545", border: "#DC3545" }}
                                                onClick={() => CustomConfirm(() => removeAdmin(user.id),
                                                    `Do you wish to remove ${user.email} as an admin?`, `Do it`)}>Remove Admin</button>}
                                    </td>
                                    <td>
                                        <button className="btn btn-danger" style={{ marginRight: '25px', backgroundColor: "#DC3545", border: "#DC3545" }}
                                            onClick={() => CustomConfirm(() => deleteAccount(user.id),
                                                `Do you wish delete ${user.email}'s account?`, `Do it`)}>Delete Account</button>
                                    </td>

                                </tr>)}
                        </tbody>
                    </table>
                </div>
            </GenericList >

            <div style={{ marginTop: "20px" }}>
                <Pagination currentPage={currentPage} totalPages={totalAmountOfPages}
                    onPageChange={newCurrentPage => setCurrentPage(newCurrentPage)}
                />
            </div>
        </div >

    )
}