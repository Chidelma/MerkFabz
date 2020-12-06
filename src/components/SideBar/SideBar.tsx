import React, { useState } from 'react';
import './SideBar.css';
import Item from '../../scripts/Item';
import { products, filtered } from "../../scripts/Init";
import { allCategories } from "../../scripts/Shares";

export default function SideBar() {

    let catOptions:string[] = allCategories;

    const [allProducts] = useState(products.get());
    const [searchTerm, setSearchTerm] = useState('');

    const filterCategory = (category:string) => {

        let results:Item[] = [];

        allProducts.forEach((item) => {
            item.get_categories().forEach((cat) => {
                if(cat === category && results.find((currItem) => currItem.get_id() === item.get_id()) === undefined)
                    results.push(item);
            });
        });

        filtered.set(results);
        window.location.pathname = "/search";
    }

    const filterProducts = () => {

        if(searchTerm.length > 0) {
            filtered.set(allProducts.filter((item) => item.get_name().includes(searchTerm)));
            window.location.pathname = "/search";
        }
    }

    const shopAll = () => {
        filtered.set(allProducts);
        window.location.pathname = "/search";
    }

    return (
        <div id="side-bar">
            <div className="input-group mb-3" id="search-input">
                <input type="text" className="form-control" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" onClick={filterProducts}><i className="fa fa-search"></i></button>
                </div>
            </div>
            
            <div className="sideBtn" onClick={shopAll}><h6>Shop All</h6></div>
            {catOptions.map((cat, idx) => (
                <div className="sideBtn" key={idx} onClick={() => filterCategory(cat)}><h6>{cat}</h6></div>
            ))}
        </div>
    )
}