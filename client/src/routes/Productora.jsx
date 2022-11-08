import { Box, Button, Heading, Link, Stack, Text, Wrap } from '@chakra-ui/react';
import { useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import ModalForm from '../components/ModalForm';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { APIContext } from '../context/APIContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Productora() {
    let navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { label, setLabel } = useContext(APIContext);
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const typeURL = 'label';
    const typeName = 'Disquera / Productora';

    useEffect(() => {
        const interval = setInterval(() => {
            const fetchData = async () => {
                try {
                    const response = await axios.get('http://localhost:3400/api/label/label-artist', config);
                    setLabel(response.data.label);
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
            await axios.delete(`http://localhost:3400/api/label/${id}`, config);
            setLabel(label.filter(label => {
                return label.labe_id !== id;
            }))
            toast((t) => (
                <span className='fw-bold'>{typeName} eliminado</span>
            ), { icon: '🗑️' });
        } else {
            toast((t) => (
                <span className='fw-bold'>No se eliminó la {typeName}</span>
            ), { icon: '❗' });
        }
    }

    const handleViewMore = id => {
        navigate(`/productoras/${id}`);
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
                    label.map && label.map(label => (
                        <Box
                            key={label.label_id}
                            maxW={'270px'}
                            w={'full'}
                            boxShadow={'lg'}
                            rounded={'md'}
                            overflow={'hidden'}>
                            <Box p={6}>
                                <Stack spacing={0} align={'center'} mb={5}>
                                    <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                                        {label.name}
                                    </Heading>
                                    <Text color={'gray.500'}>{label.description}</Text>
                                </Stack>

                                <Stack direction={'row'} justify={'center'} spacing={6}>
                                    <Stack spacing={0} align={'center'}>
                                        <Text fontWeight={600}>{label.artist}</Text>
                                        <Text fontSize={'sm'} color={'gray.500'}>
                                            Artistas firmados
                                        </Text>
                                    </Stack>
                                </Stack>
                                <Button
                                    w={'full'}
                                    mt={8}
                                    color={'white'}
                                    colorScheme={'purple'}
                                    rounded={'md'}
                                    _hover={{
                                        transform: 'translateY(-2px)',
                                        boxShadow: 'lg',
                                    }}
                                    onClick={() => handleViewMore(label.label_id)}
                                >
                                    Ver artistas
                                </Button>
                                {
                                    auth.is_admin && (
                                        <Stack py={2} direction={'row'} w={'fit-content'}>
                                            <Button variant={'outline'} colorScheme={'red'} onClick={() => handleDelete(label.label_id)}>
                                                <DeleteIcon />
                                            </Button>
                                            <Button variant={'outline'} colorScheme={'blue'} onClick={() => handleViewMore(label.label_id)}>
                                                <EditIcon />
                                            </Button>
                                        </Stack>
                                    )
                                }
                            </Box>
                        </Box>
                    ))
                }
            </Wrap>
        </Stack>
    )
};
