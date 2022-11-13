import { Box, Button, Heading, Stack, Text, Wrap } from '@chakra-ui/react';
import { useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import ModalForm from '../components/ModalForm';
import { DeleteIcon } from '@chakra-ui/icons';
import toast from 'react-hot-toast';
import { APIContext } from '../context/APIContext';
import { useNavigate } from 'react-router-dom';

export default function Genero(type) {
    let navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { gender, setGender } = useContext(APIContext);
    const token = localStorage.getItem('token');
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
                    const response = await axios.get('http://localhost:3400/api/gender/all', config);
                    setGender(response.data.gender);
                } catch (error) {
                    console.log(error);
                }
            }
            fetchData();
        }, 1000);
        return () => clearInterval(interval);
        // eslint-disable-next-lin
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Estas seguro?')) {
            try {
                const response = await axios.delete(`http://localhost:3400/api/gender/${id}`, config);
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
            <Wrap
                spacing='3.125rem'
                py={4}
                mt={10}
            >
                {
                    gender.map && gender.map(gender => (
                        <Box
                            key={gender.gender_id}
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
                                        {gender.name}
                                    </Heading>
                                    <Text
                                        color={'gray.500'}
                                    >{gender.description}</Text>
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
                                        onClick={() => handleViewMore(gender.gender_id)}
                                    >
                                        Ver canciones
                                    </Button>
                                    {
                                        auth.is_admin && (
                                            <Stack direction={'row'} spacing='24px' py={2}>
                                                <Button variant={'outline'} colorScheme={'red'} onClick={() => handleDelete(gender.gender_id)} w={'full'}>
                                                    <DeleteIcon />
                                                </Button>
                                            </Stack>
                                        )
                                    }
                                </Stack>
                            </Box>
                        </Box>
                    ))
                }
            </Wrap>
        </Stack>
    )
};
