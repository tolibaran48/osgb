import pdfMake from "pdfmake/build/pdfmake";
import draftToHtml from 'draftjs-to-html';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const pdfPrint = (table,heights) => {
    try {
        const columns = Object.keys(table.headers);
        const cellStyles = table.cellStyles;
        const headers = Object.values(table.headers);
        const columnSizing = Object.values(table.columnSizing);
        let size = []

        const rows = table.data;

        let totalSize=0;
        for (let i = 0; i < columns.length; i++) {
            totalSize += columnSizing[i];
        }
        for (let i = 0; i < columns.length; i++) {
            size.push((columnSizing[i] * 100 / totalSize) + '%')
        }

        const getValue = (columnValue) => {
            let columnObject=JSON.parse(columnValue)
            
            for(let i=0;i<columnObject.blocks.length;i++){
                for(let j=0;j<columnObject.blocks[i].inlineStyleRanges.length;j++){
                    let inlineStyle=columnObject.blocks[i].inlineStyleRanges[j]
                    if(inlineStyle.style.includes('fontsize-')){
                        let unit=parseFloat(inlineStyle.style.substring(9,inlineStyle.style.length-2))
                        let newValue=unit*1
                        columnObject={...columnObject,blocks:[...columnObject.blocks.map((x,index)=>index===i?{...x,inlineStyleRanges:[...x.inlineStyleRanges.map((y,ind)=>ind===j?{...y,style:`fontsize-${newValue}pt`}:y)]}:x)]}
                                } 
                }
            }
            
            const stacks = htmlToPdfmake(draftToHtml(columnObject), {
                // "removeExtraBlanks":true,
                defaultStyles: {
                    p: {
                        margin: [0, 0, 0, 0],
                        padding: 0,
                    },
                    ul: {
                        margin: [0, 0, 0, 0],
                        padding: 0
                    },
                    li: {
                        margin: [0, 0, 0, 0],
                        padding: 0
                    },
                    td: {
                        margin: [0, 0, 0, 0],
                        padding: 0
                    },
                    tr: {
                        margin: [0, 0, 0, 0],
                        padding: 0
                    }
                }

            })
            
            let realStacks = stacks.filter(x => x.nodeName)
            if (realStacks.length === 1) {
                return realStacks[0]
            }
            else {
                let _stacks = { stack: [] }
                for (let i = 0; i < realStacks.length; i++) {
                    if (realStacks[i].text === '') {
                        _stacks.stack.push({ ...realStacks[i], text: ' ' })
                    }
                    else {
                        _stacks.stack.push(realStacks[i])
                    }
                }
                console.log(stacks)
                return _stacks
            }
        }

        const docDefinition = {
            pageSize: { width: 595.28, height: 841.89 },
            info: {
                title: 'İş Sağlığı ve Güvenliği Hizmetleri Teklifi',
                author: 'Berrin ÖZGÜLERGİL',
                to: 'Tolunay BARAN',
                creator: 'Yalıkavak ERP',
                subject: 'İş Güvenliği Hizmeti Teklifi',
                producer: 'Bodrum Yalıkavak İş Sağlığı ve Güvenliği Hizmetleri Ltd. Şti.',
                keywords: 'osgb,iş güvenliği,işyeri hekimi',
            },
            defaultStyle: {
                fontSize: 11,
                characterSpacing:0 
            },
            pageMargins: [30, 65, 30, 0],
            header: {
                margin: [40, 20, 40, 20],
                stack: [
                    {
                        columns: [
                            {
                                width: 'auto',                               
                                text: [
                                    { text: 'bodrum', fontSize: 22, color: 'coral', bold: true, lineHeight: 0.9 },
                                    {
                                        text: [{ text: 'İSG\n', fontSize: 22, color: '#232530', bold: true, lineHeight: 0.9 },
                                        { text: 'İş Sağlığı ve Güvenliği Hizmetleri', fontSize: 7, color: 'black', characterSpacing: 0.34,paddingLeft:1 }]
                                    },
                                ]
                            },

                        ]
                    },
                ],
            },
            content: [
                {
                    //layout: 'lightHorizontalLines',
                    //margin: [0, 10],
                    table: {
                        fontSize: 11,
                        headerRows: 1,
                        widths: size,
                        heights: heights,
                        body:
                            [headers].concat(
                                rows.map((row, index) => {
                                    let pdfRow = []
                                    for (let i = 0; i < columns.length; i++) {
                                        let pdfColumnValue;
                                        let styles = cellStyles.find(x => x.rowIndex === index && x.columnId === `column-${i}`)
                                        if (row[`column-${i}`]) {
                                            pdfColumnValue = getValue(row[`column-${i}`])
                                            if (styles) {
                                                if (styles.col) {
                                                    pdfColumnValue['colSpan'] = styles.cellStyle.colSpan
                                                }
                                                if (styles.row) {
                                                    pdfColumnValue['rowSpan'] = styles.cellStyle.rowSpan
                                                }
                                            }
                                            pdfRow.push(pdfColumnValue)
                                        }
                                        else {
                                            pdfRow.push({ text: ' ' })
                                        }
                                    }
                                    return pdfRow
                                })
                            )
                    }, layout: {
                        defaultBorder: true,
                        hLineWidth: function (i, node) {
                            return (i === node.table.headerRows) ? 1.5 : 0.01;
                        },
                        vLineWidth: function (i) {
                            return 0.01;
                        },
                        hLineColor: function (i) {
                            return 'coral';
                        },
                        vLineColor: function (i) {
                            return 'coral';
                        },
                        fillColor: function (i, node) {
                            if (i < node.table.headerRows) {
                                return '#f9e8d9'
                            }
                        },
                        paddingLeft: function (i, node) {
                            return 3
                        },
                        paddingRight: function (i, node) {
                            return 3
                        },
                        paddingTop: function (i, node) {
                            return 1
                        },
                        paddingBottom: function (i, node) {
                            return 1
                        },
                        fontSize:function (i, node) {
                            return 20;
                        }
                    }

                }
            ],
            styles:
            {
                'html-ins': { decoration: 'underline' }
            }
        }

        pdfMake.createPdf(docDefinition).open({}, window.open());
    }
    catch (error) {
        console.log(error)
    }
}

export default pdfPrint;
