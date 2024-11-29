import React from 'react';
import './SGU3Help.css';

const SGU3Help = () => {
    return (
        <>
        <div className='sgu3help-wrapper'>
<div className='sgu3help-container'>
            <h3>Hjälp</h3>
<p className='p-text'> Modellen baseras på Dupuit-Forchheimers antaganden för en brunn eller schakt i
        öppna förhållanden (se bl.a. Todd & Mays). Inflödet till schakten balanseras mot grundvattenbildningen
        inom influensavståndet. <br/><br/>

        Vattenmättad mäktighet på magasinet (H0) kan antas vara från grundvattenytan 
        (gvy) ner till tät botten eller ”kraftig” minskning av K. <br/><br/>

        Vattenmättad mäktighet i schaktbotten (hs) kan ses som återstående grundvatten-
        mäktighet i magasinet vid grundvattensänkningen. Vid behov kan hs innefatta 
        tätande åtgärder och kan ansättas till ett högre värde. Beskrivningen för modell 3
        enligt SGU utgår från att det vattenmättade magasinet är lika djupt som
        schakten. Denna modell är i princip samma men där själva visualiseringen av 
        magasinsmäktigheten skiljer sig något. <br/><br/>
        
        Inflöde till schakt antas ske horisontellt, inte genom botten på schakten.<br/><br/>

        Modellen lämpar sig bäst på schakter som är långsträckta, längre än 1,5 x 1,0. För
        schakter som är mer kvadratiska kan ex. SGU modell 1 vara lämplig. <br/><br/>

        Monte Carlo-simulering innebär att flera beräkningar utförs med slumpade värden
        inom de intervall som anges för parametrarna H0, K och W. H0 och W antas vara
        normalfördelade och K antas vara lognormalfördelad. Vinsten med Monte Carlo-
        simulering är att det statistik kan utföras på resultaten vilket ger en inbyggd
        säkerhetsmarginal. Vanligen anses 90-percentilen av beräknat påverkansavstånd 
        motsvara en ”normal säkerhetsfaktor” ungefär lika med 3 (se Cashman & Preene). 
        Krävs extra säkerhet kan ex. 99-percentilen med fördel användas istället.
        Resultaten mellan exempelvis intervallen 10-percentilen och 90-percentieln kan 
        vara lämpligt att redovisa som ett ”rimligt” spann på resultaten, utan att ta med
        extremvärden. Att studera fördelningen av resultatet från alla beräkningar kan ge 
        en känsla för de osäkerheter som råder. <br/><br/>

        Påverkansavstånd och influensavstånd beräknas från mitten av schakten. Men
        för att få extra marginal i resultaten kan schaktsida / släntfot nyttjas vid 
        redovisning av resultat. <br/><br/>

        Inflöde beräknas ensidigt. För schakter där inflöde sker från två sidor kan
        Inflödet dubblas.
</p>

<h5>Källor:</h5>

Cashman, P.M. & Preene, M. (2013). Groundwater lowering in construction – A practical guide to dewatering. ISBN 978-0-415-66837-8. <br/><br/>

Todd K, D. & Mays W, L. (2005). Groundwater Hydrology. <br/><br/>

SGU. Beräkningsmodeller. <a target="_blank" href="https://www.sgu.se/anvandarstod-for-geologiska-fragor/bedomning-av-influensomrade-avseende-grundvatten/berakningsmodeller/analytiska-modeller/">https://www.sgu.se/anvandarstod-for-geologiska-fragor/bedomning-av-influensomrade-avseende-grundvatten/berakningsmodeller/analytiska-modeller/</a> <br/><br/>

SGU. Influensområde och påverkansområde. <a target="_blank" href="https://www.sgu.se/anvandarstod-for-geologiska-fragor/bedomning-av-influensomrade-avseende-grundvatten/influensomrade-och-paverkansomrade/">https://www.sgu.se/anvandarstod-for-geologiska-fragor/bedomning-av-influensomrade-avseende-grundvatten/influensomrade-och-paverkansomrade/ </a><br/><br/>


</div>
<div className='example-text'>
<h4 className='example-title'>Förslagstext för PM</h4>

        Beräkningarna för avsänkning av grundvattennivån utgår från ett endimensionellt flöde till en långsträckt anläggning i ett magasin med öppna magasinsförhållanden enligt Dupuits formel. Det öppna magasinet antas vara homogent och isotropt och inläckaget antas vara i jämvikt med grundvattenbildningen. <br/><br/>

        I beräkningen av det hydrogeologiska påverkansavståndet finns det vissa osäkerheter och variationer i de ingående parametrarna, t.ex. mättad hydraulisk konduktivitet, grundvattenbildning och mäktighet på vattenförande lager. För att ta hänsyn till dessa osäkerheter har en så kallad Monte Carlo-simulering utförts där de ingående parametervärdena varieras slumpmässigt inom givna intervall. Beräkningen ger en statistisk fördelning av det beräknade influensområdet, givet de ingående parameterintervallen. 
        I utredningen tillämpas ett påverkansavstånd som motsvarar 90:e percentilen av alla möjliga resultat inom intervallet på alla ingående parametrar. På så vis tas hänsyn till osäkerheter för störningens storlek, dess påverkansarea och därmed också störningens komplexitet. <br/><br/>

        Influensavstånd definieras som det avstånd inom vilket grundvattennivåerna avsänks.
        Påverkansavstånd definieras som det avstånd inom vilket avsänkning större än 0,3 m av grundvattennivåerna i jordlager förväntas ske. Denna avsänkning bedöms vara möjlig att urskilja i relation till de naturliga nivåvariationerna på platsen

</div>
</div>
        </>
    );
};

export default SGU3Help;