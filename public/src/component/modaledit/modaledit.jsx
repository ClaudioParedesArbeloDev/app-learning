//Modulos
import React, { useState } from "react";

//Estilos
import './modaledit.css'


//logica
function ModalEdit({closeModal, onAccept}){
    const [newValue, setNewValue] = useState('');

    const handleAccept = () => {
        onAccept(newValue);
        closeModal(false);
    };

    const handleChange = (event) => {
        setNewValue(event.target.value);
    };

    return(
        <div className="modalEdit">
            <button className="btnEditClose" 
                onClick={() => closeModal(false)}>
                <i className="fa-regular fa-rectangle-xmark"></i>
            </button>
            
            <h2 className="modalTitle">Edite el campo seleccionado</h2>
            
            <input 
            type="text" 
            className="inputEdit"
            value={newValue}
            onChange={handleChange}
            />
            <button style={{ 
                color: 'crimson', 
                border: 'solid 2px',
                padding: '5px',
                borderRadius: '10px',
                background: 'black'}}
                onClick={handleAccept}
                >
                    Aceptar
                </button>
        </div>
    )
}

export default ModalEdit