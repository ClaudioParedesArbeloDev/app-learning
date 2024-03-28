import React from "react";

import './pagination.css'

export const Pagination = ({nPages, currentPage, setCurrentPage}) =>{
    const next =() =>{
        if(currentPage !== nPages) setCurrentPage (currentPage +1)
    }

    const prev = () => {
        if(currentPage !== 1) setCurrentPage (currentPage -1)
    }
    return(
        <div>
            <div className="pagination">
                <p onClick={prev}>Prev</p>
                <p>{currentPage}/{nPages}</p>
                <p onClick={next}>Next</p>
            </div>
        </div>
    )

};