import React from 'react';
import { _models } from '../../scripts/Models';
import './Cart.css';
import Item from '../Item/Item';

export default function Cart(props:_models) {

    return (
        <div id="cart">
            <Item {...props} />
        </div>
    )
}