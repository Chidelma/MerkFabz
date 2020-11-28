import React from 'react';
import './SideBar.css';
import { _models } from '../../scripts/Models';
import Item from '../../scripts/Item';

function filterItems(props: _models, typeItem: string) {
    props.filtered.length = 0;
    let filtered: Item[] = props.items.filter(item => item.get_category() === typeItem);
    filtered.forEach(Item => {
        props.filtered.push(Item);
    });
    let slider = document.getElementById("carouselSlides");
    if (slider) {
        slider.style.display = "none";
    }
}

export default function SideBar(props: _models) {

    return (
        <div id="side-bar">
            <button className="btn btn-light sideBtn" onClick={() => filterItems(props, "woman")}>WOMAN</button>
            <button className="btn btn-light sideBtn" onClick={() => filterItems(props, "man")}>MAN</button>
            <button className="btn btn-light sideBtn" onClick={() => filterItems(props, "kids")}>KIDS</button>
            <button className="btn btn-light sideBtn" onClick={() => filterItems(props, "about")}>ABOUT US</button>
            <br></br>
        </div>
    )
}