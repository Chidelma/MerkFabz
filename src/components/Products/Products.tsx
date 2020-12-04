import './Products.css';
import React, { useState } from 'react';
import { _cart, _firestore, _item, _models, _search } from "../../scripts/Models";
import { v5 as uuidv5 } from 'uuid';
import Item from "../../scripts/Item";

interface props { items:Item[] }

export default function Product(props:_models) {

    let catSelect:string[] = [];
    let sizeSelect:string[] = [];
    let fileNames:string[] = [];
    let imgUrls:string[] = [];

    let catOptions:string[] = ["New Arrivals", "Tops", "Bottoms", "Shoes", "Jewellery", "Face Masks", "Men", "Women", "Kids"];
    let sizeOptions:string[] = ["Fits All", "XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large"];

    let search_results:Item[] = [];

    const [viewForm, setViewForm] = useState(false);
    const [searching, setSearching] = useState(false);
    const [imgNames, setImgNames] = useState(fileNames);
    const [results, setResults] = useState(search_results);

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [stock, setStock] = useState('');
    const [sizes, setSizes] = useState(sizeSelect);
    const [tags, setTags] = useState('');
    const [cats, setCats] = useState(catSelect);
    const [urls, setUrls] = useState(imgUrls);
    const [loading, setLoading] = useState(false);

    const updateCat = (checked:boolean, value:string) => {

        if(checked && cats.find((cat) => cat === value) === undefined) {
            cats.push(value);
            setCats(cats);
        } 
        
        if(!checked && cats.find((cat) => cat === value) !== undefined) {
            cats.splice(cats.findIndex((cat) => cat === value), 1)
            setCats(cats);
        }
    }

    const updateSize = (checked:boolean, value:string) => {

        if(checked && sizes.find((size) => size === value) === undefined) {
            sizes.push(value);
            setSizes(sizes);
        } 
        
        if(!checked && sizes.find((size) => size === value) !== undefined) {
            sizes.splice(sizes.findIndex((size) => size === value), 1)
            setSizes(sizes)
        }
    }

    const addImages = (files:FileList | null) => {

        if(files) {

            for(let i = 0; i < files.length; i++) {

                props.storage.uploadFile('product-images/' + files[i].name, files[i]);
                fileNames.push(files[i].name);
                setImgNames(fileNames);

                setTimeout(async () => {
                    let url = await props.storage.getFileUrl('product-images/' + files[i].name);
                    urls.push(url);
                    setUrls(urls);
                }, 1000);
            }

            fileNames = [];
        }
    }

    const add_edit_product = async (e:Event) => {

        e.preventDefault();

        if(name !== "" && price !== "" && stock !== "" && sizes.length > 0 && cats.length > 0 && tags !== "") {

            setLoading(true);

            let editing:boolean = true;

            if(id === '')
                editing = false;

            for(let i = 0; i < fileNames.length; i++) {

                let url = await props.storage.getFileUrl('product-images/' + fileNames[i]);

                console.log(url);

                if(url !== "" && urls.find((currurl) => currurl === url) === undefined)
                    urls.push(url);

                setUrls(urls);
            }

            let product:_item = {
                id: id === '' ? uuidv5(name + tags, uuidv5.URL) : id,
                name: name,
                price: Number(price),
                sale_price: salePrice !== "" ? Number(salePrice) : null,
                stock: Number(stock),
                sizes: sizes,
                categories: cats,
                tags: tags.split(','),
                photo_urls: urls
            }

            let added:boolean = await props.store.addData("ITEMS", product);

            if(added) {
                setLoading(false);
                if(!editing)
                    props.items.unshift(new Item(product));

                if(editing) {
                    let idx:number = props.items.findIndex((item) => item.get_id() === product.id);
                    props.items[idx] = new Item(product);
                }
                setViewForm(false);
            }
        }
    }

    const cancel = async () => {

        if(imgNames.length > 0) {
            for(let i = 0; i < imgNames.length; i++) {
               await props.storage.deleteFile('product-images/'+ imgNames[i]);
            }
        }

        setImgNames([]);
        setViewForm(false);
    }


    const view_add = () => {

        setId('');
        setName('');
        setPrice('');
        setSalePrice('');
        setStock('');
        setUrls([]);
        setCats([]);
        setSizes([]);
        setTags('');

        setViewForm(true);
    }

    const view_edit = (item:Item) => {

        setId(item.get_id())
        setName(item.get_name());
        setPrice(String(item.get_price()));
        setSalePrice(String(item.get_sale_price()));
        setStock(String(item.get_stock()));
        setUrls(item.get_photos());
        setCats(item.get_categories());
        setSizes(item.get_sizes());
        setTags(item.get_tags().join());
        setViewForm(true);
    }

    const search_products = (search_term:string) => {

        if(search_term.length === 0) {

            setSearching(false);

        } else {

            let results:Item[] = [];
            setSearching(true);

            for(let i = 0; i < props.items.length; i++) {
                if(props.items[i].get_name().includes(search_term))
                    results.push(props.items[i]);
            }

            setResults(results);
        }
    }

    const filterCategory = (searchOption:string) => {

        setSearching(true);

        let results:Item[] = [];

        for(let i = 0; i < props.items.length; i++) {
            for(let j = 0; j < props.items[i].get_categories().length; j++) {
                if(props.items[i].get_categories()[j] === searchOption)
                    results.push(props.items[i]);
            }
        }

        setResults(results)
    }

    const filterSize = (searchOption:string) => {

        setSearching(true);

        let results:Item[] = [];

        for(let i = 0; i < props.items.length; i++) {
            for(let j = 0; j < props.items[i].get_categories().length; j++) {
                if(props.items[i].get_sizes()[j] === searchOption)
                    results.push(props.items[i]);
            }
        }

        setResults(results)
    }

    const delete_product = async (item:Item, idx:number) => {

        let sure:boolean = window.confirm("Are You Sure You Want To Delete '" + item.get_name() + "'");

        if(sure) {

            let info:_firestore = {
                coll: "ITEMS",
                id: item.get_id()
            }

            if(await props.store.removeData(info)) {

                props.items.splice(idx, 1);

                if(props.auth.get_cart().find((prod) => prod.get_item().get_id() === item.get_id()) !== undefined)
                    props.auth.remove_frm_cart(item);
            }
        }
    } 

    const Products = ({ items }:props) => {

        return (
            <>
                <div className="product-head">
                    <table>
                        <tr>
                            <td className="attr">Index Image</td>
                            <td className="attr">Title</td>
                            <td className="attr">Category</td>
                            <td className="attr price">Price</td>
                            <td className="attr">Sale Price</td>
                            <td className="attr">Stock</td>
                            <td className="attr">Sizes</td>
                            <td className="attr modify">Modify</td>
                        </tr>
                    </table>
                </div>
                {
                    items.map((item, idx) => (
                        <div className="product" key={idx}>
                            <div className="attr">
                                <img className="product-img" src={item.get_photos()[0]} alt="index-img" />
                            </div>
                            <div className="attr">
                                <h6>{item.get_name()} - {item.get_tags().map((tag, idx) => (
                                    <>{idx == item.get_tags().length - 1 ? <span>{tag}</span> : <span>{tag} </span> }</>
                                ))}</h6>
                            </div>
                            <div className="attr">
                                {item.get_categories().map((cat, idx) => (
                                    <>{idx == item.get_sizes().length - 1 ? <span>{cat}</span> : <span>{cat}, </span> }</>
                                ))}
                            </div>
                            <div className="attr price">
                                <h5>${item.get_price()} CAD</h5>
                            </div>
                            <div className="attr">
                                <h5>${item.get_sale_price() !== null ? item.get_sale_price() : '-'} CAD</h5>
                            </div>
                            <div className="attr">
                                <h5>{item.get_stock()}</h5>
                            </div>
                            <div className="attr">
                                {item.get_sizes().map((size, idx) => (
                                    <>{idx == item.get_sizes().length - 1 ? <span>{size}</span> : <span>{size}, </span> }</>
                                ))}
                            </div>
                            <div className="attr modify">
                                <button className="btn btn-info btn-sm edit-btn" onClick={() => view_edit(item)}><i className="fa fa-edit"></i> Edit</button>
                                <button className="btn btn-danger del-btn btn-sm del-btn" onClick={() => delete_product(item, idx)}><i className="fa fa-trash"></i> Delete</button>
                            </div>
                        </div>
                    ))
                }
            </>
        )
    }

    return (
        <>
            <div id="products">
                <div className="input-group mb-3 search-bar">
                    <div className="input-group-prepend">
                        <button className="btn btn-light btn-lg new-btn" onClick={view_add}><i className="fa fa-plus"></i></button>
                    </div>  
                    <input type="text" className="form-control form-control-lg search-inp" onChange={(e) => search_products(e.target.value)} placeholder="Search Products" />
                    <select onChange={(e) => filterCategory(e.target.value)} className="custom-select custom-select-lg" id="inputGroupSelect01">
                        <option selected>Category</option>
                        {
                            catOptions.map((cat) => (
                                <option value={cat}>{cat}</option>
                            ))
                        }
                    </select>
                    <select onChange={(e) => filterSize(e.target.value)} className="custom-select custom-select-lg" id="inputGroupSelect02">
                        <option selected>Size</option>
                        {
                            sizeOptions.map((size) => (
                                <option value={size}>{size}</option>
                            ))
                        }
                    </select>
                    <div className="input-group-append">
                        <button className="btn btn-light" onClick={() => setSearching(false)}>Reset</button>
                    </div>
                </div>
                {viewForm && 
                    <form id="edit-product">
                        <h5>Product Details</h5>
                        <hr/>
                        <label>Images:</label>
                        {
                            urls.map((url, idx) => (
                                <img className="edit-image" src={url} key={idx} alt="product-image"/>
                            ))
                        }

                        <label className="square">
                            <i className="fa fa-photo fa-2x"></i>
                            <input type="file" multiple hidden onChange={(e) => addImages(e.target.files)} />
                        </label>
        
                        <div className="input-group mb-3 prod-det">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-default">Name:</span>
                            </div>
                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required/>
                        </div>
        
                        <div className="input-group mb-3 left-inp prod-det">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-default">Price:</span>
                            </div>
                            <input className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="any" min="1" required/>
                        </div>
        
                        <div className="input-group mb-3 right-inp prod-det">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-default">Sale Price:</span>
                            </div>
                            <input className="form-control" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} type="number" step="any" min="1" required/>
                        </div>
        
                        <label>Sizes:</label>
                        {
                            sizeOptions.map((size, idx) => (
                                <div className="form-check form-check-inline" key={Math.random()}>
                                    <input className="form-check-input" key={Math.random()} type="checkbox" value={size} onChange={(e) => updateSize(e.target.checked, e.target.value)}/>
                                    <label className="form-check-label">{size}</label>
                                </div>
                            ))
                        }
        
                        <div className="input-group mb-3 prod-det">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-default">Stock:</span>
                            </div>
                            <input className="form-control" value={stock} onChange={(e) => setStock(e.target.value)}  type="number" step="any" min="1" required/>
                        </div>
                        
                        <label>Categories:</label>
                        {
                            catOptions.map((cat, idx) => (
                                <div className="form-check form-check-inline" key={Math.random()}>
                                    <input className="form-check-input" key={Math.random()} type="checkbox" value={cat} onChange={(e) => updateCat(e.target.checked, e.target.value)}/>
                                    <label className="form-check-label">{cat}</label>
                                </div>
                            ))
                        }
        
                        <div className="input-group mb-3 prod-det">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-default">Tags:</span>
                            </div>
                            <input className="form-control" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (e.g. Black, Tees)" type="text" required/>
                        </div>
        
                        <button className="btn btn-danger" onClick={cancel}>Cancel</button>
                        <button className="btn btn-light add-prod" type="submit" onClick={(e:any) => add_edit_product(e)} disabled={loading}>{loading ? <i className="fa fa-spinner fa-spin"></i> : "Add/Edit Product"}</button>
                    </form>
                }
                {searching ? <Products items={results}/> : <Products items={props.items}/> }
            </div>
        </>
    )
}