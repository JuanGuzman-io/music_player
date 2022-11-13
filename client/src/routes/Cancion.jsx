import { Divider, Flex, HStack, Image, ListItem, OrderedList, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import ReactAudioPlayer from "react-audio-player";
import { APIContext } from "../context/APIContext";

export default function Cancion(params) {
    const { song, setSong } = useContext(APIContext);
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`https://musicplayer-production-5daf.up.railway.app/api/song/all`, config);
            setSong(response.data.songs);
        }
        fetchData();
        // eslint-disable-next-line
    }, []);

    return (
        <Stack
            py={4}
            mt={20}
            w={'100%'}
            margin={'0 auto'}
        >
            <OrderedList>
                {
                    song.map && song.map((s, i) => (
                        <Stack
                            key={i}
                            py={4}
                        >
                            <Flex
                                align={'center'}
                                justify={'space-between'}
                            >
                                <HStack>
                                    <ListItem />
                                    <Image
                                        h={'50px'}
                                        src={s.album_pic}
                                        rounded={4}
                                    />
                                    <Text fontWeight={'bold'} fontSize={'lg'}>{s.title} -</Text>
                                    <Text fontWeight={'medium'} fontSize={'lg'}>{s.artist}</Text>
                                    {
                                        s.feature && (
                                            <Text fontWeight={'medium'} fontSize={'lg'}>FT {s.feature}</Text>
                                        )
                                    }
                                    <Text fontWeight={'medium'} fontSize={'lg'}>{s.name}</Text>
                                </HStack>
                                <ReactAudioPlayer
                                    src={s.file}
                                    controls
                                />
                            </Flex>
                            <Divider />
                        </Stack>
                    ))
                }

            </OrderedList>
        </Stack>
    )
};
