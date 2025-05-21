import React, { Fragment } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import AppNavbar from '../../components/anonymous/anonymous.component.AppNavbar';
import BottomNavbar from '../../components/anonymous/anonymous.component.BottomNavbar';
import AnaSayfa from './anonymous.page.AnaSayfa';
import Login from './anonymous.page.Login';
import Iletisim from './anonymous.page.Iletisim';
import AcikPozisyonlar from './anonymous.page.AcikPozisyonlar';
import Hakkimizda from './anonymous.page.Hakkimizda';
import SorulanSorular from './anonymous.page.SorulanSorular';
import IsGuvenligiUzmani from './anonymous.page.IsGuvenligiUzmani';
import IsyeriHekimi from './anonymous.page.Isyeri Hekimi';
import SaglikPersoneli from './anonymous.page.SaglikPersoneli';
import Danismanlik from './anonymous.page.Danismanlik';
import Laboratuvar from './anonymous.page.Laboratuvar';
import AzTehlikeliFormPage from './anonymous.page.AzTehlikeliFormPage';
//import AnonymousDuyurular from '../components/anonymous/anonymousDuyurular';
//import AnonymousNotificationMailApprove from '../components/anonymous/anonymousNotificationMailApprove';
//import AnonymousInvoiceMailApprove from '../components/anonymous/anonymousInvoiceMailApprove';

const AnonymousPage = () => {
    const location = useLocation();

    return (
        <Fragment>
            <AppNavbar>
                <Routes>
                    <Route path='/' element={<AnaSayfa />} />
                    <Route path='/hakkimizda' element={<Hakkimizda />} />
                    <Route path='/sikca-sorulan-sorular' element={<SorulanSorular />} />
                    <Route path='/is-guvenligi-uzmani' element={<IsGuvenligiUzmani />} />
                    <Route path='/isyeri-hekimi' element={<IsyeriHekimi />} />
                    <Route path='/saglik-personeli' element={<SaglikPersoneli />} />
                    <Route path='/danismanlik-hizmetleri' element={<Danismanlik />} />
                    <Route path='/laboratuvar-hizmetleri' element={<Laboratuvar />} />
                    <Route path='/iletisim' element={<Iletisim />} />
                    <Route path='/acik-pozisyonlar' element={<AcikPozisyonlar />} />
                    <Route path='/az-tehlikeli-isletmeler' element={<AzTehlikeliFormPage />} />
                    <Route path='/portal-giris' element={<Login />} />
                    <Route path="*" element={<Navigate to="/hata" replace />} />
                </Routes>
            </AppNavbar>
            {location.pathname != '/portal-giris' ? <BottomNavbar /> : null}
        </Fragment>
    )
}

export default AnonymousPage;


