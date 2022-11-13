import {
    Box,
    Flex,
    Text,
    HStack,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    useColorModeValue,
    Stack,
    Container,
    Link
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';

export default function Navbar() {
    let navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { auth, setAuth } = useContext(AuthContext);
    const token = localStorage.getItem('token');

    const signOut = () => {
        navigate('/');
        localStorage.removeItem('token');
        setAuth({});
        toast('Hasta pronto', { icon: '👋🏻' });
    }

    return (
        <Box bg={useColorModeValue('white', 'white.900')} borderWidth={'0.0625rem'}>
            <Container maxW={'container.xl'}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <Box>
                            <Link textDecoration={'none'} href={'/inicio'}>
                                <button className='btn-logo'>MusicPlayer</button>
                            </Link>
                        </Box>
                    </HStack>
                    {
                        token && (
                            <HStack
                                as={'nav'}
                                spacing={4}
                                display={{ base: 'none', md: 'flex' }}>
                                <Link href='/generos'>Generos</Link>
                                <Link href='/productoras'>Productoras</Link>
                                <Link href='/artistas'>Artistas</Link>
                                <Link href='/albumes'>Álbumes</Link>
                                <Link href='/canciones'>Canciones</Link>
                            </HStack>
                        )
                    }
                    <Flex alignItems={'center'}>
                        <HStack
                            as={'nav'}
                            spacing={4}
                            display={{ base: 'none', md: 'flex' }}
                            me='4'
                        >
                            {
                                !token ? (
                                    <HStack>
                                        <Link textDecoration={'none'} href={'/'}>
                                            <Button
                                                colorScheme={'purple'}
                                            >
                                                Iniciar sesión
                                            </Button>
                                        </Link>
                                        <Link textDecoration={'none'} href={'/crear-cuenta'}>
                                            <Button
                                                colorScheme={'teal'}
                                            >
                                                Registrate
                                            </Button>
                                        </Link>
                                    </HStack>
                                ) : (
                                    <Menu>
                                        <MenuButton
                                            as={Button}
                                            rounded={'full'}
                                            variant={'link'}
                                            cursor={'pointer'}
                                            minW={0}
                                        >
                                            <Text>{auth.name}</Text>
                                        </MenuButton>
                                        <MenuList>
                                            <MenuItem
                                                color={'red'}
                                                onClick={signOut}
                                            >Cerrar sesión</MenuItem>
                                        </MenuList>
                                    </Menu>
                                )
                            }
                        </HStack>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            <Link href='/'>Iniciar sesión</Link>
                        </Stack>
                    </Box>
                ) : null}
            </Container>
        </Box>
    );
}