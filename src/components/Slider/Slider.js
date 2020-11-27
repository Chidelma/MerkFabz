import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';
import SliderObject from './SliderObject.js';
import SlideImg from './SlideImg.js';

import './Slider.css';

const Slider = props => {
    const getWidth = () => window.innerWidth

    const [state, setState] = useState({
        translate: 0,
        transition: 0.45
    })

    const { translate, transition } = state

    return (
        <div >
            <SliderObject
                translate={translate}
                transition={transition}
                width={getWidth()*props.slides.length}
            >
                {
                    props.slides.map(slide => (
                        <SlideImg  key ={slide} content={slide}/>
                    ))
                }
            </SliderObject>
        </div>
    )
}

export default Slider
