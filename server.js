const express = require("express");
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const auth = require("./helpers/auth");
const createToken = require('./helpers/token');
const path = require('path');
const mongoose = require('mongoose');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const resolvers = require('./graphql/resolvers/index.js');
const Kullanici = require("./models/User");
const Firma = require("./models/Company");
const Sicil = require("./models/Insurance");
const Person = require("./models/Person");
const Employee = require("./models/Employee");
const Assignment = require("./models/Assignment");
const Cari = require("./models/Concubine");
const WabaConversation = require("./models/WabaConversation");
const WabaYetkili = require("./models/WabaUser");
const Contract = require("./models/CompanyContracts");
const db = process.env.mongoURI;
const { typeDefs } = require("graphql-scalars");
const { graphqlUploadExpress } = require("graphql-upload-minimal");
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
require('dayjs/locale/tr');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.locale('tr')

mongoose.set("strictQuery", false);
mongoose
    .connect(db, {})
    .then(() => { console.log("MongoDB ye bağlanıldı...") })
    .catch(err => { console.log(err) });



const app = express();

app.use(express.json({ limit: '50mb' }));

app.use('/webhook', require("./routes/waba"));
app.use('/flows/invoice_flow', require("./routes/flows/invoice_flow"));
app.use('/flows/concubine_flow', require("./routes/flows/concubine_flow"));
app.use('/flows/employee_flow', require("./routes/flows/employee_flow"));

/*
app.use(async (req, res, next) => {
    const token = req.headers['authorization'];
    if (token && token != 'null') {
        req.token = token;
    }
    //console.log(req)
    next();

});*/

const httpServer = http.createServer(app);


app.use(express.static("build"))
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});


async function startServer() {
    let schema = loadSchemaSync('./graphql/types/*.graphql', { loaders: [new GraphQLFileLoader()] });


    const server = new ApolloServer({
        typeDefs: [schema, ...typeDefs],
        resolvers,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async requestDidStart() {
                    return {
                        async willSendResponse(requestContext) {
                            const { response, request } = requestContext;
                            const errors = response.body.singleResult.errors
                            try {
                                if (!errors) {
                                    oldToken = request.http.headers.get('authorization')
                                    if (oldToken) {
                                        const user = await auth(oldToken);
                                        const token = await createToken.generate({ email: user.email }, '1h');
                                        response.http.headers.set('authorization', token);
                                    }
                                }
                            } catch (error) {

                            }

                        },
                    };
                },
            },
        ]
    });

    await server.start();

    app.use(graphqlUploadExpress());

    app.use('/graphql', express.json({ limit: '50mb' }),
        cors({ origin: ['https://newosgb-d1ffc736beaa.herokuapp.com', 'http://localhost', 'https://localhost', 'localhost'] }),
        expressMiddleware(server, {
            context: async ({ req }) => ({
                Kullanici,
                Firma,
                Sicil,
                Person,
                Employee,
                Assignment,
                Cari,
                WabaConversation,
                WabaYetkili,
                Contract,
                token: req.headers['authorization']
            }),
        }),
    );
}


startServer();

app.listen(4000, () => {
    console.log('Server 4000 portunda dinlemede...')
})