import { Divider, Flex, Heading, HStack, Image, ListItem, OrderedList, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect } from "react";
import ReactAudioPlayer from "react-audio-player";
import { useParams } from "react-router-dom";
import { APIContext } from "../context/APIContext";
import AuthContext from "../context/AuthProvider";

export default function UnGenero(params) {
    const { id } = useParams();
    const { song, setSong, gender, setGender } = useContext(APIContext);
    const token = localStorage.getItem('token');
    const { auth } = useContext(AuthContext);
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`http://localhost:3400/api/song/gender/${id}`, config);
            setSong(response.data.songs);
            setGender(response.data.genero);
        }
        fetchData();
    }, []);

    return (
        <Stack
            py={4}
            mt={20}
            w={'100%'}
            margin={'0 auto'}
        >
            <Heading>{gender.name}</Heading>
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
                                    <Text fontWeight={'bold'} fontSize={'lg'}>{s.artist}, ({s.name})</Text>
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
    );
};
