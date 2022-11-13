import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthProvider';
import { APIContextProvider } from './context/APIContext';
import { ChakraProvider } from "@chakra-ui/react";
import './index.css';
import Home from './routes/Home';
import SignUp from './routes/SignUp';
import Layout from './Layout/Layout';
import LogIn from './routes/LogIn';
import Album from './routes/Album';
import Productora from './routes/Productora';
import Genero from './routes/Genero';
import Cancion from './routes/Cancion';
import Artista from './routes/Artista';
import UnGenero from './components/UnGenero';
import UnaProductora from './components/UnaProductora';
import UnAlbum from './components/UnAlbum';
import UnArtista from './components/UnArtista';

function App() {

  return (
    <AuthProvider>
      <APIContextProvider>
        <Router>
          <ChakraProvider>
            <Routes>
              <Route path='/' element={<Layout />}>
                <Route index element={<LogIn />} />
                <Route path='/crear-cuenta' element={<SignUp />} />
                <Route path='/inicio' element={<Home />} />
                <Route path='/albumes' element={<Album />} />
                <Route path='/albumes/:id' element={<UnAlbum />} />
                <Route path='/productoras' element={<Productora />} />
                <Route path='/productoras/:id' element={<UnaProductora />} />
                <Route path='/generos' element={<Genero />} />
                <Route path='/generos/:id' element={<UnGenero />} />
                <Route path='/canciones' element={<Cancion />} />
                <Route path='/artistas' element={<Artista />} />
                <Route path='/artistas/:id' element={<UnArtista />} />
              </Route>
            </Routes>
          </ChakraProvider>
          <Toaster />
        </Router>
      </APIContextProvider>
    </AuthProvider>
  );
}

export default App;