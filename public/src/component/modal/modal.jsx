import React from "react";

import './modal.css'

function Modal({closeModal, user, images}){

return (
    <div className="modalBackground">
    <div className="modalContainer">
        <button onClick={() => closeModal(false)}><i className="fa-solid fa-x"></i></button>
        <div className="modalTitle">
            <p>{`DNI de ${user.nombre} ${user.apellido}`}</p>
        </div>
        <div className="modalBody">
           <img src={`https://claudioparedes.site/${user.dni}/${images}`} alt="" />
        </div>
        
    </div>
</div>

)
}

export default Modal;