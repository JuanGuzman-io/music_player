import { DeleteIcon } from "@chakra-ui/icons";
import { Avatar, Badge, Box, Button, Center, Heading, Spinner, Stack, Text, VStack, Wrap } from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ModalArtist from "../components/add/ModalArtist";
// import ModalEditArtista from "../components/edit/ModalEditArtista";
import { APIContext } from "../context/APIContext";
import AuthContext from "../context/AuthProvider";

export default function Artista(params) {
    let navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { artist, setArtist } = useContext(APIContext);
    const [load, setLoad] = useState(true);
    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const fetchData = async () => {
                try {
                    const response = await axios.get('https://musicplayer-production-5daf.up.railway.app/api/artist/all', config);
                    setArtist(response.data.artists);
                    setLoad(false);
                } catch (error) {
                    console.log(error);
                    setLoad(false);
                }
            }
            fetchData();
        }, 1000);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, []);

    const handleViewMore = async id => {
        navigate(`/artistas/${id}`);
    }

    const handleDelete = async id => {
        if (window.confirm('Estas seguro?')) {
            try {
                const response = await axios.delete(`https://musicplayer-production-5daf.up.railway.app/api/artist/${id}`, config);
                setArtist(artist.filter(a => {
                    return a.artist_id !== id;
                }))
                toast((t) => (
                    <span className='fw-bold'>{response.data.status}</span>
                ), { icon: '🗑️' });
            } catch (error) {
                toast.error('No se puede eliminar el artista, ya que cuenta con canciones ')
            }
        } else {
            toast((t) => (
                <span className='fw-bold'>No se eliminó el artista</span>
            ), { icon: '❗' });
        }
    }

    return (
        <Stack>
            {
                auth.is_admin && (
                    <Stack
                        py={5}
                        width={'fit-content'}
                    >
                        <ModalArtist />
                    </Stack>
                )
            }
            {
                load ? (
                    <Center mt={4}>
                        <VStack>
                            <Spinner size='xl' />
                            <Text>Cargando...</Text>
                        </VStack>
                    </Center>
                ) : (

                    <Wrap
                        spacing='20px'
                        py={4}
                        mt={10}
                    >
                        {
                            artist.map && artist.map((a, i) => (
                                <Box
                                    maxW={'280px'}
                                    w={'full'}
                                    boxShadow={'lg'}
                                    rounded={'lg'}
                                    p={6}
                                    key={i}
                                    textAlign={'center'}>
                                    <Avatar
                                        size={'xl'}
                                        src={
                                            a.profile_pic
                                        }
                                        alt={'Avatar Alt'}
                                        mb={4}
                                        pos={'relative'}
                                    />
                                    <Stack>
                                        <Heading fontSize={'2xl'} fontFamily={'body'}>
                                            {a.aka}
                                        </Heading>
                                        <Text fontWeight={600} color={'gray.500'} mb={4}>
                                            {a.name}
                                        </Text>
                                        <Badge
                                            px={2}
                                            py={1}
                                            fontWeight={'400'}>
                                            #{a.gender}
                                        </Badge>
                                        <Text
                                            textAlign={'center'}
                                            px={3}>
                                            {a.birth_place}
                                        </Text>
                                        <Text
                                            textAlign={'center'}
                                            px={3}>
                                            {a.birth_day}
                                        </Text>

                                        <Stack mt={8} direction={'row'} spacing={4}>
                                            <Button
                                                flex={1}
                                                fontSize={'sm'}
                                                rounded={'full'}
                                                bg={'purple.400'}
                                                color={'white'}
                                                boxShadow={
                                                    '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                                                }
                                                _hover={{
                                                    bg: 'pruple.500',
                                                }}
                                                _focus={{
                                                    bg: 'pruple.500',
                                                }}
                                                onClick={() => handleViewMore(a.artist_id)}
                                            >
                                                Ver más
                                            </Button>
                                        </Stack>
                                        {
                                            auth.is_admin && (
                                                <Stack direction={'row'} spacing='24px' py={2}>
                                                    <Button variant={'outline'} colorScheme={'red'} onClick={() => handleDelete(a.artist_id)} w={'full'}>
                                                        <DeleteIcon />
                                                    </Button>
                                                    {/* <ModalEditArtista id={a.artist_id} /> */}
                                                </Stack>
                                            )
                                        }
                                    </Stack>
                                </Box>
                            ))
                        }
                    </Wrap>
                )
            }
        </Stack>
    )
};
