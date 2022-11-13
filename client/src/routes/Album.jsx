import { Box, Button, Center, Heading, Image, Stack, Text, Wrap } from '@chakra-ui/react';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalAlbum from '../components/ModalAlbum';
import { APIContext } from '../context/APIContext';
import AuthContext from '../context/AuthProvider';

export default function Album(params) {
    const { auth } = useContext(AuthContext);
    const token = localStorage.getItem('token');
    const { album, setAlbum } = useContext(APIContext);
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
                    const response = await axios.get('http://localhost:3400/api/album/all', config);
                    setAlbum(response.data.albums);
                } catch (error) {
                    console.log(error);
                }
            }
            fetchData();
        }, 1000);
        return () => clearInterval(interval);
        // eslint-disable-next-lin
    }, []);

    const handleViewMore = id => {
        navigate(`/albums/${id}`);
    };

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
                        </Box>
                    ))
                }
            </Wrap>
        </Stack>
    )
};
