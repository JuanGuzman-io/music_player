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
import { useContext, useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';

export default function LogIn() {
    let navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { auth, setAuth } = useContext(AuthContext);

    const signUp = async () => {
        try {
            const { data } = await axios.post('http://localhost:3001/api/auth/login', {
                email,
                password,
            });
            localStorage.setItem('token', data.token);
            setAuth(data);
            navigate('/inicio');
            toast.success(`Bienvenido, ${data.name}!`)
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
                        Bienvenido, para ver a tus artistas favoritos por favor inicia sesión
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
                                        required: { value: true, message: 'La contraseña es obligatoria' }
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
                                Iniciar sesión
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={'center'}>
                                No tienes cuenta? <Link color={'blue.400'} href={'/crear-cuenta'}>Registrate</Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}