import React, { createContext, useState } from 'react';

export const APIContext = createContext();

export const APIContextProvider = props => {
    const [gender, setGender] = useState([]);
    const [label, setLabel] = useState([]);
    const [artist, setArtist] = useState([]);
    const [album, setAlbum] = useState([]);
    const [song, setSong] = useState([]);

    const addGender = (genders) => {
        setGender([...gender, genders]);
    }

    const addAlbum = (albums) => {
        setAlbum([...album, albums]);
    }

    const addLabel = (labels) => {
        setLabel([...label, labels]);
    }

    const addArtist = (artists) => {
        setLabel([...artist, artists]);
    }

    const addSong = (songs) => {
        setLabel([...song, songs]);
    }

    return (
        <APIContext.Provider
            value={{
                gender,
                setGender,
                label,
                setLabel,
                artist,
                setArtist,
                album,
                song,
                setSong,
                addSong,
                setAlbum,
                addAlbum,
                addArtist,
                addGender,
                addLabel
            }}
        >
            {props.children}
        </APIContext.Provider>
    )
}