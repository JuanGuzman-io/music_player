import React, { createContext, useState } from 'react';

export const APIContext = createContext();

export const APIContextProvider = props => {
    const [gender, setGender] = useState([]);
    const [label, setLabel] = useState([]);

    const addGender = (genders) => {
        setGender([...gender, genders]);
    }

    const addLabel = (labels) => {
        setLabel([...label, labels]);
    }

    return (
        <APIContext.Provider
            value={{
                gender,
                setGender,
                label,
                setLabel,
                addGender,
                addLabel
            }}
        >
            {props.children}
        </APIContext.Provider>
    )
}