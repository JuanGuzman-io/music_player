import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';

export default function SignUp() {
    const { auth } = useContext(AuthContext);
    let navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const signUp = async () => {
        try {
            await axios.post('http://localhost:3001/api/auth/register', {
                email,
                password,
                name
            });
            navigate('/');
            toast.success(`Se creo tu cuenta con satisfacción, ${name}`)
        } catch (error) {
            toast.error(error.response.data.msg);
        }
    }

    return (
        <Flex
            style={{ minHeight: 'calc(100vh - 66px)' }}
            align={'center'}
            justify={'center'}
        >
            {
                auth.user_id && (
                    <Navigate
                        to={'/inicio'}
                        replace={true}
                    />
                )
            }
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={2} px={2}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'} color={'gray.800'}>
                        MusicPlayer
                    </Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        Hola, para ver a tus artistas favoritos debes registrate primero!
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}
                    as={'form'}
                    onSubmit={handleSubmit(signUp)}
                    noValidate
                >
                    <Stack spacing={4}>
                        <FormControl id='name' isRequired>
                            <FormLabel>Nombre completo</FormLabel>
                            <Input
                                type='text'
                                placeholder={'John Doe'}
                                name='name'
                                id='name'
                                {...register('name', {
                                    required: { value: true, message: 'El nombre es obligatorio' },
                                    pattern: {
                                        value: /^[a-z ,.'-]+$/i,
                                        message: 'Ingresa un nombre valido'
                                    }
                                })}
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            {errors.name && <Text color={'red'} fontSize={'sm'}>{errors.name.message}</Text>}
                        </FormControl>
                        <FormControl id='email' isRequired>
                            <FormLabel>Correo electrónico</FormLabel>
                            <Input
                                type='email'
                                placeholder={'correo@ejemplo.com'}
                                name='email'
                                id='email'
                                {...register('email', {
                                    required: { value: true, message: 'El correo es obligatorio' },
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Ingresa un correo valido'
                                    }
                                })}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            {errors.email && <Text color={'red'} fontSize={'sm'}>{errors.email.message}</Text>}
                        </FormControl>
                        <FormControl id='password' isRequired>
                            <FormLabel>Constraseña</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={'Ingresa tu contraseña'}
                                    {...register('password', {
                                        required: { value: true, message: 'La contraseña es obligatoria' },
                                        minLength: { value: 6, message: 'La contraseña debe contener mínimo 7 caracteres' }
                                    })}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() =>
                                            setShowPassword((showPassword) => !showPassword)
                                        }>
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            {errors.password && <Text color={'red'} fontSize={'sm'}>{errors.password.message}</Text>}
                        </FormControl>
                        <FormControl id='password' isRequired>
                            <FormLabel>Confirmar constraseña</FormLabel>
                            <Input
                                type={'password'}
                                placeholder={'Confirma tu contraseña'}
                                name='confirmPassword'
                                id='confirmPassword'
                                {...register('confirmPassword', {
                                    required: { value: true, message: 'Confirma tu contraseña' }
                                })}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                            {errors.confirmPassword && <Text color={'red'} fontSize={'sm'}>{errors.confirmPassword.message}</Text>}
                            {
                                password !== confirmPassword && confirmPassword.length > 1 ? (
                                    <Text color={'red'} fontSize={'sm'}>Las contraseñas no coinciden</Text>
                                ) : (
                                    null
                                )
                            }
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText='Submitting'
                                size='lg'
                                bg={'purple.600'}
                                color={'white'}
                                _hover={{
                                    bg: 'purple.700',
                                }}
                                type={'submit'}
                            >
                                Crear cuenta
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={'center'}>
                                Ya tienes cuenta? <Link color={'blue.400'} href={'/'}>Inicia sesión</Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}