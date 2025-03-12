const jwt = require('jsonwebtoken');
const auth = require("../../../helpers/auth");
const { GraphQLError } = require('graphql');

const Kullanici = {
    user: async (parent, args, { token, Kullanici }) => {
        await auth(token);

        try {
            return await Kullanici.findOne({ phoneNumber: args.phoneNumber });
        } catch (error) {
            throw new GraphQLError(error)
        }
    },
    users: async (parent, args, { token, Kullanici }) => {
        await auth(token);
        try {

            /* let users = await Kullanici.find();
            for (let i = 0; i < users.length; i++) {
                let user = users[i]
                let companyAuths = [];
                let employment = user.employment
                let auths = user.auth.auths.companyAuths
                let mn = new Kullanici({
                    name: user.name,
                    surname: user.surname,
                    phoneNumber: user.phoneNumber,
                    auth: { ...user.auth, auths: { ...user.auth.auths, companyAuths: [] } }
                })
                for (let j = 0; j < auths.length; j++) {
                    let _auth = user.auth.auths.companyAuths[j]
                    if (_auth) {
                        let _obj = {
                            company: _auth.company,
                            roles: _auth.roles,
                            _id: _auth._id,
                            employment: employment
                        }
                        _auth.employment = employment;
                        //console.log(_auth.employment)
                        mn.auth.auths.companyAuths.push(_obj)
                    }
                }
                // console.log(companyAuths)

                //let mn = { ...user, auth: { ...user.auth, auths: { ...user.auth.auths, companyAuths: companyAuths } } };
                //let _user = { ...user, auth: { ...user.auth, auths: { ...user.auth.auths, companyAuths: companyAuths } } }
                console.log(mn.auth.auths)*/

            return await Kullanici.find({})


        } catch (error) {
            throw new GraphQLError(error)
        }
    },
    activeUser: async (parent, args, { token, Kullanici }) => {
        if (!token) {
            return null;
        }

        const values = await auth(token);
        let phoneNumber = ''
        if (values.email.length === 10) {
            phoneNumber = '(' + values.email.substr(0, 3) + ') ' +
                values.epostal.substr(3, 3) + ' ' +
                values.email.substr(6, 2) + ' ' + values.email.substr(8, 2);
        }

        try {
            const user = await Kullanici.findOne({ $or: [{ phoneNumber }, { email: values.email }] });

            if (user) {

                return { user: user, token: token }
            }
            else {
                throw new GraphQLError('Kullanıcı bulunamadı', {
                    extensions: {
                        code: 'Bad Request',
                        status: 400,
                    },
                })
            }
        }
        catch (error) {
            throw new GraphQLError(error.message, {
                extensions: {
                    code: 'Unauthorized',
                    status: 401,
                },
            })
        }
    }
};

module.exports = Kullanici;