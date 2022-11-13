import { Avatar, Badge, Box, Button, Heading, Link, Stack, Text, Wrap } from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect } from "react";
import ModalArtist from "../components/ModalArtist";
import { APIContext } from "../context/APIContext";
import AuthContext from "../context/AuthProvider";

export default function Artista(params) {
    const { auth } = useContext(AuthContext);
    const { artist, setArtist } = useContext(APIContext);
    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const fetchData = async () => {
                try {
                    const response = await axios.get('http://localhost:3400/api/artist/all', config);
                    setArtist(response.data.artists);
                    console.log(response);
                } catch (error) {
                    console.log(error);
                }
            }
            fetchData();
        }, 1000);
        return () => clearInterval(interval);
        // eslint-disable-next-lin
    }, []);

    return (
        <Stack>
            {
                auth.is_admin && (
                    <Stack
                        py={5}
                        width={'fit-content'}
                    >
                        <ModalArtist />
                    </Stack>
                )
            }
            <Wrap
                spacing='20px'
                py={4}
                mt={10}
            >
                {
                    artist.map && artist.map((a,i) => (
                        <Box
                            maxW={'280px'}
                            w={'full'}
                            boxShadow={'lg'}
                            rounded={'lg'}
                            p={6}
                            key={i}
                            textAlign={'center'}>
                            <Avatar
                                size={'xl'}
                                src={
                                    a.profile_pic
                                }
                                alt={'Avatar Alt'}
                                mb={4}
                                pos={'relative'}
                            />
                            <Heading fontSize={'2xl'} fontFamily={'body'}>
                                {a.aka}
                            </Heading>
                            <Text fontWeight={600} color={'gray.500'} mb={4}>
                                {a.name}
                            </Text>
                            <Badge
                                px={2}
                                py={1}
                                fontWeight={'400'}>
                                #{a.gender}
                            </Badge>
                            <Text
                                textAlign={'center'}
                                px={3}>
                                {a.birth_place}
                            </Text>
                            <Text
                                textAlign={'center'}
                                px={3}>
                                {a.birth_day}
                            </Text>

                            <Stack mt={8} direction={'row'} spacing={4}>
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
                                        bg: 'pruple.500',
                                    }}
                                    _focus={{
                                        bg: 'pruple.500',
                                    }}>
                                    Ver más
                                </Button>
                            </Stack>
                        </Box>
                    ))
                }
            </Wrap>
        </Stack>
    )
};
