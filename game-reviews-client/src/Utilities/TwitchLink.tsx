import axios from "axios";
import { useEffect, useState } from "react";

export default function TwitchLink(props: TwitchLinkProps) {
    const clientId = process.env.REACT_APP_TWITCH_CLIENT_ID;
    const oauthToken = process.env.REACT_APP_TWITCH_OAUTH_TOKEN;
    const [streamValues, setStreamValues] = useState<TwitchLinkInfo>();
    useEffect(() => {
        setLink();
    }, []);

    async function setLink() {
        const streamValuesFromLink: TwitchLinkInfo = {
            username: "",
            streamLink: "",
            viewers: 0,

            noStream: false,
        };

        const headers = {
            'Client-ID': clientId,
            "Authorization": "Bearer " + oauthToken,
        };
        const params = {
            "name": props.gameName
        };

        try {
            const response = await axios.get('https://api.twitch.tv/helix/games', { headers, params });
            const streamParams = {
                'game_id': response.data.data[0].id,
                'first': 1,
            };
            const streamResponse = await axios.get('https://api.twitch.tv/helix/streams', { headers, params: streamParams });
            const viewerCount = streamResponse.data.data[0].viewer_count;
            const pictureUrl = streamResponse.data.data[0].thumbnail_url.replace('{width}', '500').replace('{height}', '500');
            const streamUsername = streamResponse.data.data[0].user_name;
            const streamLink = `https://www.twitch.tv/${streamUsername}`;

            streamValuesFromLink.username = streamUsername;
            streamValuesFromLink.streamLink = streamLink;
            streamValuesFromLink.viewers = viewerCount;
            setStreamValues(streamValuesFromLink);

        } catch (error) {
            streamValuesFromLink.noStream = true;
            setStreamValues(streamValuesFromLink);
        }
    }

    const handleLinkClick = () => {
        { window.open(streamValues?.streamLink) }
    }

    return (
        <>
            {streamValues?.noStream ? <span  >< h4  >  The game is not streamed on Twitch </h4 > </span> : <div  >
                <h4 >
                    Biggest Livestream right now:
                </h4>
                <h4 >  <span style={{ color: "#7A82FF" }}>{streamValues?.username} </span>with {streamValues?.viewers} viewers
                    {streamValues?.streamLink ?
                        <button className="btn btn-info ms-2" style={{ backgroundColor: "#7A82FF", border: "#7A82FF", color: "white" }} onClick={handleLinkClick}>Go to stream</button>
                        : null} </h4>
                <div>

                </div >
            </div >
            }
        </>
    );
}

interface TwitchLinkInfo {
    username: string;
    streamLink: string;
    viewers: number;

    noStream: boolean;
}
interface TwitchLinkProps {
    gameName: string;
}