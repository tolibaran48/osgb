const { GraphQLError } = require('graphql');
const assignmentControl = require('../../../helpers/assignmentControl');
const auth = require("../../../helpers/auth");


module.exports = {
    createInsurance: async (parent, args, { token, Sicil, Assignment }) => {
        await auth(token);

        let _assignment = {
            isgKatipName: '',
            tehlikeSinifi: '',
            employeeCount: 0,
            assignmentStatus: {
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
        }
        const { company, descriptiveName, insuranceNumber, insuranceControlNumber, adress } = args.data;
        const insurance = await Sicil.findOne({ "insuranceNumber": insuranceNumber })

        if (insurance) {
            throw new GraphQLError('Bu sicil numarası sistemde kayıtlıdır!', {
                extensions: {
                    code: 'Bad Request',
                    status: 400,
                    locations: ('createInsurance')
                },
                path: 'grapgql/resolvers/mutations/insurance.mutation'
            });
        }

        const _assignmentArray = await Assignment.find({ 'insuranceControlNumber': insuranceControlNumber })
        if (_assignmentArray.length > 0) {
            assignment = await assignmentControl(_assignmentArray)
            await Firma.findOneAndUpdate({ _id: company }, { $set: { isgKatipName: assignment[0].isgKatipName } }, { new: true })
        }
        else {
            assignment = [_assignment];
        }

        try {
           return new Sicil({
                company,
                descriptiveName,
                insuranceNumber,
                insuranceControlNumber,
                adress,
                'assignmentStatus': assignment[0].assignmentStatus,
                'employeeCount': assignment[0].employeeCount,
                'isgKatipName': assignment[0].isgKatipName,
                'tehlikeSinifi': assignment[0].tehlikeSinifi
            }).save()
        } catch (error) {
            throw new GraphQLError(error.message, {
                extensions: {
                    code: 'Internal Server Error',
                    status: 500,
                    locations: ('createInsurance')
                },
                path: 'grapgql/resolvers/mutations/insurance.mutation'
            });
        }

    },

    updateInsurance: async (parent, args, { token, Sicil, Assignment, Firma }) => {
        await auth(token);
        let assignment;
        let companyKatip = null;

        const { descriptiveName, insuranceNumber, insuranceControlNumber, adress, _id, workingStatus, company } = args.data;

        let _insurance = {
            descriptiveName,
            adress,
            workingStatus,
        }

        let _assignment = {
            isgKatipName: '',
            tehlikeSinifi: '',
            employeeCount: 0,
            assignmentStatus: {
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
        }

        let _insuranceControlNumber = insuranceNumber.split('-').join('');
        if (insuranceControlNumber != _insuranceControlNumber) {
            const insurance = await Sicil.findOne({ $and: [{ 'insuranceNumber': insuranceNumber }, { '_id': { $ne: _id } }] })

            if (insurance) {
                throw new GraphQLError('Bu sicil numarası sistemde kayıtlıdır!', {
                    extensions: {
                        code: 'Bad Request',
                        status: 400,
                        locations: ('updateInsurance')
                    },
                    path: 'grapgql/resolvers/mutations/insurance.mutation'
                });

            }
            else {
                const _assignmentArray = await Assignment.find({ 'insuranceControlNumber': _insuranceControlNumber })
                if (_assignmentArray.length > 0) {
                    assignment = await assignmentControl(_assignmentArray)
                    companyKatip = assignment[0].isgKatipName;
                }
                else {
                    assignment = [_assignment];
                }

                _insurance = {
                    descriptiveName,
                    adress,
                    insuranceNumber,
                    workingStatus,
                    insuranceControlNumber: _insuranceControlNumber,
                    'assignmentStatus': assignment[0].assignmentStatus,
                    'employeeCount': assignment[0].employeeCount,
                    'isgKatipName': assignment[0].isgKatipName,
                    'tehlikeSinifi': assignment[0].tehlikeSinifi
                }

                if (companyKatip === null) {
                    const _insurances = await Sicil.find({ $and: [{ 'company': company }, { '_id': { $ne: _id } }] })
                    if (_insurances.length > 0) {
                        for (let i = 0; i < _insurances.length; i++) {
                            if (_insurances[i].isgKatipName != '') {
                                companyKatip = _insurances[i].isgKatipName;
                                break;
                            }
                        }
                    }
                }
                await Firma.findOneAndUpdate({ _id: company }, { $set: { isgKatipName: companyKatip } }, { new: true })
            }
        }

        try {
            return await Sicil.findOneAndUpdate({ _id: _id },
                {
                    $set: _insurance
                }, { new: true })

        } catch (error) {
            throw new GraphQLError(error.message, {
                extensions: {
                    code: 'Internal Server Error',
                    status: 500,
                    locations: ('updateInsurance')
                },
                path: 'grapgql/resolvers/mutations/insurance.mutation'
            });
        }
    },

    updateManyInsurance: async (parent, args, { token, Sicil, Assignment, Firma }) => {
        await auth(token);
        
        try {
            const assignments = args.data.insuranceAss;

            const siciller = await assignmentControl(assignments).then(async (_assignments) => {
                await Sicil.updateMany({}, {
                    $set: {
                        'employeeCount': 0,
                        'isgKatipName': '',
                        'tehlikeSinifi': null,
                        'assignmentStatus': {
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
                    }
                })
                await Assignment.deleteMany()
                return await Assignment.insertMany(assignments).then(async function () {
                    return await updateAssignment(_assignments)
                })
            })
            return siciller

            async function updateAssignment(assignments) {
                const assignmentArray = []
                for (const assignment of assignments) {
                    await Sicil.findOneAndUpdate({ insuranceControlNumber: assignment.insuranceControlNumber }, [{ $unset: ["firmaGuid"] }, { $set: { assignmentStatus: assignment.assignmentStatus, employeeCount: assignment.employeeCount, isgKatipName: assignment.isgKatipName, tehlikeSinifi: assignment.tehlikeSinifi } }], { new: true })
                        //DEĞİŞTİRİLEBİLİR
                        .then(async function (insurance) {
                            if (insurance != null) {
                                await Firma.findOneAndUpdate({ _id: insurance.company }, { $set: { isgKatipName: insurance.isgKatipName } }, { new: true })
                            }
                            else {
                                console.log(assignment)
                            }
                        })
                    //--------------------
                    assignmentArray.push(assignment)
                }

                return await Promise.all(assignmentArray).then(async () => {
                    return await Sicil.find().sort({ "workingStatus": 1, "company": 1 }).populate('company')
                        .then(insurances => {
                            return (insurances.map(insurance => ({
                                '_id': insurance._id,
                                'company': insurance.company._id,
                                'companyName': insurance.company.name,
                                'isgKatipName': insurance.isgKatipName,
                                'descriptiveName': insurance.descriptiveName,
                                'insuranceNumber': insurance.insuranceNumber,
                                'employeeCount': insurance.employeeCount,
                                'workingStatus': insurance.workingStatus,
                                'assignmentStatus': insurance.assignmentStatus,
                                'tehlikeSinifi': insurance.tehlikeSinifi,
                                'adress': insurance.adress
                            })))
                        })
                })
            }

        }
        catch (error) {
            throw new GraphQLError(error.message, {
                extensions: {
                    code: 'Internal Server Error',
                    status: 500,
                    locations: ('updateManyInsurance')
                },
                path: 'grapgql/resolvers/mutations/insurance.mutation'
            });
        }
    },
   
};