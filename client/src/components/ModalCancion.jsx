import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Input,
    FormControl,
    FormLabel,
    Text,
    Stack,
    Textarea,
    Select,
    FormHelperText,
    Center,
    CircularProgress,
    CircularProgressLabel,
    Image,
    Flex,
    Highlight,
    Badge,
    IconButton,
    Checkbox,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { APIContext } from '../context/APIContext';
import AuthContext from '../context/AuthProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { storage } from '../lib';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { DeleteIcon } from '@chakra-ui/icons';

export default function ModalCanciones() {
    const { id } = useParams();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { addSong, gender, setGender, artist, setArtist } = useContext(APIContext);
    const [name, setName] = useState('');
    const [isSingle, setIsSingle] = useState(true);
    const token = localStorage.getItem('token');
    const { auth } = useContext(AuthContext);
    let navigate = useNavigate();

    let url = '';

    const [upload, setUpload] = useState(false);
    const [progress, setProgress] = useState(0);
    const [audioURL, setAudioURL] = useState(url);

    const uploadFile = e => {
        const file = Array.from(e.target.files)[0];
        const extension = file.type.split('/')[1];

        const imageRef = ref(storage, `songs/${auth.user_id}/${Date.now()}.${extension}`);
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
                        setAudioURL(url);
                    })
            });
    }


    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        const fetchLabel = async () => {
            try {
                const response = await axios.get('http://localhost:3400/api/gender/all', config);
                setGender(response.data.gender);
            } catch (e) {
                console.log(e);
            }
        }
        fetchLabel();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const fetchLabel = async () => {
            try {
                const response = await axios.get('http://localhost:3400/api/artist/all', config);
                setArtist(response.data.artists);
            } catch (e) {
                console.log(e);
            }
        }
        fetchLabel();
        // eslint-disable-next-line
    }, []);

    const handleSingle = () => setIsSingle(value => !value)

    const handleSave = async ({ gender_fk, feature }) => {
        try {
            const response = await axios.post(`http://localhost:3400/api/song/new`, {
                album_fk: String(id),
                title: name,
                gender_fk,
                is_single: isSingle,
                file: audioURL,
            }, config);
            addSong(response.data.album);
            toast.success(`Se agrego ${name} con satisfacción`);
            navigate(`/albums/${id}`);
            onClose();
        } catch (error) {
            toast.error(error.response);
        }
    }

    const deleteSong = () => {
        if (window.confirm('Estas seguro?')) {
            setAudioURL('');
            setUpload(false);
        }
    }

    return (
        <>
            <Button
                onClick={onOpen}
                variant={'outline'}
                color={'purple.600'}
                _hover={{
                    borderColor: 'purple.700',
                }}
            >Añadir canción</Button>

            <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Añadir canción</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack as={'form'} onSubmit={handleSubmit(handleSave)} spacing={4} noValidate>
                            <FormControl id='userName'>
                                <FormLabel>Canción</FormLabel>
                                <Stack direction={['column', 'row']} spacing={6}>
                                    <Center w='full'>
                                        {
                                            !upload && !audioURL ? (
                                                <Input
                                                    type={'file'}
                                                    w='full'
                                                    name='file'
                                                    id='file'
                                                    {...register('file', {
                                                        required: { value: true, message: 'El nombre es obligatorio' }
                                                    })}
                                                    accept='audio/*'
                                                    onChange={uploadFile}
                                                />
                                            ) : (
                                                <>
                                                    {
                                                        !audioURL && (
                                                            <CircularProgress value={progress}>
                                                                <CircularProgressLabel>{Math.trunc(progress)}%</CircularProgressLabel>
                                                            </CircularProgress>
                                                        )
                                                    }
                                                </>
                                            )
                                        }
                                        {
                                            audioURL && (
                                                <Flex
                                                    alignItems={'center'}
                                                    gap={4}
                                                >
                                                    <Image
                                                        boxSize='50px'
                                                        objectFit='cover'
                                                        src='/itunes.png'
                                                        alt={'Album portada'}
                                                        borderRadius={'lg'}
                                                    />
                                                    <Badge ml='1' colorScheme='green'>
                                                        Tu canción ya esta con nosotros!
                                                    </Badge>
                                                    <IconButton
                                                        colorScheme='red'
                                                        rounded={'full'}
                                                        aria-label='Search database'
                                                        icon={<DeleteIcon />}
                                                        onClick={deleteSong}
                                                    />
                                                </Flex>
                                            )
                                        }
                                    </Center>
                                </Stack>
                            </FormControl>
                            <FormControl id='userName' isRequired>
                                <FormLabel>Nombre</FormLabel>
                                <Input
                                    placeholder='Nombre de la canción'
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
                            <FormControl id='gender_fk' isRequired>
                                <FormLabel>Genero de la canción</FormLabel>
                                <Select
                                    placeholder='Selecciona'
                                    name='gender_fk'
                                    id='gender_fk'
                                    {...register('gender_fk', {
                                        required: { value: true, message: 'El genero es requerido' }
                                    })}
                                >
                                    {
                                        gender.map && gender.map((g, i) => {
                                            const { gender_id, name } = g;
                                            return (
                                                <option key={gender_id} value={gender_id}>{name}</option>
                                            )
                                        })
                                    }
                                </Select>
                                {errors.gender_fk && <Text color={'red'} fontSize={'sm'}>{errors.gender_fk.message}</Text>}
                            </FormControl>
                            <FormControl>
                                <Checkbox
                                    value={isSingle}
                                    onChange={handleSingle}
                                >Es un single?</Checkbox>
                            </FormControl>
                            {
                                isSingle && (
                                    <FormControl id='userName'>
                                        <FormLabel>Artista</FormLabel>
                                        <Select
                                            placeholder='Selecciona'
                                            name='feature'
                                            id='feature'
                                            {...register('feature')}
                                        >
                                            {
                                                artist.map && artist.map((g, i) => {
                                                    const { artist_fk, aka } = g;
                                                    return (
                                                        <option key={i} value={artist_fk}>{aka}</option>
                                                    )
                                                })
                                            }
                                        </Select>
                                        {errors.feature && <Text color={'red'} fontSize={'sm'}>{errors.feature.message}</Text>}
                                    </FormControl>
                                )
                            }
                            <Button variant='outline' colorScheme={'purple'} type={'submit'}>Guardar</Button>
                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={onClose}>
                            Cerrar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}