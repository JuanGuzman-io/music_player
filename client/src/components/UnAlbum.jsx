import { Center, Divider, Flex, Heading, HStack, IconButton, Image, ListItem, OrderedList, Stack, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { APIContext } from '../context/APIContext';
import ModalCanciones from './ModalCancion';
import ReactAudioPlayer from 'react-audio-player';
import AuthContext from '../context/AuthProvider';
import { DeleteIcon } from '@chakra-ui/icons';
import toast from 'react-hot-toast';
import { m } from 'framer-motion';

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
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`http://localhost:3400/api/album/${id}`, config);
            console.log(response);
            setName(response.data.album.name);
            setDescription(response.data.album.description);
            setReleaseDate(response.data.album.release_date);
            setAlbumPic(response.data.album.album_pic);
            setArtist(response.data.album.artist);
        }
        fetchData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const fetchData = async () => {
                const response = await axios.get(`http://localhost:3400/api/song/all/${id}`, config);
                setSong(response.data.songs);
            }
            fetchData();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const deleteSong = async id => {
        if (window.confirm('Estas seguro?')) {
            try {
                const response = await axios.delete(`http://localhost:3400/api/song/${id}`, config);
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
                <HStack>
                    <Image boxSize='200px' src={albumPic} alt='Album' rounded={4} />
                    <Stack>
                        <Text fontSize={'2xl'}>{artist}</Text>
                        <Text fontSize={'4xl'} fontWeight={'bold'}>{name}</Text>
                        <Text fontSize={'xl'}>{description}</Text>
                        <Text>{(new Date(releaseDate).toLocaleDateString())}</Text>
                    </Stack>
                </HStack>
            </Center>
            {
                auth.is_admin && (
                    <Stack>
                        <ModalCanciones />
                    </Stack>
                )
            }
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
                                    <Text fontSize={'lg'} fontWeight={'bold'}>{s.title}, {s.name}</Text>
                                </ListItem>
                                <HStack>
                                    <ReactAudioPlayer
                                        src={s.file}
                                        controls
                                    />
                                    <IconButton
                                        colorScheme='red'
                                        rounded={'full'}
                                        aria-label='Search database'
                                        icon={<DeleteIcon />}
                                        onClick={() => deleteSong(s.song_id)}
                                    />
                                </HStack>
                            </Flex>
                            <Divider />
                        </Stack>
                    ))
                }

            </OrderedList>
        </Stack>
    )
};
