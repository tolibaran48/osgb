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
            return await Kullanici.find({});
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