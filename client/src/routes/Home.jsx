import {
    Stack, Heading, Spacer
} from '@chakra-ui/react';
import AddSection from '../components/AddSection';

export default function Home(params) {
    return (
        <main>
            <Stack>
                <Heading as='h2' size='2xl'>
                    Tus artistas favoritos
                </Heading>
                <Spacer />
                <Spacer />
                <AddSection />
            </Stack>

        </main>
    );
};
