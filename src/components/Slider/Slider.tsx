import React, { useEffect, useState } from 'react';
import './Slider.css';

export default function Slider() {

    const images:string[] = [
        'https://img.wallpapersafari.com/desktop/1920/1080/98/35/dW6m0X.jpg',
        'https://img.wallpapersafari.com/desktop/1920/1080/85/15/lpCj75.jpg',
        'https://img.wallpapersafari.com/desktop/1920/1080/75/54/ZBLizC.jpg',
        'https://img.wallpapersafari.com/desktop/1920/1080/23/36/per8iz.jpg'
    ];

    const [img_idx, setIdx] = useState(0);

    const changeImage = () => {
        setIdx(idx => {
            if(idx + 1 < images.length)
                return idx + 1;
            else
                return 0;
        });
    }

    useEffect(() => {
        setInterval(changeImage, 5000);
    }, []);

    return (
        <div id="carouselSlides" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
                {
                    images.map((img:string, idx:number) => (
                        <div className={idx === img_idx ? "carousel-item active" : "carousel-item"} key={idx}>
                            <img className="d-block w-100 h-100" src={img} alt="slide" />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}