import CreateDeveloper from "./Developers/CreateDeveloper";
import EditDeveloper from "./Developers/EditDeveloper";
import CreateGame from "./Games/CreateGame";
import EditGame from "./Games/EditGame";
import FilterGames from "./Games/FilterGames";
import GameFeatures from "./Screens/GameFeatures";
import CreateGenre from "./Genres/CreateGenre";
import EditGenre from "./Genres/EditGenre";
import CreatePlatform from "./Platforms/CreatePlatform";
import EditPlatform from "./Platforms/EditPlatform";
import DevelopersIndex from "./Screens/DevelopersIndex";
import GameIndex from "./Screens/GameIndex";
import GenresIndex from "./Screens/GenresIndex";
import LandingPage from "./Screens/LandingPage";
import PlatformIndex from "./Screens/PlatformIndex";
import RedirectToLandingPage from "./Utilities/RedirectToLandingPage";
import Review from "./Reviews/Review";
import ReviewIndex from "./Screens/ReviewsIndex";
import RegisterUser from "./Auth/RegisterUser";
import Login from "./Auth/LoginUser";
import LoginUser from "./Auth/LoginUser";
import UsersIndex from "./Screens/UsersIndex";

const routes = [
    { path: "/", component: LandingPage, exact: true },

    { path: "/genres", component: GenresIndex, exact: true, isAdmin: true },
    { path: "/genres/create", component: CreateGenre, isAdmin: true },
    { path: "/genres/edit/:id(\\d+)", component: EditGenre, isAdmin: true },

    { path: "/developers", component: DevelopersIndex, exact: true, isAdmin: true },
    { path: "/developers/create", component: CreateDeveloper, isAdmin: true },
    { path: "/developers/edit/:id(\\d+)", component: EditDeveloper, isAdmin: true },

    { path: "/platforms", component: PlatformIndex, exact: true, isAdmin: true },
    { path: "/platforms/create", component: CreatePlatform, isAdmin: true },
    { path: "/platforms/edit/:id(\\d+)", component: EditPlatform, isAdmin: true },

    { path: "/games", component: GameIndex, exact: true },
    { path: "/games/create", component: CreateGame, isAdmin: true },
    { path: "/games/edit/:id(\\d+)", component: EditGame, isAdmin: true },
    { path: "/games/filter", component: FilterGames },
    { path: "/games/:id(\\d+)", component: GameFeatures },

    { path: "/reviews/:id(\\d+)", component: ReviewIndex },

    { path: "/register", component: RegisterUser },
    { path: "/login", component: LoginUser },
    { path: "/users", component: UsersIndex, isAdmin: true },



    { path: "*", component: RedirectToLandingPage },
]
export default routes;