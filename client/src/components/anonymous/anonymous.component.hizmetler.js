import React, { Fragment } from 'react';
import './anonymous.component.hizmetler.scss'
import { FaUserDoctor, FaUserNurse } from "react-icons/fa6";
import { MdEngineering,MdOutlineReduceCapacity } from "react-icons/md";
import { GiFireSpellCast,GiMicroscope } from "react-icons/gi";
import { HiDocumentMagnifyingGlass } from "react-icons/hi2";

const Services = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',position:'absolute',zIndex:1,bottom:'-2rem' }}>
            
            <div style={{ display: 'flex', gap: '1rem', padding: '.5rem', justifyContent: 'start',width:'90vw'}}>
                <div className="card">
                    <div className="header">
                        <div className="image">
                            <FaUserDoctor style={{ width: '22.5px', height: '22.5px' }} />
                        </div>
                        <div className="content">
                            <span className="title">İşyeri Hekimi</span>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="header">
                        <div className="image">
                            <MdEngineering style={{ width: '30px', height: '30px' }} />
                        </div>
                        <div className="content">
                            <span className="title">İş Güvenliği Uzmanı</span>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="header">
                        <div className="image">
                            <FaUserNurse style={{ width: '22.5px', height: '22.5px' }} />
                        </div>
                        <div className="content">
                            <span className="title">Diğer Sağlık Personeli</span>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="header">
                        <div className="image">
                            <GiFireSpellCast style={{ width: '22.5px', height: '22.5px' }} />
                        </div>
                        <div className="content">
                            <span className="title">Acil Durum Planı</span>
                        </div>
                    </div>
                </div>
                 <div className="card">
                    <div className="header">
                        <div className="image">
                            <HiDocumentMagnifyingGlass style={{ width: '22.5px', height: '22.5px' }} />
                        </div>
                        <div className="content">
                            <span className="title">Risk Değerlendirmesi</span>
                        </div>
                    </div>
                </div>
                 <div className="card">
                    <div className="header">
                        <div className="image">
                            <MdOutlineReduceCapacity style={{ width: '22.5px', height: '22.5px' }} />
                        </div>
                        <div className="content">
                            <span className="title">İSG Eğitimi</span>
                        </div>
                    </div>
                </div>
                 <div className="card">
                    <div className="header">
                        <div className="image">
                            <GiMicroscope style={{ width: '22.5px', height: '22.5px' }} />
                        </div>
                        <div className="content">
                            <span className="title">Sağlık Tetkiki</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Services;