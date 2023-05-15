import { gameDTO } from "./games.model"
import SingleGame from "./SingleGame";
import css from './GamesList.module.css';
import GenericList from "../Utilities/GenericList";


export default function GamesList(props: gamesListProps) {
    return <GenericList list={props.games} >
        <div className={css.div}>
            {props.games?.map((game) => {
                return <  SingleGame {...game} key={game.id} />
            }
            )}
        </div>
    </GenericList>
}
interface gamesListProps {
    games?: gameDTO[];
}