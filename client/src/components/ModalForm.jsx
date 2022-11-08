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
} from '@chakra-ui/react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ModalForm({ type, title }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    const handleSave = async () => {
        try {
            await axios.post(`http://localhost:3400/api/${type}/new`, {
                name,
                description
            }, config);
            toast.success(`Se creo ${name} con satisfacción`);
            setName('');
            setDescription('');
        } catch (error) {
            toast.error(error.response.data.msg);
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
            >Añadir {title}</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Añadir {title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack as={'form'} onSubmit={handleSubmit(handleSave)} spacing={4} noValidate>
                            <FormControl id='name' isRequired>
                                <FormLabel>Nombre de {title}</FormLabel>
                                <Input
                                    type='text'
                                    placeholder={`${title} XYZ`}
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
                                    type='text'
                                    placeholder={`${title} descripción`}
                                    name='description'
                                    id='description'
                                    {...register('description', {
                                        required: { value: true, message: 'La descripción es obligatoria' }
                                    })}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                                {errors.description && <Text color={'red'} fontSize={'sm'}>{errors.description.message}</Text>}
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