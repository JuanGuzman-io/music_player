import {
    Table,
    Tbody,
    Tr,
    Td,
    TableContainer,
    Heading,
    HStack,
    Image,
    Stack,
    Text,
    VStack,
    Wrap,
    Spinner,
    Center
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useContext } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { APIContext } from "../context/APIContext"

export default function UnArtista(params) {
    let navigate = useNavigate();
    const { id } = useParams();
    const { artist, setArtist, album, setAlbum } = useContext(APIContext);
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const [load, setLoad] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/artist/${id}`, config);
                setArtist(response.data.artist);
                setAlbum(response.data.albums);
                setLoad(false);
            } catch (error) {
                console.log(error);
                setLoad(false);
            }
        }
        fetchData();
        // eslint-disable-next-line
    }, [])

    const handlerViewMore = async id => {
        navigate(`/albumes/${id}`);
    }

    return (
        <Stack
            py={4}
            mt={20}
            w={'100%'}
            margin={'0 auto'}
        >
            {
                load ? (
                    <Center>
                        <Spinner size='xl' />
                        <Text>Cargando...</Text>
                    </Center>
                ) : (
                    <>
                        <HStack>
                            <Image w={220} src={artist.profile_pic} alt={'Artist'} rounded={4} />
                            <VStack align={'left'}>
                                <Heading>{artist.aka}</Heading>
                                <Text fontWeight={'bold'} color={'gray.600'}>{artist.name}</Text>
                                <Text fontWeight={'bold'} color={'gray.600'}>{artist.label}</Text>
                                <Text fontWeight={'bold'} color={'gray.600'}>{artist.birth_place}</Text>
                                <Text fontWeight={'bold'} color={'gray.600'}>{artist.birth_day}</Text>
                                <Text>{artist.description}</Text>
                            </VStack>
                        </HStack>
                        {
                            album ? (
                                <>
                                    <Text pt={5} fontWeight={'bold'} fontSize={'2xl'}>Todos los albumes</Text>
                                    <Wrap
                                        spacing={'20px'}
                                    >
                                        <TableContainer pt={5} width={'100%'}>
                                            <Table variant='simple'>
                                                <Tbody>
                                                    {
                                                        album.map && album.map((a, i) => (
                                                            <Tr
                                                                key={i}
                                                                onClick={() => handlerViewMore(a.album_id)}
                                                                cursor={'pointer'}
                                                            >
                                                                <Td>
                                                                    <Image src={a.album_pic} w={'80px'} rounded={4} />
                                                                </Td>
                                                                <Td fontWeight={'bold'}>{a.name}</Td>
                                                                <Td fontWeight={'bold'}>{a.description}</Td>
                                                                <Td fontWeight={'bold'}>Fecha de lanzamiento: {(new Date(a.release_date).toLocaleDateString())}</Td>
                                                            </Tr>
                                                        ))
                                                    }
                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                    </Wrap>
                                </>
                            ) : (
                                <Text pt={5} fontWeight={'bold'} fontSize={'2xl'}>El artista no tiene albumes</Text>
                            )
                        }
                    </>
                )
            }
        </Stack>
    )
};
