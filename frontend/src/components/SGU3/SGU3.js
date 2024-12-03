import React, { useState } from 'react';
import modelImage from '../../assets/ritning2.png';
import modelImageSummary from '../../assets/model_summary.png';
import equationImage from '../../assets/formler.png';
import './SGU3.css';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

console.log(API_URL);

const SGU3 = () => {
    const today = new Date().toISOString().split('T')[0];

    const navigate = useNavigate();

    const handleHelp = () => {
      navigate('/sgu3-help');
  };

    // State för att hålla formulärvärdena
    const [KMin, setKMin] = useState(1e-6);
    const [KMax, setKMax] = useState(3e-6);
    const [WMin, setWMin] = useState(245);
    const [WMax, setWMax] = useState(255);
    const [H0Min, setH0Min] = useState(9);
    const [H0Max, setH0Max] = useState(10);
    const [iterations, setIterations] = useState(10000);
    const [hs, setHs] = useState(7);
    const [srp, setSrp] = useState(0.3);
    const [L, setL] = useState(100);
    const [projekt, setProjekt] = useState('');
    const [projektInformation, setProjektInformation] = useState('');
    const [sakerhetsfaktor, setSakerhetsfaktor] = useState(3);

    //layout
    const [layout, setLayout] = useState('enkel');
  
    // Fält för percentiler
    const [lowerPercentile, setLowerPercentile] = useState(1);
    const [upperPercentile, setUpperPercentile] = useState(51);
  
    const [errorMessage, setErrorMessage] = useState('');
  
    // State för att hålla resultatet från backend
    const [results, setResults] = useState(null);
  
    // State for modal
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState('');
  
    const [histogram, setHistogram] = useState(null);
    const [plotImage, setPlotImage] = useState(null);

    const [medianPlotImage, setMedianPlotImage] = useState(null);
  
    const [loading, setLoading] = useState(false);
  
    // Funktion för att hantera form submission
    const handleSubmit = async (event) => {
      event.preventDefault();
  
        // Kontrollera om KMin är större än KMax
    if (KMin > KMax) {
      setErrorMessage('Fel: KMin får inte vara större än KMax');
      return; // Stoppa formulärets inskickning
    } 
    if (H0Min > H0Max) {
      setErrorMessage('Fel: HMin får inte vara större än HMax');
      return; // Stoppa formulärets inskickning
    } 
    if (WMin > WMax) {
      setErrorMessage('Fel: WMin får inte vara större än WMax');
      return; // Stoppa formulärets inskickning
    } 
    else {
      setErrorMessage(''); // Om ingen felaktig inmatning, rensa felmeddelandet
    }
    
      const formData = {
        K_min: KMin,
        K_max: KMax,
        W_min: WMin,
        W_max: WMax,
        H0_min: H0Min,
        H0_max: H0Max,
        iterations: iterations,
        hs: hs,
        srp: srp,
        L: L,
        lower_percentile: lowerPercentile,
        upper_percentile: upperPercentile,
        sakerhetsfaktor: sakerhetsfaktor,
      };
      
      setLoading(true);
      try {
        // Skicka data till Flask-backend
        const response = await fetch(`${API_URL}/api/monte_carlo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setResults(data);
        
        if(layout === 'avancerad') {
        // Anropa /api/monte_carlo_histogram för att få histogrammet
        const histogramResponse = await fetch(`${API_URL}/api/monte_carlo_histogram`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
    
        if (!histogramResponse.ok) {
          throw new Error('Failed to fetch histogram');
        }
    
        const histogramData = await histogramResponse.json();
        setHistogram(histogramData.histogram);

      }

      if (layout === 'avancerad') {
        // Anropa /api/monte_carlo_plot för att få plot-bilden
        const plotResponse = await fetch(`${API_URL}/api/monte_carlo_plot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
    
        if (!plotResponse.ok) {
          throw new Error('Failed to fetch plot');
        }
    
        const plotData = await plotResponse.json();
        setPlotImage(plotData.line_chart);  
      }

      if(layout === 'enkel') {
        const medianPlotResponse = await fetch(`${API_URL}/api/median_vs_avstand_plot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!medianPlotResponse.ok) {
          throw new Error('Failed to fetch median plot');
        }

        const medianPlotData = await medianPlotResponse.json();
        console.log(medianPlotData);
        setMedianPlotImage(medianPlotData.median_vs_avstand_plot); // Spara Base64-data i state
      }
    
      } catch (error) {
        console.error('Error:', error);
        setResults({ error: 'Något gick fel vid beräkningen' });
        setHistogram(null);
      }
      finally {
        setLoading(false);
      }
    };
    
    const handleImageClick = (image) => {
      setSelectedImage(image);
      setIsImageModalOpen(true);
    };

    const handleImageModalClose = () => {
      setIsImageModalOpen(false);
      setSelectedImage(null);
    }

    const handleModalClose = () => { 
      setIsModalOpen(false);
    };

    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalChange = (event) => setModalInfo(event.target.value);
    const handleImageModalOpen = () => setIsImageModalOpen(true);
  
    const handlePrint = () => {
      const printContents = document.querySelector(".dialog-body").innerHTML;  // Hämta innehållet inom modal-body
    
      // Skapa ett nytt fönster för utskrift
      const printWindow = window.open('', '', 'height=800,width=1200');
    
      // Sätt innehållet i det nya fönstret
      printWindow.document.write('<html><head><title>Print</title></head><body>');
      printWindow.document.write('<div style="text-align: left;">' + printContents + '</div>');
      printWindow.document.write('</body></html>');
    
      // Vänta på att sidan ska ladda och sedan skriv ut
      printWindow.document.close();
      printWindow.print();
    
      // När utskriften är klar kan du stänga fönstret
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };

            // Funktion som hanterar layoutändring
            const handleLayoutChange = (e) => {
              setLayout(e.target.value); // Uppdatera state baserat på radioknappens värde
          };
  
    return (
      <>
        <div className="row form-group">
                <div className="radio-container">
                    <div className="custom-control custom-radio mt-2">
                        <input
                            type="radio"
                            name="exampleRadios"
                            id="exampleRadios1"
                            value="enkel"
                            className="custom-control-input"
                            checked={layout === "enkel"}
                            onChange={handleLayoutChange}
                        />
                        <label htmlFor="exampleRadios1" className="custom-control-label">
                            Enkel
                        </label>
                    </div>
                    <div className="custom-control custom-radio">
                        <input
                            type="radio"
                            name="exampleRadios"
                            id="exampleRadios2"
                            value="avancerad"
                            className="custom-control-input"
                            checked={layout === "avancerad"}
                            onChange={handleLayoutChange}
                        />
                        <label htmlFor="exampleRadios2" className="custom-control-label">
                            Avancerad
                        </label>
                    </div>
                </div>
            </div>
      <div style={{ display: 'flex', padding: '20px', minHeight: '100vh', flexDirection: 'row', paddingTop: '0px' }}>
        {/* Formulärsektion */}
        <div style={{ flex: 2, marginRight: '20px', display: 'flex', flexDirection: 'column'}}>
        <div style={{ flex: 2, marginRight: '20px', paddingLeft: '20px', border: '1px solid blue'}}>
          <h3>Monte Carlo Simulering</h3>
    
          {/* Formulär för att ta in användardata */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
            
          <div className="form-group" style={{ marginBottom: '2px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <label htmlFor="projekt" style={{ width: '80px' }}>Projekt:</label>
          <input
            className="form-control"
            type="text"
            value={projekt}
            onChange={(e) => setProjekt(e.target.value)}
            id="project"
            style={{ width: '180px' }} // Bredd
          />
        </div>
  
        {/* Fält för Projektinformation */}
        <div className="form-group" style={{ marginBottom: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <label htmlFor="projektInformation" style={{ width: '80px' }}>Info:</label>
          <input
            className="form-control"
            type="text"
            value={projektInformation}
            onChange={(e) => setProjektInformation(e.target.value)}
            id="projectInfo"
            style={{ width: '180px' }} // Bredd
          />
        </div>
  
            {/* L, Hs, Srp på toppen */}
            <div className="form-group" style={{ marginBottom: '2px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <label htmlFor="L" style={{ width: '80px' }}>L:</label>
              <input
                className="form-control"
                type="number"
                value={L}
                onChange={(e) => setL(parseFloat(e.target.value) || 0)}
                id="L"
                style={{ width: '180px' }} // Bredd
              />
              <div className='unit'>[m]</div>
                      <i style={{marginLeft: '4px', marginTop: '1px'}} className="fa-thin fa-circle-info" data-toggle="tooltip" data-placement="top" title="Längd på schakt"></i>
            </div>
    
            <div className="form-group" style={{ marginBottom: '2px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <label htmlFor="hs" style={{ width: '80px' }}>H<sub>s</sub>:</label>
              <input
                className="form-control"
                type="number"
                value={hs}
                onChange={(e) => setHs(parseFloat(e.target.value) || 0)}
                id="hs"
                style={{ width: '180px' }} // Bredd
              />
              <div className='unit'>[m]</div>
              <i style={{marginLeft: '4px'}} className="fa-thin fa-circle-info" data-toggle="tooltip" data-placement="top" title="Vattenmättad mäktighet i schaktbotten (GVY ovan tät botten)"></i>
            </div>
    
            <div className="form-group" style={{ marginBottom: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <label htmlFor="srp" style={{ width: '80px' }}>S<sub>rp</sub>:</label>
              <input
                className="form-control"
                type="number"
                step="any"
                value={srp}
                onChange={(e) => setSrp(parseFloat(e.target.value) || 0)}
                id="srp"
                style={{ width: '180px' }} // Bredd
              />
              <div className='unit'>[m]</div>
              <i style={{marginLeft: '4px'}} className="fa-thin fa-circle-info" data-toggle="tooltip" data-placement="top" title="Påverkansområdets avgränsning"></i>
            </div>
    
            {/* H0 Min och H0 Max bredvid varandra */}
            <div className="form-group" style={{ marginBottom: '2px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <label htmlFor="H0Min" style={{ width: '80px' }}>H<sub>0</sub> Min:</label>
              <input
                className="form-control"
                type="number"
                value={H0Min}
                onChange={(e) => setH0Min(parseFloat(e.target.value) || 0)}
                id="H0Min"
                style={{ width: '180px' }} // Bredd
              />
              <label htmlFor="H0Max" style={{ width: '80px', marginLeft: '10px' }}>H<sub>0</sub> Max:</label>
              <input
                className="form-control"
                type="number"
                value={H0Max}
                onChange={(e) => setH0Max(parseFloat(e.target.value) || 0)}
                id="H0Max"
                style={{ width: '180px' }} // Bredd
              />
              <div className='unit'>[m]</div>
              <i style={{marginLeft: '4px'}} className="fa-thin fa-circle-info" data-toggle="tooltip" data-placement="top" title="Opåverkad vattenmättad mäktighet på grundvattenmagasinet"></i>
            </div>
    
            {/* K Min och K Max bredvid varandra */}
            <div className="form-group" style={{ marginBottom: '2px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <label htmlFor="KMin" style={{ width: '80px' }}>K Min:</label>
              <input
                className="form-control"
                step="0.000001"
                type="number"
                value={KMin}
                onChange={(e) => setKMin(parseFloat(e.target.value) || 0)}
                id="KMin"
                style={{ width: '180px' }} // Bredd
              />
              <label htmlFor="KMax" style={{ width: '80px', marginLeft: '10px' }}>K Max:</label>
              <input
                className="form-control"
                type="number"
                step="0.000001"
                value={KMax}
                onChange={(e) => setKMax(parseFloat(e.target.value) || 0)}
                id="KMax"
                style={{ width: '180px' }} // Bredd
              />
              <div className='unit'>[m/s]</div>
              <i style={{marginLeft: '4px'}} className="fa-thin fa-circle-info" data-toggle="tooltip" data-placement="top" title="Vattenmättad hydraulisk konduktivitet"></i>
            </div>
    
            {/* W Min och W Max bredvid varandra */}
            <div className="form-group" style={{ marginBottom: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <label htmlFor="WMin" style={{ width: '80px' }}>W Min:</label>
              <input
                className="form-control"
                type="number"
                value={WMin}
                onChange={(e) => setWMin(parseInt(e.target.value) || 0)}
                id="WMin"
                style={{ width: '180px' }} // Bredd
              />
              <label htmlFor="WMax" style={{ width: '80px', marginLeft: '10px' }}>W Max:</label>
              <input
                className="form-control"
                type="number"
                value={WMax}
                onChange={(e) => setWMax(parseInt(e.target.value) || 0)}
                id="WMax"
                style={{ width: '180px' }} // Bredd
              />
              <div className='unit'>[mm/år]</div>
              <i style={{marginLeft: '4px'}} className="fa-thin fa-circle-info" data-toggle="tooltip" data-placement="top" title="Grundvattenbildning"></i>
            </div>
            {/* Nedre percentil */}
            { layout === "avancerad" && (
            <div className="form-group" style={{ marginBottom: '2px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <label htmlFor="lowerPercentile" style={{ width: '80px' }}>Nedre perc:</label>
              <input
                className="form-control"
                type="number"
                value={lowerPercentile}
                onChange={(e) => setLowerPercentile(Math.max(1, Math.min(49, parseInt(e.target.value))))}
                id="lowerPercentile"
                min="1"
                max="49"
                style={{ width: '180px' }} // Bredd
              />
              <div className='unit'>[%]</div>
                <i style={{marginLeft: '4px'}} className="fa-thin fa-circle-info" data-toggle="tooltip" data-placement="top" title="Vald nedre percentil för statistik"></i>
            </div> )}
              
            { layout === "avancerad" && (
            <div className="form-group" style={{ marginBottom: '2px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <label htmlFor="upperPercentile" style={{ width: '80px' }}>Övre perc:</label>
              <input
                className="form-control"
                type="number"
                value={upperPercentile}
                onChange={(e) => setUpperPercentile(Math.max(51, Math.min(99, parseInt(e.target.value))))}
                id="upperPercentile"
                min="51"
                max="99"
                style={{ width: '180px' }} // Bredd
              />
              <div className='unit'>[%]</div>
                          <i style={{marginLeft: '4px'}} className="fa-thin fa-circle-info" data-toggle="tooltip" data-placement="top" title="Vald övre percentil för statistik"></i>
            </div>
            )}
                  {/* Fält för iterationer */}

                  { layout === "avancerad" && (
        <div className="form-group" style={{ marginBottom: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <label htmlFor="iterations" style={{ width: '80px' }}>Iterationer:</label>
          <input
            className="form-control"
            type="number"
            value={iterations}
            onChange={(e) => setIterations(parseInt(e.target.value) || 0)}
            id="iterations"
            min="1" // Sätter ett minimum för iterationer
            style={{ width: '180px' }} // Bredd
          />
          <div className='unit'>[st]</div>
                      <i style={{marginLeft: '4px'}} className="fa-thin fa-circle-info" data-toggle="tooltip" data-placement="top" title="Antal beräkningar i Monte Carlo-simuleringen"></i>
        </div>
      )}

      { layout === "enkel" && (
                 <div className="form-group" style={{ marginBottom: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                 <label htmlFor="sakerhetsfaktor" style={{ width: '140px' }}>Säkerhetsfaktor:</label>
                 <input
                   className="form-control"
                   type="number"
                   value={sakerhetsfaktor}
                   onChange={(e) => setSakerhetsfaktor(parseInt(e.target.value) || 0)}
                   id="sakerhetsfaktor"
                   min="1" // Sätter ett minimum för iterationer
                   style={{ width: '180px' }} // Bredd
                 />
                             <i style={{marginLeft: '4px'}} className="fa-thin fa-circle-info" data-toggle="tooltip" data-placement="top" title="Säkerhetsfaktor"></i>
               </div>
      )}
    
            {/* Submit-knapp */}
            <div style={{ textAlign: 'right', marginTop: 'auto', position: 'absolute', bottom: '80px', right: '20px' }}>
      <button type="submit" style={{ width: '200px' }} className="btn btn-primary">
        Kör simulering
      </button>
    </div>
          </form>
          </div>
  
            {errorMessage && (
              <div style={{ color: 'red', marginBottom: '20px' }}>
                <strong>{errorMessage}</strong>
              </div>
            )}
  
  
  
          {/* Display results from Flask */}
          <div style={{ flex: 2, marginRight: '20px', marginTop: '20px', paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px', border: '1px solid green'}}>
          <h3>Resultat</h3>
          {loading && <p>Laddar...</p>}
          {layout === 'avancerad' && (
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px', justifyContent: 'center' }}>
            {histogram && !loading && (
              <div style={{ textAlign: 'left', cursor: 'pointer' }} onClick={() => handleImageClick(histogram)}>
                <img
                  src={`data:image/png;base64,${histogram}`}
                  alt="Histogram"
                  style={{ maxWidth: '100%', height: 'auto' }} // Justera bredden för bättre passform
                />
              </div>
            )}
  
            {plotImage && !loading && (
              <div style={{ textAlign: 'left', cursor: 'pointer' }} onClick={() => handleImageClick(plotImage)}>
                <img
                  src={`data:image/png;base64,${plotImage}`}
                  alt="Plot"
                  style={{ maxWidth: '100%', height: 'auto' }} // Justera bredden för bättre passform
                />
              </div>
            )}

          </div> )}

          {medianPlotImage && !loading && layout === 'enkel' && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    {/* Översta raden: Tabell och bild */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
      {/* Tabellsektionen (vänster) */}
      <div style={{ flex: 1, maxWidth: '50%' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}>Påverkansavstånd</td>
              <td style={{ padding: '8px' }}>{results?.paverkanavstand?.median.toFixed(1)}</td>
              <td style={{ padding: '8px' }}>[m]</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>Influensavstånd</td>
              <td style={{ padding: '8px' }}>{results?.influensavstand?.median.toFixed(1)}</td>
              <td style={{ padding: '8px' }}>[m/s]</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>Ensidigt inflöde</td>
              <td style={{ padding: '8px' }}>
                {results?.ensidigt_inflode?.median < 0.1
                  ? results?.ensidigt_inflode?.median.toExponential(1)
                  : results?.ensidigt_inflode?.median.toFixed(1)}
              </td>
              <td style={{ padding: '8px' }}>[m<sup>3</sup>/s]</td>
            </tr>
            <tr className='bordered-tr'>
              <td style={{ padding: '8px' }}>Påverkansavstånd med säkerhetsfaktor </td>
              <td style={{ padding: '8px' }}>{(results?.paverkanavstand?.median * sakerhetsfaktor).toFixed(1)}</td>
              <td style={{ padding: '8px' }}>[m/s]</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bildsektionen (höger) */}
      <div style={{ flex: 1, maxWidth: '50%', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleImageClick(medianPlotImage)}>
        <img
          src={`data:image/png;base64,${medianPlotImage}`}
          alt="Median Plot"
          style={{ maxWidth: '100%', height: 'auto' }} // Anpassar bredden automatiskt
        />
      </div>
    </div>

    {/* Knappsektionen */}
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <button onClick={handleModalOpen} type="submit" className="btn btn-secondary">
        Summering
      </button>
    </div>
  </div>
)}





          {results && !loading && layout === 'avancerad' &&(
    <div style={{ marginTop: '20px' }}>
      {results.error ? (
        <p style={{ color: 'red' }}>{results.error}</p>
      ) : (
        <div style={{ marginTop: '20px', position: 'relative' }}>
          <table style={{ borderCollapse: 'collapse', width: '70%'}}>
            <thead>
              <tr>
                <th style={{ padding: '8px' }}></th>
                <th style={{ padding: '8px' }}>Påverkanavstånd [m]</th>
                <th style={{ padding: '8px' }}>Influensavstånd [m]</th>
                <th style={{ padding: '8px' }}>Ensidigt inflöde [m<sup>3</sup>/s]</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" style={{ padding: '8px' }}>Min</th>
                <td style={{ padding: '8px' }}>{results?.paverkanavstand?.min.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>{results?.influensavstand?.min.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>
                  {results?.ensidigt_inflode?.min < 0.1
                    ? results?.ensidigt_inflode?.min.toExponential(1)
                    : results?.ensidigt_inflode?.min.toFixed(1)}
                </td>
              </tr>
              <tr>
                <th scope="row" style={{ padding: '8px' }}>{lowerPercentile}-perc</th>
                <td style={{ padding: '8px' }}>{results?.paverkanavstand?.lower_percentile.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>{results?.influensavstand?.lower_percentile.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>
                  {results?.ensidigt_inflode?.lower_percentile < 0.1
                    ? results?.ensidigt_inflode?.lower_percentile.toExponential(1)
                    : results?.ensidigt_inflode?.lower_percentile.toFixed(1)}
                </td>
              </tr>
              <tr>
                <th scope="row" style={{ padding: '8px' }}>Median</th>
                <td style={{ padding: '8px' }}>{results?.paverkanavstand?.median.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>{results?.influensavstand?.median.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>
                  {results?.ensidigt_inflode?.median < 0.1
                    ? results?.ensidigt_inflode?.median.toExponential(1)
                    : results?.ensidigt_inflode?.median.toFixed(1)}
                </td>
              </tr>
              <tr>
                <th scope="row" style={{ padding: '8px' }}>{upperPercentile}-perc</th>
                <td style={{ padding: '8px' }}>{results?.paverkanavstand?.upper_percentile.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>{results?.influensavstand?.upper_percentile.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>
                  {results?.ensidigt_inflode?.upper_percentile < 0.1
                    ? results?.ensidigt_inflode?.upper_percentile.toExponential(1)
                    : results?.ensidigt_inflode?.upper_percentile.toFixed(1)}
                </td>
              </tr>
              <tr>
                <th scope="row" style={{ padding: '8px' }}>Max</th>
                <td style={{ padding: '8px' }}>{results?.paverkanavstand?.max.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>{results?.influensavstand?.max.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>
                  {results?.ensidigt_inflode?.max < 0.1
                    ? results?.ensidigt_inflode?.max.toExponential(1)
                    : results?.ensidigt_inflode?.max.toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
  
          <button onClick={handleModalOpen} type="submit"     style={{
        position: 'absolute',
        right: 0, // Placera knappen till höger
        bottom: 0, // Placera knappen linjerad med tabellens botten
        width: '200px',
      }} className="btn btn-secondary">Summering</button>
  
  
  
        </div>
      )}
      </div>
  )}
  </div>
  </div>
    
        {/* Bildsektion till höger */}
        <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid red' }}>
        <h2>Modell</h2>
        <img src={modelImage} alt="Modell för uträkningarna" style={{ maxWidth: '100%', height: 'auto' }} />
        {layout === 'avancerad' && (
        <img src={equationImage} alt="Modell för uträkningarna" style={{ maxWidth: '100%', height: 'auto', marginTop: '8px'}} />
        )}
        <div
  className="button-container"
  style={{
    display: 'flex',
    justifyContent: 'space-between', // Justera mellanrummet mellan knappar
    alignItems: 'center', // Vertikal centrering (om det behövs)
    marginTop: 'auto', // Flytta knapparna längst ner i parent element
  }}
>
        <button type="button" className="btn btn-secondary link-button" onClick={() => window.open('https://www.sgu.se/anvandarstod-for-geologiska-fragor/bedomning-av-influensomrade-avseende-grundvatten/berakningsmodeller/analytiska-modeller/modell-3/', '_blank')}>Länk SGU</button>
        <button type="button" className="btn btn-primary help-button" onClick={handleHelp}>Hjälp</button>
        </div>
        </div>
      <div className={`modal fade ${isModalOpen ? 'show' : ''}`} id="standardModal" role="dialog" aria-labelledby="standardModalLabel" aria-modal="true" style={{ display: isModalOpen ? 'block' : 'none' }}>
    <div className="modal-dialog" role="document" style={{maxWidth: '70%'}}>
      {layout === 'avancerad' && (
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title" id="standardModalLabel">Summering</h4>
          <button type="button" className="close" onClick={handleModalClose} aria-label="Close"><span>Close</span></button>
        </div>
        <div className="modal-body">
          <div className="dialog">
            <div className="dialog-body" style={{ textAlign: 'left' }}>
            <div style={{ flexDirection: 'column', marginBottom: '0px' }}>
              <label htmlFor="Projekt" style={{ marginBottom: '0px' }}><b>Projekt:</b></label>
              <div style={{ display: 'inline-block', marginLeft: '10px'  }}>{projekt}</div>
            </div>
            <div style={{ flexDirection: 'column', marginBottom: '0px' }}>
              <label htmlFor="Projektinformation" style={{ marginBottom: '0px' }}><b>Projektinformation:</b></label>
              <div style={{ display: 'inline-block', marginLeft: '10px'  }}>{projektInformation}</div>
            </div>
            <div style={{ flexDirection: 'column', marginBottom: '10px' }}>
              <label htmlFor="L" style={{ marginBottom: '0px' }}><b>Datum:</b></label>
              <div style={{ display: 'inline-block', marginLeft: '10px'  }}>{today}</div>
            </div>

                        <img src={modelImageSummary} alt="Modell för uträkningarna" style={{ maxWidth: '70%', height: 'auto', marginTop: '20px', marginBottom: '20px' }} />

            <div style={{ flexDirection: 'column', marginBottom: '0px' }}>
              <label htmlFor="L" style={{ marginBottom: '0px' }}><b>L:</b></label>
              <div style={{ display: 'inline-block', marginLeft: '10px'  }}>{L} m</div>
            </div>
            
            <div style={{ flexDirection: 'column', marginBottom: '0px' }}>
              <label htmlFor="hs" style={{ marginBottom: '0px' }}><b>H<sub>s</sub>:</b></label>
              <div style={{ display: 'inline-block', marginLeft: '10px'  }}>{hs} m</div>
            </div>
            
            <div style={{ flexDirection: 'column', marginBottom: '0px' }}>
              <label htmlFor="srp" style={{ marginBottom: '0px' }}><b>S<sub>rp</sub></b>:</label>
              <div style={{ display: 'inline-block', marginLeft: '10px'  }}>{srp} m</div>
            </div>
  
            <table style={{ borderCollapse: 'collapse', width: '70%', marginBottom: '20px', marginTop: '20px' }}>
            <thead>
              <tr>
                <th style={{textAlign: 'left' }}></th>
                <th style={{ textAlign: 'left' }}>min</th>
                <th style={{ textAlign: 'left' }}>medel</th>
                <th style={{ textAlign: 'left' }}>max</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" style={{ paddingTop: '8px' }}>H<sub>0</sub></th>
                <td style={{ padding: '8px' }}>{H0Min}</td>
                <td style={{ padding: '8px' }}>{(H0Min + H0Max)/2}</td>
                <td style={{ padding: '8px' }}>{H0Max}</td>
                <td style={{ paddingTop: '8px' }}>m</td>
              </tr>
              <tr>
                <th scope="row" style={{ paddingTop: '8px' }}>K</th>
                <td style={{ padding: '8px' }}>
                  {KMin < 0.1 ? KMin.toExponential(1) : KMin.toFixed(1)}
                </td>
                <td style={{ padding: '8px' }}>
                  {(KMin + KMax) / 2 < 0.1
                    ? ((KMin + KMax) / 2).toExponential(1)
                    : ((KMin + KMax) / 2).toFixed(1)}
                </td>
                <td style={{ padding: '8px' }}>
                  {KMax < 0.1 ? KMax.toExponential(1) : KMax.toFixed(1)}
                </td>
                <td style={{ paddingTop: '8px' }}>m/s</td>
              </tr>
              <tr>
                <th scope="row" style={{ paddingTop: '8px' }}>W</th>
                <td style={{ padding: '8px' }}>{WMin}</td>
                <td style={{ padding: '8px' }}>{(WMin + WMax)/2}</td>
                <td style={{ padding: '8px' }}>{WMax}</td>
                <td style={{ paddingTop: '8px'}}>mm/år</td>
              </tr>
            </tbody>
          </table>
  
          <div style={{ flexDirection: 'column'}}>
              <label htmlFor="LowerPercentile"><b>Nedre perc:</b></label>
              <div style={{ display: 'inline-block', marginLeft: '10px'  }}>{lowerPercentile} %</div>
            </div>
            
            <div style={{ flexDirection: 'column'}}>
              <label htmlFor="UpperPercentile"><b>Övre perc:</b></label>
              <div style={{ display: 'inline-block', marginLeft: '10px'  }}>{upperPercentile} %</div>
            </div>
            
            <div style={{ flexDirection: 'column', marginBottom: '10px' }}>
              <label htmlFor="srp" style={{ marginBottom: '5px' }}><b>Beräkningar:</b></label>
              <div style={{ display: 'inline-block', marginLeft: '10px'  }}>{iterations}</div>
            </div>
  
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', justifyContent: 'center' }}>
            {histogram && (
              <div style={{ textAlign: 'left' }}>
                <img
                  src={`data:image/png;base64,${histogram}`}
                  alt="Histogram"
                  style={{ maxWidth: '100%', height: 'auto' }} // Justera bredden för bättre passform
                />
              </div>
            )}
  
            {plotImage && (
              <div style={{ textAlign: 'left' }}>
                <img
                  src={`data:image/png;base64,${plotImage}`}
                  alt="Plot"
                  style={{ maxWidth: '100%', height: 'auto' }} // Justera bredden för bättre passform
                />
              </div>
            )}
          </div>
  
            <table style={{ borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px' }}></th>
                <th style={{ padding: '8px' }}>Påverkanavstånd [m]</th>
                <th style={{ padding: '8px' }}>Influensavstånd [m]</th>
                <th style={{ padding: '8px' }}>Ensidigt inflöde [m<sup>3</sup>/s]</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" style={{ padding: '8px' }}>Min</th>
                <td style={{ padding: '8px' }}>{results?.paverkanavstand?.min.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>{results?.influensavstand?.min.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>
                  {results?.ensidigt_inflode?.min < 0.1
                    ? results?.ensidigt_inflode?.min.toExponential(1)
                    : results?.ensidigt_inflode?.min.toFixed(1)}
                </td>
              </tr>
              <tr>
                <th scope="row" style={{ padding: '8px' }}>{lowerPercentile}-perc</th>
                <td style={{ padding: '8px' }}>{results?.paverkanavstand?.lower_percentile.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>{results?.influensavstand?.lower_percentile.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>
                  {results?.ensidigt_inflode?.lower_percentile < 0.1
                    ? results?.ensidigt_inflode?.lower_percentile.toExponential(1)
                    : results?.ensidigt_inflode?.lower_percentile.toFixed(1)}
                </td>
              </tr>
              <tr>
                <th scope="row" style={{ padding: '8px' }}>Median</th>
                <td style={{ padding: '8px' }}>{results?.paverkanavstand?.median.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>{results?.influensavstand?.median.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>
                  {results?.ensidigt_inflode?.median < 0.1
                    ? results?.ensidigt_inflode?.median.toExponential(1)
                    : results?.ensidigt_inflode?.median.toFixed(1)}
                </td>
              </tr>
              <tr>
                <th scope="row" style={{ padding: '8px' }}>{upperPercentile}-perc</th>
                <td style={{ padding: '8px' }}>{results?.paverkanavstand?.upper_percentile.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>{results?.influensavstand?.upper_percentile.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>
                  {results?.ensidigt_inflode?.upper_percentile < 0.1
                    ? results?.ensidigt_inflode?.upper_percentile.toExponential(1)
                    : results?.ensidigt_inflode?.upper_percentile.toFixed(1)}
                </td>
              </tr>
              <tr>
                <th scope="row" style={{ padding: '8px' }}>Max</th>
                <td style={{ padding: '8px' }}>{results?.paverkanavstand?.max.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>{results?.influensavstand?.max.toFixed(1)}</td>
                <td style={{ padding: '8px' }}>
                  {results?.ensidigt_inflode?.max < 0.1
                    ? results?.ensidigt_inflode?.max.toExponential(1)
                    : results?.ensidigt_inflode?.max.toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
          </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Stäng</button>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>Skriv ut</button>
        </div>
      </div>
      )}
      {layout === 'enkel' && (
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title" id="standardModalLabel">Summering</h4>
          <button type="button" className="close" onClick={handleModalClose} aria-label="Close"><span>Close</span></button>
        </div>
        <div className="modal-body">
          <div className="dialog">
            <div className="dialog-body" style={{ textAlign: 'left' }}>
            <div style={{ flexDirection: 'column', marginBottom: '0px' }}>
              <label htmlFor="Projekt" style={{ marginBottom: '0px' }}><b>Projekt:</b></label>
              <div style={{ display: 'inline-block', marginLeft: '10px'  }}>{projekt}</div>
            </div>
            <div style={{ flexDirection: 'column', marginBottom: '0px' }}>
              <label htmlFor="Projektinformation" style={{ marginBottom: '0px' }}><b>Projektinformation:</b></label>
              <div style={{ display: 'inline-block', marginLeft: '10px'  }}>{projektInformation}</div>
            </div>
            <div style={{ flexDirection: 'column', marginBottom: '10px' }}>
              <label htmlFor="L" style={{ marginBottom: '0px' }}><b>Datum:</b></label>
              <div style={{ display: 'inline-block', marginLeft: '10px'  }}>{today}</div>
            </div>

            <img src={modelImageSummary} alt="Modell för uträkningarna" style={{ maxWidth: '70%', height: 'auto', marginTop: '20px', marginBottom: '20px' }} />

            <table style={{ borderCollapse: 'collapse', width: '50%' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}>Påverkansavstånd</td>
              <td style={{ padding: '8px' }}>{results?.paverkanavstand?.median.toFixed(1)}</td>
              <td style={{ padding: '8px' }}>[m]</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>Influensavstånd</td>
              <td style={{ padding: '8px' }}>{results?.influensavstand?.median.toFixed(1)}</td>
              <td style={{ padding: '8px' }}>[m/s]</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>Ensidigt inflöde</td>
              <td style={{ padding: '8px' }}>
                {results?.ensidigt_inflode?.median < 0.1
                  ? results?.ensidigt_inflode?.median.toExponential(1)
                  : results?.ensidigt_inflode?.median.toFixed(1)}
              </td>
              <td style={{ padding: '8px' }}>[m<sup>3</sup>/s]</td>
            </tr>
            <tr className='bordered-tr'>
              <td style={{ padding: '8px' }}>Påverkansavstånd med säkerhetsfaktor </td>
              <td style={{ padding: '8px' }}>{(results?.paverkanavstand?.median * sakerhetsfaktor).toFixed(1)}</td>
              <td style={{ padding: '8px' }}>[m/s]</td>
            </tr>
          </tbody>
        </table>

        <div style={{ flex: 1, maxWidth: '50%', textAlign: 'left', marginTop: '10px'}}>
        <img
          src={`data:image/png;base64,${medianPlotImage}`}
          alt="Median Plot"
          style={{ maxWidth: '100%', height: 'auto' }} // Anpassar bredden automatiskt
        />
      </div>
            
          </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Stäng</button>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>Skriv ut</button>
        </div>
      </div>
      )}
    </div>
  </div>

  <div
        className={`modal fade ${isImageModalOpen ? 'show' : ''}`}
        id="standardModal"
        role="dialog"
        aria-labelledby="standardModalLabel"
        aria-modal="true"
        style={{ display: isImageModalOpen ? 'block' : 'none' }}
      >
        <div className="modal-dialog" role="document" style={{ maxWidth: '70%' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="standardModalLabel"></h4>
              <button
                type="button"
                className="close"
                onClick={handleImageModalClose}
                aria-label="Close"
              >
                <span>Close</span>
              </button>
            </div>
            <div className="modal-body">
              {selectedImage && (
                <img
                  src={`data:image/png;base64,${selectedImage}`}
                  alt="Selected"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    marginBottom: '10px',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      </div>
      </>
    );
};

export default SGU3;