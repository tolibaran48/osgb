const express = require("express");
const cors = require('cors');
require('dotenv').config();
const http = require('http');
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
const db = process.env.mongoURI;
const { typeDefs } = require("graphql-scalars");
const { graphqlUploadExpress } = require("graphql-upload-minimal");
;

mongoose.set("strictQuery", false);
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("MongoDB ye bağlanıldı...") })
    .catch(err => { console.log(err) });



const app = express();
const webhookApp = express();
webhookApp.use('/webhook', require("./routes/waba"));
//app.use(express.json({limit: '50mb'}));
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
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    });

    await server.start();




    app.use(graphqlUploadExpress());

    app.use('/graphql', express.json({ limit: '50mb' }),
        cors({ origin: ['https://newosgb-d1ffc736beaa.herokuapp.com', 'http://localhost', 'http://localhost', 'localhost'] }),
        expressMiddleware(server, {
            context: async ({ req }) => ({
                Kullanici,
                Firma,
                Sicil,
                Person,
                Employee,
                Assignment,
                Cari,
                token: req.headers['authorization']
            }),
        }),
    );
}


startServer();

app.listen(process.env.PORT || 4000, () => {
    console.log('Server 4000 portunda dinlemede...')
})
webhookApp.listen(process.env.PORT2 || 3000, () => {
    console.log('Webhook 3000 portunda dinlemede...')
})
