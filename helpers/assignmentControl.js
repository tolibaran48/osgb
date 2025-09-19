const assignmentControl = async (insurances) => {
    const sicillers = [];

    for (const insurance of insurances) {
        const employeeCount = parseInt(insurance.assignments[0].employeeCount);
        const isgKatipName = insurance.assignments[0].isgKatipName;
        const tehlikeSinifi = insurance.assignments[0].tehlikeSinifi;
        const insuranceControlNumber = insurance.insuranceControlNumber;

        sicillers.push(new Promise((resolve, reject) => {
            let sn = {
                atamalar: {
                    uzmanStatus: {
                        assignmentTotal: 0,
                        approvalAssignments: [
                        ]
                    },
                    hekimStatus: {
                        assignmentTotal: 0,
                        approvalAssignments: [
                        ]
                    },
                    dspStatus: {
                        assignmentTotal: 0,
                        approvalAssignments: [

                        ]
                    }
                }
            };
            try {
                for (let _assignment of insurance.assignments) {

                    if (_assignment.category.includes('İş Güvenliği Uzmanlığı')) {
                        if (_assignment.workingStatus === 'Sözleşme Teklif Durumunda' || _assignment.workingStatus === 'Sözleşme Devam Ediyor' || _assignment.workingStatus === 'Sözleşme Sonlandırıldı') {
                            if (_assignment.workingStatus === 'Sözleşme Devam Ediyor') {
                                sn = {
                                    ...sn,
                                    atamalar: {
                                        ...sn.atamalar,
                                        uzmanStatus: {
                                            ...sn.atamalar.uzmanStatus,
                                            assignmentTotal: parseInt(sn.atamalar.uzmanStatus.assignmentTotal) + parseInt(_assignment.assignmentTime),
                                            approvalAssignments: [...sn.atamalar.uzmanStatus.approvalAssignments,
                                            {
                                                approvalStatus: "Onaylandı",
                                                assignmentId: _assignment.assignmentId,
                                                identityId: _assignment.identityId.toString(),
                                                nameSurname: _assignment.nameSurname,
                                                category: _assignment.category,
                                                assignmentTime: _assignment.assignmentTime,
                                                startDate: _assignment.startDate,
                                            }
                                            ]

                                        }
                                    }
                                }
                            }
                            else if (_assignment.workingStatus === 'Sözleşme Teklif Durumunda') {
                                sn = {
                                    ...sn,
                                    atamalar: {
                                        ...sn.atamalar,
                                        uzmanStatus: {
                                            ...sn.atamalar.uzmanStatus,
                                            assignmentTotal: parseInt(sn.atamalar.uzmanStatus.assignmentTotal) + parseInt(_assignment.assignmentTime),
                                            approvalAssignments: [...sn.atamalar.uzmanStatus.approvalAssignments,
                                            {
                                                approvalStatus: "Onay Bekliyor",
                                                assignmentId: _assignment.assignmentId,
                                                identityId: _assignment.identityId.toString(),
                                                nameSurname: _assignment.nameSurname,
                                                category: _assignment.category,
                                                assignmentTime: _assignment.assignmentTime,
                                                startDate: _assignment.identificationDate,
                                            }
                                            ]

                                        }
                                    }
                                }
                            }
                            else {
                                if (_assignment.workingApproveStatus == 'Sözleşme Onaylandı') {
                                    sn = {
                                        ...sn,
                                        atamalar: {
                                            ...sn.atamalar,
                                            uzmanStatus: {
                                                ...sn.atamalar.uzmanStatus,
                                                approvalAssignments: [...sn.atamalar.uzmanStatus.approvalAssignments,
                                                {
                                                    approvalStatus: 'Sözleşme İptal',
                                                    assignmentId: _assignment.assignmentId,
                                                    identityId: _assignment.identityId.toString(),
                                                    nameSurname: _assignment.nameSurname,
                                                    category: _assignment.category,
                                                    assignmentTime: _assignment.assignmentTime,
                                                    startDate: _assignment.startDate,
                                                    endDate: _assignment.endDate,
                                                }
                                                ]

                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (_assignment.category.includes('İşyeri Hekimliği')) {
                        if (_assignment.workingStatus === 'Sözleşme Teklif Durumunda' || _assignment.workingStatus === 'Sözleşme Devam Ediyor' || _assignment.workingStatus === 'Sözleşme Sonlandırıldı') {
                            if (_assignment.workingStatus === 'Sözleşme Devam Ediyor') {
                                sn = {
                                    ...sn,
                                    atamalar: {
                                        ...sn.atamalar,
                                        hekimStatus: {
                                            ...sn.atamalar.hekimStatus,
                                            assignmentTotal: parseInt(sn.atamalar.hekimStatus.assignmentTotal) + parseInt(_assignment.assignmentTime),
                                            approvalAssignments: [...sn.atamalar.hekimStatus.approvalAssignments,
                                            {
                                                approvalStatus: 'Onaylandı',
                                                assignmentId: _assignment.assignmentId,
                                                identityId: _assignment.identityId.toString(),
                                                nameSurname: _assignment.nameSurname,
                                                category: _assignment.category,
                                                assignmentTime: _assignment.assignmentTime,
                                                startDate: _assignment.startDate,
                                            }
                                            ]

                                        }
                                    }
                                }
                            }
                            else if (_assignment.workingStatus === 'Sözleşme Teklif Durumunda') {
                                sn = {
                                    ...sn,
                                    atamalar: {
                                        ...sn.atamalar,
                                        hekimStatus: {
                                            ...sn.atamalar.hekimStatus,
                                            assignmentTotal: parseInt(sn.atamalar.hekimStatus.assignmentTotal) + parseInt(_assignment.assignmentTime),
                                            approvalAssignments: [...sn.atamalar.hekimStatus.approvalAssignments,
                                            {
                                                approvalStatus: 'Onay Bekliyor',
                                                assignmentId: _assignment.assignmentId,
                                                identityId: _assignment.identityId.toString(),
                                                nameSurname: _assignment.nameSurname,
                                                category: _assignment.category,
                                                assignmentTime: _assignment.assignmentTime,
                                                startDate: _assignment.identificationDate,
                                            }
                                            ]

                                        }
                                    }
                                }

                            }
                            else {
                                if (_assignment.workingApproveStatus == 'Sözleşme Onaylandı') {
                                    sn = {
                                        ...sn,
                                        atamalar: {
                                            ...sn.atamalar,
                                            hekimStatus: {
                                                ...sn.atamalar.hekimStatus,
                                                approvalAssignments: [...sn.atamalar.hekimStatus.approvalAssignments,
                                                {
                                                    approvalStatus: 'Sözleşme İptal',
                                                    assignmentId: _assignment.assignmentId,
                                                    identityId: _assignment.identityId.toString(),
                                                    nameSurname: _assignment.nameSurname,
                                                    category: _assignment.category,
                                                    assignmentTime: _assignment.assignmentTime,
                                                    startDate: _assignment.startDate,
                                                    endDate: _assignment.endDate,
                                                }
                                                ]

                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                    else if (_assignment.category.includes('Diğer Sağlık Personeli')) {
                        if (_assignment.workingStatus === 'Sözleşme Teklif Durumunda' || _assignment.workingStatus === 'Sözleşme Devam Ediyor' || _assignment.workingStatus === 'Sözleşme Sonlandırıldı') {
                            if (_assignment.workingStatus === 'Sözleşme Devam Ediyor') {
                                sn = {
                                    ...sn,
                                    atamalar: {
                                        ...sn.atamalar,
                                        dspStatus: {
                                            ...sn.atamalar.dspStatus,
                                            assignmentTotal: parseInt(sn.atamalar.dspStatus.assignmentTotal) + parseInt(_assignment.assignmentTime),
                                            approvalAssignments: [...sn.atamalar.dspStatus.approvalAssignments,
                                            {
                                                approvalStatus: 'Onaylandı',
                                                assignmentId: _assignment.assignmentId,
                                                identityId: _assignment.identityId.toString(),
                                                nameSurname: _assignment.nameSurname,
                                                category: _assignment.category,
                                                assignmentTime: _assignment.assignmentTime,
                                                startDate: _assignment.startDate,
                                            }
                                            ]

                                        }
                                    }
                                }
                            }
                            else if (_assignment.workingStatus === 'Sözleşme Teklif Durumunda') {
                                sn = {
                                    ...sn,
                                    atamalar: {
                                        ...sn.atamalar,
                                        dspStatus: {
                                            ...sn.atamalar.dspStatus,
                                            assignmentTotal: parseInt(sn.atamalar.dspStatus.assignmentTotal) + parseInt(_assignment.assignmentTime),
                                            approvalAssignments: [...sn.atamalar.dspStatus.approvalAssignments,
                                            {
                                                approvalStatus: 'Onay Bekliyor',
                                                assignmentId: _assignment.assignmentId,
                                                identityId: _assignment.identityId.toString(),
                                                nameSurname: _assignment.nameSurname,
                                                category: _assignment.category,
                                                assignmentTime: _assignment.assignmentTime,
                                                startDate: _assignment.identificationDate,
                                            }
                                            ]

                                        }
                                    }
                                }


                            }
                            else {
                                if (_assignment.workingApproveStatus == 'Sözleşme Onaylandı') {
                                    sn = {
                                        ...sn,
                                        atamalar: {
                                            ...sn.atamalar,
                                            dspStatus: {
                                                ...sn.atamalar.dspStatus,
                                                approvalAssignments: [...sn.atamalar.dspStatus.approvalAssignments,
                                                {
                                                    approvalStatus: 'Sözleşme İptal',
                                                    assignmentId: _assignment.assignmentId,
                                                    identityId: _assignment.identityId.toString(),
                                                    nameSurname: _assignment.nameSurname,
                                                    category: _assignment.category,
                                                    assignmentTime: _assignment.assignmentTime,
                                                    startDate: _assignment.startDate,
                                                    endDate: _assignment.endDate,
                                                }
                                                ]

                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                reject(error)
            }

            resolve({ assignmentStatus: sn.atamalar, employeeCount, isgKatipName, tehlikeSinifi, insuranceControlNumber })

        }))
    }

    const results = await Promise.all(sicillers)
    return results
}

module.exports = assignmentControl;