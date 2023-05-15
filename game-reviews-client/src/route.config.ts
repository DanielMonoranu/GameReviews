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

const routes = [
    { path: "/", component: LandingPage, exact: true },

    { path: "/genres", component: GenresIndex, exact: true },
    { path: "/genres/create", component: CreateGenre },
    { path: "/genres/edit/:id(\\d+)", component: EditGenre },

    { path: "/developers", component: DevelopersIndex, exact: true },
    { path: "/developers/create", component: CreateDeveloper },
    { path: "/developers/edit/:id(\\d+)", component: EditDeveloper },

    { path: "/platforms", component: PlatformIndex, exact: true },
    { path: "/platforms/create", component: CreatePlatform },
    { path: "/platforms/edit/:id(\\d+)", component: EditPlatform },

    { path: "/games", component: GameIndex, exact: true },

    { path: "/games/create", component: CreateGame },
    { path: "/games/edit/:id(\\d+)", component: EditGame },
    { path: "/games/filter", component: FilterGames },
    { path: "/games/:id(\\d+)", component: GameFeatures },



    { path: "*", component: RedirectToLandingPage },
]
export default routes;