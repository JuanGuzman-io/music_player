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
    VStack,
    Center,
    CircularProgress,
    CircularProgressLabel,
    Flex,
    Avatar,
    AvatarBadge,
    IconButton,
    FormHelperText,
} from '@chakra-ui/react';
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

export default function ModalEditAlbum({ id }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { auth } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [release_date, setRelease_date] = useState('');
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
                const response = await axios.get(`https://musicplayer-production-5daf.up.railway.app/api/album/${id}`, config);
                setName(response.data.album.name);
                setDescription(response.data.album.description);
                setRelease_date(response.data.album.release_date);
                setImageURL(response.data.album.album_pic);
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

        const imageRef = ref(storage, `album/${auth.user_id}/${Date.now()}.${extension}`);
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
            const response = await axios.patch(`https://musicplayer-production-5daf.up.railway.app/api/album/${id}`, {
                name,
                description,
                release_date,
                album_pic: imageURL
            }, config);
            console.log("🚀 ~ file: ModalEditAlbum.jsx ~ line 105 ~ handleUpdate ~ response", response)
            toast.success('Se actualizó el album correctamente!');
            setImageURL('');
            setUpload(false);
            onClose();
        } catch (error) {
            console.log(error);
            toast.error('Ocurrio un error al actualizar el album');
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
                    <ModalHeader>Editar album {name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack as={'form'} onSubmit={handleUpdate} spacing={4} noValidate>
                            <FormControl id='userName'>
                                <FormLabel>Imagen del artista</FormLabel>
                                <Stack direction={['column', 'row']} spacing={6}>
                                    <Center w='full'>
                                        {
                                            !upload && !imageURL ? (
                                                <VStack w={'100%'}>
                                                    <Input
                                                        type={'file'}
                                                        w='full'
                                                        name='album_pic'
                                                        id='album_pic'
                                                        {...register('album_pic', {
                                                            required: { value: true, message: 'La foto del artista es obligatorio' }
                                                        })}
                                                        accept='image/*'
                                                        onChange={uploadFile}
                                                    />
                                                    {errors.album_pic && <Text color={'red'} fontSize={'sm'}>{errors.album_pic.message}</Text>}
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
                            <FormControl id='release_date' isRequired>
                                <FormLabel>Fecha de lanzamiento</FormLabel>
                                <Input
                                    type='text'
                                    placeholder='AAAA-MM-DD'
                                    name='release_date'
                                    id='release_date'
                                    {...register('release_date', {
                                        required: { value: true, message: 'La fecha de nacimiento es obligatoria' },
                                        pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Ingrese una fecha validad' }
                                    })}
                                    value={release_date}
                                    onChange={e => setRelease_date(e.target.value)}
                                />
                                <FormHelperText>Formato fecha: AAAA-MM-DD</FormHelperText>
                                {errors.release_date && <Text color={'red'} fontSize={'sm'}>{errors.release_date.message}</Text>}
                            </FormControl>
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
