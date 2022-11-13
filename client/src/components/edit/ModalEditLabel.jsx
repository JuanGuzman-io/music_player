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
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ModalEditLabel({ id }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
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
                const response = await axios.get(`http://localhost:3001/api/label/${id}`, config);
                setName(response.data.label.name);
                setDescription(response.data.label.description);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
        // eslint-disable-next-line
    }, []);

    const handleUpdate = async () => {
        try {
            await axios.patch(`http://localhost:3001/api/label/${id}`, {
                name,
                description
            }, config);
            toast.success('Se actualizó el genero correctamente!');
            onClose();
        } catch (error) {
            console.log(error);
            toast.error('Ocurrio un erro al actializar el genero');
        }
    }

    return (
        <>
            <Button onClick={onOpen} variant={'outline'} colorScheme={'blue'} w={'full'}>
                <EditIcon />
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Editar genero {name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack as={'form'} onSubmit={handleSubmit(handleUpdate)} spacing={4} noValidate>
                            <FormControl id='name' isRequired>
                                <FormLabel>Nombre</FormLabel>
                                <Input
                                    type='text'
                                    placeholder={`Genero`}
                                    name='name'
                                    id='name'
                                    {...register('name', {
                                        required: { value: true, message: 'El nombre es obligatorio' }
                                    })}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {errors.name && <Text color={'red'} fontSize={'sm'}>{errors.name.message}</Text>}
                            </FormControl>
                            <FormControl id='description' isRequired>
                                <FormLabel>Nombre</FormLabel>
                                <Textarea
                                    type='text'
                                    placeholder={`Genero`}
                                    name='description'
                                    id='description'
                                    {...register('description', {
                                        required: { value: true, message: 'La descripción es obligatoria' }
                                    })}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                {errors.description && <Text color={'red'} fontSize={'sm'}>{errors.description.message}</Text>}
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
