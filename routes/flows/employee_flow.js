const router = require('express').Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const decryptRequest = require('../../functions/waba/decryptRequest');
const encryptResponse = require('../../functions/waba/encryptResponse');
const dayjs = require('dayjs');
const createToken = require('../../helpers/token');
require('dotenv').config();
const _ = require('lodash');

router.post("/", async ({ body }, res) => {
    let privateFile = path.resolve('./functions/waba/files/private.pem')
    let PRIVATE_KEY = fs.readFileSync(privateFile, 'utf8');
    const { decryptedBody, aesKeyBuffer, initialVectorBuffer } = await decryptRequest(
        body,
        PRIVATE_KEY,
    );

    const screenData = await getNext(decryptedBody)

    // Return the response as plaintext
    const _response = await encryptResponse(screenData, aesKeyBuffer, initialVectorBuffer)
    res.send(_response);
});

const getEmployees = async (company, token) => {
    const _employees = await axios({
        url: `${process.env.LOCALHOST}/graphql`,
        method: 'post',
        headers: {
            "authorization": token
        },
        data: {
            query: `query{
                company(vergiNumarasi: "${company}") {
                    name
                    employees {
                        person {
                            identityId
                            name
                            surname
                        }
                    }
                }
            }`
        }
    })


    let sortEmployees = _.sortBy(_employees.data.data.company.employees, ["person.name", "person.surname"])
    const allEmployees = sortEmployees.map((employee) => {
        return { "id": employee.person.identityId, "title": `${employee.person.name} ${employee.person.surname}`, "description": employee.person.identityId, "alt-text": "personel resmi", "image": "" }
    })

    return { allEmployees, companyName: _employees.data.data.company.name };
};

const getNext = async (decryptedBody) => {
    const token = await createToken.generate({ email: process.env.wabaTokenMail }, '5m');
    const { screen, data, version, action } = decryptedBody;
    // Return the next screen & data to the client  
    let getResponse
    let allEmployees
    let employees
    console.log(decryptedBody)


    if (action === "ping") {
        return {
            data: {
                status: "active",
            },
        };
    }

    if (data?.error) {
        console.warn("Received client error:", data);
        return {
            data: {
                acknowledged: true,
            },
        };
    }

    if (action === "data_exchange") {
        switch (screen) {
            case "COMPANY":

                getResponse = await getEmployees(data.company, token)
                allEmployees = getResponse.allEmployees

                employees = _.slice(allEmployees, 0, 10)

                return {
                    screen: 'EMPLOYEES',
                    data: { employees, "pageNumber": 0, "employeeCount": allEmployees.length, "pageCount": 10 },
                };

            case "EMPLOYEES":
                let { pageNumber, employeeCount, formEmployees, general_init_value, phoneNumber, company } = data
                switch (data.type) {
                    case "next":
                        getResponse = await getEmployees(data.company, token)
                        allEmployees = getResponse.allEmployees

                        let newPageNumber = pageNumber + 1;
                        employees = _.slice(allEmployees, (newPageNumber * 10), ((newPageNumber + 1) * 10))

                        let next_general_init_value = [];
                        formEmployees?.forEach(employee => {
                            next_general_init_value.push(`${pageNumber}/${employee}`)
                        })

                        let next_init_value = [];
                        general_init_value?.forEach((value) => {
                            let val = value.split("/")
                            let page = val[0]
                            let init = val[1]
                            if (page == pageNumber + 1) {
                                next_init_value.push(init);
                            }
                            else {
                                next_general_init_value.push(value)
                            }
                        });
                        console.log(next_general_init_value, next_init_value)
                        return {
                            screen: 'EMPLOYEES',
                            data: { employees, "pageNumber": newPageNumber, "employeeCount": allEmployees.length, "init_value": next_init_value, "general_init_value": next_general_init_value, "pageCount": (newPageNumber + 1) * 10 },
                        };

                    case "previous":
                        let previous_general_init_value = [];

                        formEmployees?.forEach(employee => {
                            previous_general_init_value.push(`${pageNumber}/${employee}`)
                        })

                        let previous_init_value = [];
                        general_init_value?.forEach((value) => {
                            let val = value.split("/")
                            let page = val[0]
                            let init = val[1]
                            if (page == pageNumber - 1) {
                                previous_init_value.push(init)
                            }
                            else {
                                previous_general_init_value.push(value)
                            }
                        });

                        getResponse = await getEmployees(data.company, token)
                        allEmployees = getResponse.allEmployees

                        employees = _.slice(allEmployees, ((pageNumber - 1) * 10), (pageNumber * 10))

                        return {
                            screen: 'EMPLOYEES',
                            data: { employees, "pageNumber": pageNumber - 1, "employeeCount": allEmployees.length, "init_value": previous_init_value, "general_init_value": previous_general_init_value, "pageCount": pageNumber * 10 },
                        };
                    case "finish":

                        general_init_value?.forEach((value) => {
                            formEmployees.push(value.split("/")[1])
                        });

                        getResponse = await getEmployees(data.company, token)
                        allEmployees = getResponse.allEmployees

                        if (formEmployees.length > 0) {
                            formEmployees.forEach(async (identity) => {
                                let _employee = allEmployees.find((element) => element.id === identity)

                                const es = await axios({
                                    url: `${process.env.LOCALHOST}/graphql`,
                                    method: 'post',
                                    headers: {
                                        "authorization": token
                                    },
                                    data: {
                                        query: `mutation{
                                       sendEmployeeDocument(data:{to: "90${data.phoneNumber}", identityId: "${_employee.id}",namesurname: "${_employee.title}",companyName:"${getResponse.companyName}",type: "employeeFiles/${company}",fileName: "${_employee.id}-${_employee.title}"}){
                                        status
                                       }}`
                                    }
                                })
                            })
                        }


                        return {
                            screen: "SUCCESS",
                            data: {
                                extension_message_response: {
                                    params: {
                                        "flow_token": decryptedBody.flow_token,
                                    },
                                },
                            },
                        };

                    default:
                        break;
                }
        }
    }

    console.error("Unhandled request body:", decryptedBody);
    throw new Error(
        "Unhandled endpoint request. Make sure you handle the request action & screen logged above."
    );

}

module.exports = router;