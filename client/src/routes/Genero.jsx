import { Box, Button, Center, Heading, Spinner, Stack, Text, VStack, Wrap } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import ModalForm from '../components/add/ModalForm';
import { DeleteIcon } from '@chakra-ui/icons';
import toast from 'react-hot-toast';
import { APIContext } from '../context/APIContext';
import { useNavigate } from 'react-router-dom';
import ModalEditGender from '../components/edit/ModalEditGender';

export default function Genero(type) {
    let navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { gender, setGender } = useContext(APIContext);
    const token = localStorage.getItem('token');
    const [load, setLoad] = useState(true);
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const typeURL = 'gender';
    const typeName = 'Genero';

    useEffect(() => {
        const interval = setInterval(() => {
            const fetchData = async () => {
                try {
                    const response = await axios.get('https://musicplayer-production-5daf.up.railway.app/api/gender/all', config);
                    setGender(response.data.gender);
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

    const handleDelete = async (id) => {
        if (window.confirm('Estas seguro?')) {
            try {
                const response = await axios.delete(`https://musicplayer-production-5daf.up.railway.app/api/gender/${id}`, config);
                console.log(response);
                setGender(gender.filter(genero => {
                    return genero.id !== id;
                }))
                toast((t) => (
                    <span className='fw-bold'>{response.data.status}</span>
                ), { icon: '🗑️' });
            } catch (error) {
                toast.error('No se puede eliminar el genero ya que tiene ligado un artista o canción')
            }
        } else {
            toast((t) => (
                <span className='fw-bold'>No se eliminó el genero</span>
            ), { icon: '❗' });
        }
    };

    const handleViewMore = id => {
        navigate(`/generos/${id}`);
    };

    return (
        <Stack>
            {
                auth.is_admin && (
                    <Stack
                        py={5}
                        width={'fit-content'}
                    >
                        <ModalForm type={typeURL} title={typeName} />
                    </Stack>
                )
            }
            {
                load ? (
                    <Center pt={4}>
                        <VStack>
                            <Spinner size='xl' />
                            <Text>Cargando...</Text>
                        </VStack>
                    </Center>
                ) : (
                    <Wrap
                        spacing='3.125rem'
                        py={4}
                        mt={10}
                    >
                        {
                            gender.map && gender.map(g => (
                                <Box
                                    key={g.gender_id}
                                    maxW={'360px'}
                                    w={'full'}
                                    h={'400px'}
                                    boxShadow={'lg'}
                                    rounded={'md'}
                                    overflow={'hidden'}
                                >
                                    <Box
                                        p={6}
                                        display={'flex'}
                                        flexDirection={'column'}
                                        justifyContent={'space-between'}
                                        h={'100%'}
                                    >
                                        <Stack
                                            spacing={6}
                                            align={'center'}
                                            mb={5}
                                        >
                                            <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                                                {g.name}
                                            </Heading>
                                            <Text
                                                color={'gray.500'}
                                            >{g.description}</Text>
                                        </Stack>
                                        <Stack>
                                            <Button
                                                w={'full'}
                                                color={'white'}
                                                colorScheme={'purple'}
                                                rounded={'md'}
                                                _hover={{
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: 'lg',
                                                }}
                                                onClick={() => handleViewMore(g.gender_id)}
                                            >
                                                Ver canciones
                                            </Button>
                                            {
                                                auth.is_admin && (
                                                    <Stack direction={'row'} spacing='24px' py={2}>
                                                        <Button variant={'outline'} colorScheme={'red'} onClick={() => handleDelete(g.gender_id)} w={'full'}>
                                                            <DeleteIcon />
                                                        </Button>
                                                        <ModalEditGender id={g.gender_id} />
                                                    </Stack>
                                                )
                                            }
                                        </Stack>
                                    </Box>
                                </Box>
                            ))
                        }
                    </Wrap>
                )
            }
        </Stack>
    )
};
