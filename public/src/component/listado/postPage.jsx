import React from "react";
import './postPage.css'

export const PostPage = ({setDataQt}) => {
    const change = (e) => {
        setDataQt(e.target.value)
    }
    return(
        <div className="postPage">
            <select onChange={(e)=>change(e)} name="post" id="post">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
            </select>
        </div>
    )
}