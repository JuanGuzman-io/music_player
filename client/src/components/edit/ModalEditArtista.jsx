import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Text,
    Textarea,
    HStack,
    VStack,
    Center,
    CircularProgress,
    CircularProgressLabel,
    Flex,
    Avatar,
    AvatarBadge,
    IconButton,
    FormHelperText,
} from '@chakra-ui/react'
import { EditIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { storage } from '../../lib';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { useContext } from 'react';
import AuthContext from '../../context/AuthProvider';

export default function ModalEditArtista({ id }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { auth } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [aka, setAka] = useState('');
    const [description, setDescription] = useState('');
    const [birth_place, setBirth_place] = useState('');
    const [birth_day, setBirth_day] = useState('');
    const [imageURL, setImageURL] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/artist/${id}`, config);
                setName(response.data.artist.name);
                setAka(response.data.artist.aka);
                setDescription(response.data.artist.description);
                setBirth_place(response.data.artist.birth_place);
                setBirth_day(response.data.artist.birth_day);
                setImageURL(response.data.artist.profile_pic);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
        // eslint-disable-next-line
    }, []);

    const [upload, setUpload] = useState(false);
    const [progress, setProgress] = useState(0);

    const uploadFile = e => {
        const file = Array.from(e.target.files)[0];
        const extension = file.type.split('/')[1];

        const imageRef = ref(storage, `artists/${auth.user_id}/${Date.now()}.${extension}`);
        setUpload(true);

        const uploadTask = uploadBytesResumable(imageRef, file);

        uploadTask.on('state_changed',
            snapshot => {
                const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(pct);
            });

        uploadBytes(imageRef, file)
            .then(snapshot => {
                getDownloadURL(snapshot.ref)
                    .then(url => {
                        setImageURL(url);
                    })
            });
    }

    const handleUpdate = async e => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/api/artist/patch/${id}`, {
                name,
                aka,
                description,
                birth_place,
                birth_day,
                profile_pic: imageURL
            }, config);
            toast.success('Se actualizó el artista correctamente!');
        } catch (error) {
            console.log(error);
            toast.error('Ocurrio un error al actualizar el artista');
        }
    }

    const deleteImage = () => {
        if (window.confirm('Estas seguro?')) {
            setImageURL('');
            setUpload(false);
        }
    }

    return (
        <>
            <Button onClick={onOpen} variant={'outline'} colorScheme={'blue'} w={'full'}>
                <EditIcon />
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Editar artista {name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack as={'form'} onSubmit={handleSubmit(handleUpdate)} spacing={4} noValidate>
                            <FormControl id='profile_pic'>
                                <FormLabel>Imagen del artista</FormLabel>
                                <Stack direction={['column', 'row']} spacing={6}>
                                    <Center w='full'>
                                        {
                                            !upload && !imageURL ? (
                                                <VStack w={'100%'}>
                                                    <Input
                                                        type={'file'}
                                                        w='full'
                                                        name='profile_pic'
                                                        id='profile_pic'
                                                        {...register('profile_pic', {
                                                            required: { value: true, message: 'La foto del artista es obligatorio' }
                                                        })}
                                                        accept='image/*'
                                                        onChange={uploadFile}
                                                    />
                                                    {errors.profile_pic && <Text color={'red'} fontSize={'sm'}>{errors.profile_pic.message}</Text>}
                                                </VStack>
                                            ) : (
                                                <>
                                                    {
                                                        !imageURL && (
                                                            <CircularProgress value={progress}>
                                                                <CircularProgressLabel>{progress}%</CircularProgressLabel>
                                                            </CircularProgress>
                                                        )
                                                    }
                                                </>
                                            )
                                        }
                                        {
                                            imageURL && (
                                                <Flex
                                                    alignItems={'center'}
                                                    gap={4}
                                                >
                                                    <Avatar size="xl" src={imageURL}>
                                                        <AvatarBadge
                                                            as={IconButton}
                                                            size="sm"
                                                            rounded="full"
                                                            top="-10px"
                                                            colorScheme="red"
                                                            aria-label="remove Image"
                                                            icon={<SmallCloseIcon />}
                                                            onClick={deleteImage}
                                                        />
                                                    </Avatar>
                                                </Flex>
                                            )
                                        }
                                    </Center>
                                </Stack>
                            </FormControl>
                            <HStack>
                                <FormControl id='userName' isRequired>
                                    <FormLabel>Nombre</FormLabel>
                                    <Input
                                        placeholder='Nombre del cantante'
                                        type='text'
                                        name='name'
                                        id='name'
                                        {...register('name', {
                                            required: { value: true, message: 'El nombre es obligatorio' }
                                        })}
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                    {errors.name && <Text color={'red'} fontSize={'sm'}>{errors.name.message}</Text>}
                                </FormControl>
                                <FormControl id='aka' isRequired>
                                    <FormLabel>Nombre artistico</FormLabel>
                                    <Input
                                        placeholder='Nombre artistico'
                                        type='text'
                                        name='aka'
                                        id='aka'
                                        {...register('aka', {
                                            required: { value: true, message: 'El nombre artistico es obligatorio' }
                                        })}
                                        value={aka}
                                        onChange={e => setAka(e.target.value)}
                                    />
                                    {errors.aka && <Text color={'red'} fontSize={'sm'}>{errors.aka.message}</Text>}
                                </FormControl>
                            </HStack>
                            <FormControl id='description' isRequired>
                                <FormLabel>Descripción</FormLabel>
                                <Textarea
                                    placeholder='Descripción...'
                                    type='text'
                                    name='description'
                                    id='description'
                                    {...register('description', {
                                        required: { value: true, message: 'La description es obligatoria' }
                                    })}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                                {errors.description && <Text color={'red'} fontSize={'sm'}>{errors.description.message}</Text>}
                            </FormControl>
                            <HStack>
                                <FormControl id='brith_date' isRequired>
                                    <FormLabel>Fecha de nacimiento</FormLabel>
                                    <Input
                                        type='text'
                                        placeholder='AAAA-MM-DD'
                                        name='brith_day'
                                        id='brith_day'
                                        {...register('brith_day', {
                                            required: { value: true, message: 'La fecha de nacimiento es obligatoria' },
                                            pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Ingrese una fecha validad' }
                                        })}
                                        value={birth_day}
                                        onChange={e => setBirth_day(e.target.value)}
                                    />
                                    <FormHelperText>Formato fecha: AAAA-MM-DD</FormHelperText>
                                    {errors.brith_day && <Text color={'red'} fontSize={'sm'}>{errors.brith_day.message}</Text>}
                                </FormControl>
                                <FormControl id='birth_place' isRequired>
                                    <FormLabel>Lugar de nacimiento</FormLabel>
                                    <Input
                                        placeholder='Cali, Colombia'
                                        type='text'
                                        name='birth_place'
                                        id='birth_place'
                                        {...register('birth_place', {
                                            required: { value: true, message: 'El lugar de naciemiento es obligatorio' }
                                        })}
                                        value={birth_place}
                                        onChange={e => setBirth_place(e.target.value)}
                                    />
                                    <FormHelperText>Formato: Ciudad, País</FormHelperText>
                                    {errors.birth_place && <Text color={'red'} fontSize={'sm'}>{errors.birth_place.message}</Text>}
                                </FormControl>
                            </HStack>
                            <Button variant='outline' colorScheme={'purple'} type={'submit'}>Guardar</Button>
                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        <ModalFooter>
                            <Button colorScheme='red' mr={3} onClick={onClose}>
                                Cerrar
                            </Button>
                        </ModalFooter>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
};
