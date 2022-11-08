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
import UnGenero from './routes/UnGenero';
import UnaProductora from './routes/UnaProductora';

function App() {

  return (
    <APIContextProvider>
      <Router>
        <AuthProvider>
          <ChakraProvider>
            <Routes>
              <Route path='/' element={<Layout />}>
                <Route index element={<LogIn />} />
                <Route path='/crear-cuenta' element={<SignUp />} />
                <Route path='/inicio' element={<Home />} />
                <Route path='/albunes' element={<Album />} />
                <Route path='/productoras' element={<Productora />} />
                <Route path='/productoras/:id' element={<UnaProductora />} />
                <Route path='/generos' element={<Genero />} />
                <Route path='/generos/:id' element={<UnGenero />} />
                <Route path='/canciones' element={<Cancion />} />
                <Route path='/artistas' element={<Artista />} />
              </Route>
            </Routes>
          </ChakraProvider>
          <Toaster />
        </AuthProvider>
      </Router>
    </APIContextProvider>
  );
}

export default App;