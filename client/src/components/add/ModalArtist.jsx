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
    Center,
    Avatar,
    Select,
    Flex,
    CircularProgress,
    CircularProgressLabel,
    HStack,
    AvatarBadge,
    IconButton,
    FormHelperText,
    VStack,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { APIContext } from '../../context/APIContext';
import { storage } from '../../lib';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import AuthContext from '../../context/AuthProvider';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

export default function ModalArtist({ type, title }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState('');
    const [aka, setAka] = useState('');
    const [description, setDescription] = useState('');
    const [birth_day, setBirth_day] = useState('');
    const [birth_place, setBirth_place] = useState('');
    const [labelFk, setLabelFk] = useState([]);
    const [genderFk, setGenderFk] = useState([]);
    const { addArtist } = useContext(APIContext);
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


    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        const fetchLabel = async () => {
            try {
                const response = await axios.get('https://musicplayer-production-5daf.up.railway.app/api/label/all', config);
                setLabelFk(response.data.label);
            } catch (e) {
                console.log(e);
            }
        }
        fetchLabel();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const fetchGender = async () => {
            try {
                const response = await axios.get('https://musicplayer-production-5daf.up.railway.app/api/gender/all', config);
                setGenderFk(response.data.gender);
            } catch (e) {
                console.log(e);
            }
        }
        fetchGender();
        // eslint-disable-next-line
    }, []);

    const deleteImage = () => {
        if (window.confirm('Estas seguro?')) {
            setImageURL('');
            setUpload(false);
        }
    }

    const handleSave = async ({ label_fk, gender_fk }) => {
        try {
            const response = await axios.post(`https://musicplayer-production-5daf.up.railway.app/api/artist/new`, {
                name,
                aka,
                description,
                birth_day,
                birth_place,
                profile_pic: imageURL,
                label_fk,
                gender_fk
            }, config);
            addArtist(response.data.artists);
            toast.success(`Se creo ${aka} con satisfacción`);
            setName('');
            setAka('');
            setDescription('');
            setBirth_day('');
            setBirth_place('');
            setImageURL('');
            navigate('/artistas');
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
            >Añadir artista</Button>

            <Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Añadir artista</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack as={'form'} onSubmit={handleSubmit(handleSave)} spacing={4} noValidate>
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
                            <FormControl id='label_fk' isRequired>
                                <FormLabel>Productora/Disquera</FormLabel>
                                <Select
                                    placeholder='Selecciona'
                                    name='label_fk'
                                    id='label_fk'
                                    {...register('label_fk', {
                                        required: { value: true, message: 'La productora es obligatorio' }
                                    })}
                                >
                                    {
                                        labelFk.map && labelFk.map((label, i) => {
                                            const { label_id, name } = label;
                                            return (
                                                <option key={label_id} value={label_id}>{name}</option>
                                            )
                                        })
                                    }
                                </Select>
                                {errors.label_fk && <Text color={'red'} fontSize={'sm'}>{errors.label_fk.message}</Text>}
                            </FormControl>
                            <FormControl id='gender_fk' isRequired>
                                <FormLabel>Genero músical</FormLabel>
                                <Select
                                    placeholder='Selececciona'
                                    name='gender_fk'
                                    id='gender_fk'
                                    {...register('gender_fk', {
                                        required: { value: true, message: 'El genero es obligatorio' }
                                    })}
                                >
                                    {
                                        genderFk.map && genderFk.map((gender, i) => {
                                            const { gender_id, name } = gender;
                                            return (
                                                <option key={gender_id} value={gender_id}>{name}</option>
                                            )
                                        })
                                    }
                                </Select>
                                {errors.gender_fk && <Text color={'red'} fontSize={'sm'}>{errors.gender_fk.message}</Text>}
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