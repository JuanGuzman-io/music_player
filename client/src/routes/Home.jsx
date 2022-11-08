import {
    Text, HStack, Stack, Heading, Spacer
} from '@chakra-ui/react';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AddSection from '../components/AddSection';
import AuthContext from '../context/AuthProvider';

export default function Home(params) {
    const { auth } = useContext(AuthContext);

    return (
        <main>
            <Stack>
                <Heading as='h2' size='2xl'>
                    Tus artistas favoritos
                </Heading>
                <Spacer />
                <Spacer />
                {
                    auth.is_admin && (
                        <AddSection />
                    )
                }
            </Stack>

        </main>
    );
};
