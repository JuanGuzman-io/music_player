import { Container } from '@chakra-ui/react'
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

export default function Layout(params) {
    return (
        <>
            <Navbar />
            <Container
                maxW={'container.xl'}
                as={'main'}
            >
                <Outlet />
            </Container>
        </>
    );
};
