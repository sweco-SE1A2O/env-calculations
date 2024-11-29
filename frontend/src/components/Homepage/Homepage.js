import React from 'react';
import hydro from '../../assets/hydro.png';
import SGU3 from '../../assets/SGU3.png';
import './Homepage.css';

const Homepage = () => {
    return (
        <div>
            {/* Header section */}
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={hydro} alt="Hydro" width="200" height="200" />
                    <div style={{ marginLeft: '20px', marginTop: '40px' }}>
                        <h1>HYDRO TOOLBOX</h1>
                        <p className="hydro-text">Hydrogeologiska beräkningsmodeller</p>
                    </div>
                </div>
            </div>

            {/* Card section */}
            <div className="card-container" style={{ marginTop: '20px' }}>
                <div className="card">
                    <div className="card-body">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h4 className="card-title">Linjesänka öppna förhållanden - SGU Modell 3</h4>
                            <img className="card-image" src={SGU3} alt="Hydro" />
                        </div>
                        <p className="card-text">
                        Endimensionellt grundvattenflöde till en långsträckt anläggning i ett magasin med öppna magasinsförhållanden och en tät botten.
                        </p>
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-primary" onClick={() => window.location.href = '/SGU3'}>Öppna modell</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
