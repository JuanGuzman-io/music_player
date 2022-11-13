import { Center, Divider, Flex, HStack, IconButton, Image, ListItem, OrderedList, Spinner, Stack, Text, VStack, Wrap } from '@chakra-ui/react';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { APIContext } from '../context/APIContext';
import ModalCanciones from '../components/add/ModalCancion';
import ReactAudioPlayer from 'react-audio-player';
import AuthContext from '../context/AuthProvider';
import { DeleteIcon } from '@chakra-ui/icons';
import toast from 'react-hot-toast';

export default function UnAlbum(params) {
    const { id } = useParams();
    const { song, setSong } = useContext(APIContext);
    const token = localStorage.getItem('token');
    const { auth } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [albumPic, setAlbumPic] = useState('');
    const [artist, setArtist] = useState('');
    const [load, setLoad] = useState(true);
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`https://musicplayer-production-5daf.up.railway.app/api/album/${id}`, config);
            console.log(response);
            setName(response.data.album.name);
            setDescription(response.data.album.description);
            setReleaseDate(response.data.album.release_date);
            setAlbumPic(response.data.album.album_pic);
            setArtist(response.data.album.artist);
        }
        fetchData();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`https://musicplayer-production-5daf.up.railway.app/api/song/all/${id}`, config);
                    setSong(response.data.songs);
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

    const deleteSong = async id => {
        if (window.confirm('Estas seguro?')) {
            try {
                const response = await axios.delete(`https://musicplayer-production-5daf.up.railway.app/api/song/${id}`, config);
                setSong(song.filter(song => {
                    return song.id !== id;
                }))
                toast((t) => (
                    <span className='fw-bold'>{response.data.status}</span>
                ), { icon: '🗑️' });
            } catch (error) {
                toast.error('No se puede eliminar la canción')
            }
        } else {
            toast((t) => (
                <span className='fw-bold'>No se eliminó la canción</span>
            ), { icon: '❗' });
        }
    }

    return (
        <Stack
            py={4}
            mt={20}
            w={'container.sm'}
            margin={'0 auto'}
        >
            <Center>
                <Wrap gap={20}>
                    <Image boxSize='200px' src={albumPic} alt='Album' rounded={4} />
                    <Stack>
                        <Text fontSize={'2xl'}>{artist}</Text>
                        <Text fontSize={'4xl'} fontWeight={'bold'}>{name}</Text>
                        <Text fontSize={'xl'}>{description}</Text>
                        <Text>{(new Date(releaseDate).toLocaleDateString())}</Text>
                    </Stack>
                </Wrap>
            </Center>
            {
                auth.is_admin && (
                    <Stack>
                        <ModalCanciones />
                    </Stack>
                )
            }
            {
                load ? (
                    <Center mt={2}>
                        <VStack>
                            <Spinner size='xl' />
                            <Text>Cargando...</Text>
                        </VStack>
                    </Center>
                ) : (

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
                                        <ListItem>
                                            <Text fontSize={'lg'} fontWeight={'bold'}>{s.title}</Text>
                                            {
                                                s.feature && (
                                                    <Text fontSize={'lg'} fontWeight={'medium'}>FT {s.feature}</Text>
                                                )
                                            }
                                        </ListItem>
                                        <HStack>
                                            <ReactAudioPlayer
                                                src={s.file}
                                                controls
                                            />
                                            {
                                                auth.is_admin && (
                                                    <IconButton
                                                        colorScheme='red'
                                                        rounded={'full'}
                                                        aria-label='Search database'
                                                        icon={<DeleteIcon />}
                                                        onClick={() => deleteSong(s.song_id)}
                                                    />
                                                )
                                            }
                                        </HStack>
                                    </Flex>
                                    <Divider />
                                </Stack>
                            ))
                        }

                    </OrderedList>
                )
            }
        </Stack>
    )
};
