import { DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Heading, Image, Spinner, Stack, Text, VStack, Wrap } from '@chakra-ui/react';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ModalAlbum from '../components/add/ModalAlbum';
// import ModalEditAlbum from '../components/edit/ModalEditAlbum';
import { APIContext } from '../context/APIContext';
import AuthContext from '../context/AuthProvider';

export default function Album(params) {
    const { auth } = useContext(AuthContext);
    const token = localStorage.getItem('token');
    const { album, setAlbum } = useContext(APIContext);
    const [load, setLoad] = useState(true);
    let navigate = useNavigate();
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
                    const response = await axios.get('https://musicplayer-production-5daf.up.railway.app/api/album/all', config);
                    setAlbum(response.data.albums);
                    setLoad(false);
                } catch (error) {
                    console.log(error);
                    setLoad(false);
                }
            }
            fetchData();
        }, 1000)
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, []);

    const handleViewMore = id => {
        navigate(`/albumes/${id}`);
    };

    const handleDelete = async id => {
        if (window.confirm('Estas seguro?')) {
            try {
                const response = await axios.delete(`https://musicplayer-production-5daf.up.railway.app/api/album/${id}`, config);
                setAlbum(album.filter(a => {
                    return a.id !== id;
                }))
                toast((t) => (
                    <span className='fw-bold'>{response.data.status}</span>
                ), { icon: '🗑️' });
            } catch (error) {
                toast.error('No se puede eliminar el album ya que tiene ligado una o varias canciones')
            }
        } else {
            toast((t) => (
                <span className='fw-bold'>No se eliminó el album</span>
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
                        <ModalAlbum />
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
                        gap={2}
                    >
                        {
                            album.map && album.map((a, i) => (
                                <Box
                                    role={'group'}
                                    p={6}
                                    maxW={'290px'}
                                    w={'full'}
                                    boxShadow={'lg'}
                                    rounded={'lg'}
                                    key={i}
                                    pos={'relative'}
                                    zIndex={1}>
                                    <Center>
                                        <Image
                                            rounded={'lg'}
                                            w={'200px'}
                                            objectFit={'cover'}
                                            src={a.album_pic}
                                        />
                                    </Center>
                                    <Stack pt={5} align={'center'}>
                                        <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
                                            {a.artist}
                                        </Text>
                                        <Heading textAlign={'center'} fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
                                            {a.name}
                                        </Heading>
                                        <Stack direction={'row'} align={'center'}>
                                            <Text fontWeight={800} fontSize={'xl'}>
                                                {a.song_count}
                                            </Text>
                                            <Text color={'gray.600'}>
                                                Canciones
                                            </Text>
                                        </Stack>
                                        <Stack mt={8} direction={'row'} spacing={4} w={'full'}>
                                            <Button
                                                flex={1}
                                                fontSize={'sm'}
                                                rounded={'full'}
                                                bg={'purple.400'}
                                                color={'white'}
                                                w={'full'}
                                                boxShadow={
                                                    '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                                                }
                                                _hover={{
                                                    bg: 'purple.500',
                                                }}
                                                _focus={{
                                                    bg: 'purple.500',
                                                }}
                                                onClick={() => handleViewMore(a.album_id)}
                                            >
                                                Ver album
                                            </Button>
                                        </Stack>
                                    </Stack>
                                    {
                                        auth.is_admin && (
                                            <Stack direction={'row'} spacing='24px' py={2}>
                                                <Button variant={'outline'} colorScheme={'red'} onClick={() => handleDelete(a.album_id)} w={'full'}>
                                                    <DeleteIcon />
                                                </Button>
                                                {/* <ModalEditAlbum id={a.album_id} /> */}
                                            </Stack>
                                        )
                                    }
                                </Box>
                            ))
                        }
                    </Wrap>
                )
            }
        </Stack>
    )
};
