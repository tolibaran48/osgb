import React, { Fragment } from 'react';
import './anonymous.page.Kariyer.scss'

const AcikPozisyonlar = () => {
  return (

    <Fragment>
      <div id='kariyer-wrapper'>
        <div className='header'>
          <h2>Kariyer</h2>
        </div>
        <div id='content'>
          <div id='content-wrapper'>
            <table>
              <caption>
                Açık Pozisyonlar
              </caption>
              <tbody>
                <tr>
                  <td>A sınıfı İş Güvenliği Uzmanı</td>
                  <td>Detaylar</td>
                  <td>button button</td>
                </tr>
                <tr>
                  <td>İşyeri Hekimi</td>
                  <td>Detaylar</td>
                  <td>button button</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );

}

export default AcikPozisyonlar;
