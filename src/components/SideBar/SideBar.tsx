import React from 'react';
import './SideBar.css';
import { _models } from '../../scripts/Models';

export default function SideBar(props: _models) {

    let catOptions:string[] = ["New Arrivals", "Tops", "Bottoms", "Shoes", "Jewellery", "Face Masks", "Men", "Women", "Kids"];

    const filterItems = (category:string) => {

        props.filtered.length = 0;

        for(let i = 0; i < props.items.length; i++) {

            let categories:string[] = props.items[i].get_categories();

            for(let j = 0; j < categories.length; j++) {

                if(categories[j] === category) {
                    props.filtered.push(props.items[i]);
                }
            }
        }
    }

    return (
        <div id="side-bar">
            <input id="search-input" className="form-control" placeholder="Search" />
            
            {catOptions.map((cat) => (
                <button className="btn btn-light sideBtn" onClick={() => filterItems("Woman")}>{cat}</button>
            ))}
            <br></br>
        </div>
    )
}