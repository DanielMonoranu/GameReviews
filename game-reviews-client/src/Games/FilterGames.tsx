import { Field, Form, Formik } from "formik";
import { genreDTO } from "../Genres/genres.model";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { urlDevelopers, urlGames, urlGenres, urlPlatforms } from "../endpoints";
import { gameDTO } from "./games.model";
import GamesList from "./GamesList";
import { developerDTO } from "../Developers/developers.model";
import { platformDTO } from "../Platforms/platforms.model";
import { useHistory, useLocation } from "react-router-dom";
import Pagination from "../Utilities/Pagination";

export default function FilterGames() {
    const history = useHistory();
    const [genres, setGenres] = useState<genreDTO[]>([]);
    const [developers, setDevelopers] = useState<developerDTO[]>([]);
    const [platforms, setPlatforms] = useState<platformDTO[]>([]);
    const [games, setGames] = useState<gameDTO[]>([]);
    const [totalAmountOfPages, seTotalAmountOfPages] = useState(0);

    const query = new URLSearchParams(useLocation().search);  ///!! ce e asta

    const initialValues: filterGamesValues = {
        name: '',
        page: 1,
        recordsPerPage: 10,
        genreId: 0,
        developerId: 0,
        platformId: 0,
        upcomingRelease: false,
        multiplayer: false,
        released: false
    }
    useEffect(() => {
        axios.get(`${urlGenres}/all`)
            .then((response: AxiosResponse<genreDTO[]>) => {
                setGenres(response.data);
            });
        axios.get(`${urlDevelopers}/all`)
            .then((response: AxiosResponse<developerDTO[]>) => {
                setDevelopers(response.data);
            });
        axios.get(`${urlPlatforms}/all`)
            .then((response: AxiosResponse<platformDTO[]>) => {
                setPlatforms(response.data);
            });
    }, []);

    useEffect(() => {
        if (query.get('title')) {
            initialValues.name = query.get('title')!;
        }
        if (query.get('genreId')) {
            initialValues.genreId = parseInt(query.get('genreId')!, 10);
        }
        if (query.get('developerId')) {
            initialValues.developerId = parseInt(query.get('developerId')!, 10);
        }
        if (query.get('platformId')) {
            initialValues.platformId = parseInt(query.get('platformId')!, 10);
        }
        if (query.get('upcomingRelease')) {
            initialValues.upcomingRelease = true;
        }
        if (query.get('released')) {
            initialValues.released = true;
        }
        if (query.get('multiplayer')) {
            initialValues.multiplayer = true;
        }
        if (query.get('page')) {
            initialValues.page = parseInt(query.get('page')!, 10);
        }
        searchGames(initialValues);
    }, []);

    function searchGames(values: filterGamesValues) {
        modifyUrl(values);
        axios.get(`${urlGames}/filter`, { params: values })
            .then((response: AxiosResponse<gameDTO[]>) => {
                const totalAmountOfRecords = parseInt(response.headers["totalamountofrecords"], 10);
                seTotalAmountOfPages(Math.ceil(totalAmountOfRecords / values.recordsPerPage));
                setGames(response.data);
            })
    }

    const modifyUrl = (values: filterGamesValues) => {
        const query: string[] = [];
        if (values.name) {
            query.push(`name=${values.name}`);
        }
        if (values.genreId !== 0) {
            query.push(`genreId=${values.genreId}`);
        }
        if (values.developerId !== 0) {
            query.push(`developerId=${values.developerId}`);
        }
        if (values.platformId !== 0) {
            query.push(`platformId=${values.platformId}`);
        }
        if (values.upcomingRelease) {
            query.push(`upcomingRelease=${values.upcomingRelease}`);
        }
        if (values.released) {
            query.push(`released=${values.released}`);
        }
        if (values.multiplayer) {
            query.push(`multiplayer=${values.multiplayer}`);
        }
        query.push(`page=${values.page}`);
        history.push(`/games/filter?${query.join('&')}`);
    }


    return (<>
        <h3>Filter Games</h3>
        <Formik initialValues={initialValues}
            onSubmit={(values) => {
                values.page = 1;
                searchGames(values);
            }
            }>
            {(formikProps) => (
                <>
                    <Form>
                        <div className="row gx-3 align-items-center mb-3">
                            <div className="col-auto">
                                <input type="text" className="form-control" id="name" placeholder="Name of the game" {...formikProps.getFieldProps("name")} />
                            </div>
                            <div className="col-auto">
                                <select className="form-select" {...formikProps.getFieldProps("genreId")}>
                                    <option value="0">Choose a genre</option>
                                    {genres.map(genre => <option key={genre.id} value={genre.id}>{genre.name}</option>)}
                                </select>
                            </div>
                            <div className="col-auto">
                                <select className="form-select" {...formikProps.getFieldProps("developerId")}>
                                    <option value="0">Choose developer</option>
                                    {developers.map(developer => <option key={developer.id} value={developer.id}>{developer.name}</option>)}
                                </select>
                            </div>
                            <div className="col-auto">
                                <select className="form-select" {...formikProps.getFieldProps("platformId")}>
                                    <option value="0">Choose platform</option>
                                    {platforms.map(platform => <option key={platform.id} value={platform.id}>{platform.name}</option>)}
                                </select>
                            </div>
                            <div className="col-auto">
                                <div className="form-check">
                                    <Field className="form-check-input" id="upcomingRelesase" name="upcomingRelease" type="checkbox" />
                                    <label className="form-check-label" htmlFor="upcomingRelease">Upcoming Releases</label>
                                </div>
                            </div>
                            <div className="col-auto">
                                <div className="form-check">
                                    <Field className="form-check-input" id="released" name="released" type="checkbox" />
                                    <label className="form-check-label" htmlFor="released">Released</label>
                                </div>
                            </div>
                            <div className="col-auto">
                                <button className="btn btn-primary" onClick={() => formikProps.submitForm}>Filter</button>
                                <button className="btn btn-danger ms-3" onClick={() => {
                                    searchGames(initialValues);
                                    formikProps.setValues(initialValues)
                                }}>Cancel</button>
                            </div>
                        </div>
                    </Form>
                    <GamesList games={games} />
                    <Pagination
                        currentPage={formikProps.values.page}
                        totalPages={totalAmountOfPages}

                        onPageChange={newPage => {
                            formikProps.values.page = newPage;
                            searchGames(formikProps.values);
                        }} />
                </>
            )}
        </Formik >
    </>)
}

interface filterGamesValues {
    name: string;
    genreId: number;
    developerId: number;
    platformId: number;
    page: number;
    recordsPerPage: number;
    upcomingRelease: boolean;
    released: boolean;
    multiplayer: boolean;


}