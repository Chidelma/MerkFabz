import './Item.css';
import React from 'react';
import { _models } from "../../scripts/Models";

export default function Item(props:_models) {

    return (
        <>
            {
                props.auth.get_cart().map((item, idx) => (
                    <div className="item">

                    </div>
                ))
            }
        </>
    )
}