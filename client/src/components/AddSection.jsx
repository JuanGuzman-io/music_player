import { Heading, Flex, Image, Spacer, Stack, Text, Button, Link } from "@chakra-ui/react";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const adminInfo = [
    {
        id: 1,
        name: 'Género',
        image: 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg',
        url: '/generos'
    },
    {
        id: 2,
        name: 'Productores',
        image: 'https://images.pexels.com/photos/8198157/pexels-photo-8198157.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        url: '/productoras'
    },
    {
        id: 3,
        name: 'Artistas',
        image: 'https://images.pexels.com/photos/5648357/pexels-photo-5648357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        url: '/artistas'
    },
    {
        id: 4,
        name: 'Álbumes',
        image: 'https://images.pexels.com/photos/4200745/pexels-photo-4200745.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        url: '/albunes'
    },
    {
        id: 5,
        name: 'Canciones',
        image: 'https://images.pexels.com/photos/949274/pexels-photo-949274.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        url: '/canciones'
    },
]

export default function AddSection(params) {
    const { auth } = useContext(AuthContext);

    return (
        <Stack>
            <Text fontSize={'2xl'}>Hola, {auth.name}</Text>
            <Spacer />
            <Flex
                justifyContent={'stretch'}
                flexWrap={'wrap'}
                gap={4}
            >
                {
                    adminInfo.map && adminInfo.map(info => (
                        <Stack
                            key={info.id}
                            borderWidth="1px"
                            borderRadius="lg"
                            w={{ sm: '100%', md: '400px' }}
                            height={{ sm: '200px', md: '200px' }}
                            direction={{ base: 'column', md: 'row' }}
                            boxShadow={'2xl'}
                            padding={4}>
                            <Flex flex={1} bg="purple.200">
                                <Image
                                    objectFit="cover"
                                    boxSize={{ sm: '100%' }}
                                    src={
                                        `${info.image}`
                                    }
                                />
                            </Flex>
                            <Stack
                                flex={1}
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                p={1}
                                pt={2}>
                                <Heading fontSize={'xl'} fontFamily={'body'}>
                                    {info.name}
                                </Heading>

                                <Stack
                                    width={'100%'}
                                    mt={'2rem'}
                                    direction={'row'}
                                    padding={2}
                                    justifyContent={'center'}
                                    alignItems={'center'}>

                                    <Link
                                        href={info.url}
                                    >
                                        <Button
                                            flex={1}
                                            fontSize={'sm'}
                                            rounded={'full'}
                                            bg={'purple.400'}
                                            color={'white'}
                                            boxShadow={
                                                '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                                            }
                                            _hover={{
                                                bg: 'purple.500',
                                            }}
                                            _focus={{
                                                bg: 'purple.500',
                                            }}
                                        >
                                            Ver más
                                        </Button>
                                    </Link>
                                </Stack>
                            </Stack>
                        </Stack>
                    ))
                }
            </Flex>
        </Stack>
    )
};
