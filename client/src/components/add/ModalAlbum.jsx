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
    VStack,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { APIContext } from '../../context/APIContext';
import AuthContext from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../lib';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';

export default function ModalAlbum({ type, title }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [release_date, setRelease_date] = useState('');
    const [artistfk, setArtistfk] = useState([]);
    const { addAlbum } = useContext(APIContext);
    const token = localStorage.getItem('token');
    const { auth } = useContext(AuthContext);
    let navigate = useNavigate();

    let url = '';

    const [upload, setUpload] = useState(false);
    const [progress, setProgress] = useState(0);
    const [imageURL, setImageURL] = useState(url);

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


    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        const fetchLabel = async () => {
            try {
                const response = await axios.get('https://musicplayer-production-5daf.up.railway.app/api/artist/all', config);
                setArtistfk(response.data.artists);
            } catch (e) {
                console.log(e);
            }
        }
        fetchLabel();
        // eslint-disable-next-line
    }, []);

    const handleSave = async ({ artist_fk }) => {
        try {
            const response = await axios.post(`https://musicplayer-production-5daf.up.railway.app/api/album/new`, {
                name,
                description,
                release_date,
                artist_fk,
                album_pic: imageURL
            }, config);
            addAlbum(response.data.album);
            toast.success(`Se creo ${name} con satisfacción`);
            setName('');
            setDescription('');
            setRelease_date('');
            navigate('/albumes');
            onClose();
        } catch (error) {
            toast.error(error.response);
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
            >Añadir album</Button>

            <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Añadir album</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack as={'form'} onSubmit={handleSubmit(handleSave)} spacing={4} noValidate>
                            <FormControl id='userName'>
                                <FormLabel>Portada del album</FormLabel>
                                <Stack direction={['column', 'row']} spacing={6}>
                                    <Center w='full'>
                                        {
                                            !upload && !imageURL ? (
                                                <VStack w={'100%'} textAlign={'left'}>
                                                    <Input
                                                        type={'file'}
                                                        w='full'
                                                        name='album_pic'
                                                        id='album_pic'
                                                        {...register('album_pic', {
                                                            required: { value: true, message: 'La portada del album es obligatoria' }
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
                                                    <Image
                                                        boxSize='150px'
                                                        objectFit='cover'
                                                        src={imageURL}
                                                        alt={'Album portada'}
                                                        borderRadius={'lg'}
                                                        boxShadow={'lg'}
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
                                    placeholder='Nombre del album'
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
                                        required: { value: true, message: 'La fecha de lanzamiento es obligatoria' },
                                        pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Ingrese una fecha validad' }
                                    })}
                                    value={release_date}
                                    onChange={e => setRelease_date(e.target.value)}
                                />
                                <FormHelperText>Formato fecha: AAAA-MM-DD</FormHelperText>
                                {errors.release_date && <Text color={'red'} fontSize={'sm'}>{errors.release_date.message}</Text>}
                            </FormControl>
                            <FormControl id='artist_fk' isRequired>
                                <FormLabel>Artista</FormLabel>
                                <Select
                                    placeholder='Selecciona'
                                    name='artist_fk'
                                    id='artist_fk'
                                    {...register('artist_fk', {
                                        required: { value: true, message: 'El artista es obligatorio' }
                                    })}
                                >
                                    {
                                        artistfk.map && artistfk.map((a, i) => {
                                            const { artist_id, aka } = a;
                                            return (
                                                <option key={artist_id} value={artist_id}>{aka}</option>
                                            )
                                        })
                                    }
                                </Select>
                                {errors.artist_fk && <Text color={'red'} fontSize={'sm'}>{errors.artist_fk.message}</Text>}
                            </FormControl>
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