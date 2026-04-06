import React from 'react';
import './Hero.css';

function Hero() {
    return (
        <section className='container-fluid' id='supportHero'>
            <div className='' id='supportWrapper'>
                <h4>Support Portal</h4>
                <a href="">Track Tickets</a>
            </div>
            <div className="row p-5 m-3">
                <div className="col-6 p-3">
                    <h1 className="fs-4">
                        Search for an answer or browse help topics to create a ticket
                    </h1>
                    <input placeholder="Eg. how do I activate F&O" />
                    <br />
                    <div className='mt-2' id='anchor'>
                        <a href="" className="d-flex flex-wrap gap-3">Track account opening</a>
                        <a href="" className="d-flex flex-wrap gap-3">Track segment activation</a>
                        <a href="" className="d-flex flex-wrap gap-3">Intraday margins</a>
                        <a href="" className="d-flex flex-wrap gap-3">Kite user manual</a>
                    </div>
                </div>
                <div className="col-6 px-5">
                    <h1 className="fs-4 p-4">Featured</h1>
                    <ol >
                        <li className='mb-2'>
                            <a href="" >Current Takeovers and Delisting - January 2024</a>
                        </li>
                        <li className='mb-2'>
                            <a href="">Latest Intraday leverages - MIS & CO</a>
                        </li>
                    </ol>
                </div>
            </div>
        </section>
    );
}

export default Hero;