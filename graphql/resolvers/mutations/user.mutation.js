const bcrypt = require('bcrypt');
const createToken = require('../../../helpers/token');
const { GraphQLError } = require("graphql");
const auth = require("../../../helpers/auth");

module.exports = {
    createUser: async (parent, args, { token, Kullanici }) => {
        await auth(token);

        try {
            const { email, name, surname, phoneNumber, employment, auth, password } = args.data;

            let user;

            if (email) {
                if (email === null || email === '') {
                    user = await Kullanici.findOne({ phoneNumber })
                }
                else {
                    user = await Kullanici.findOne({ $or: [{ phoneNumber }, { email }] })
                }
            }
            else {
                user = await Kullanici.findOne({ phoneNumber })
            }

            if (user) {
                if (user.auth.auths.companyAuths.some(aut => aut.company === auth.auths.companyAuths[0].company)) {
                    throw new GraphQLError('Bu kulanıcı bilgilerine sahip bir kullanıcı mevcut.', {
                        extensions: {
                            code: 'Bad Request',
                            status: 400,
                        },
                    });
                }
                else {
                    return await Kullanici.findOneAndUpdate({ phoneNumber },
                        {
                            $set: { 'auth.auths.companyAuths': auth.auths.companyAuths }
                        }, { new: true })
                }
            }
            else {
                try {
                    return await new Kullanici({
                        name,
                        surname,
                        phoneNumber,
                        employment,
                        email,
                        auth,
                        password
                    }).save();
                } catch (error) {
                    console.log(error)
                }

            }

        } catch (error) {
            throw new GraphQLError(error)
        }
    },

    deleteUser: async (parent, args, { token, Kullanici }) => {
        await auth(token);

        try {
            const { email } = args.data;
            const user = await Kullanici.findOne({ email })

            if (!user) {
                throw new GraphQLError('Kayıtlı kullanıcı bulunamadı.', {
                    extensions: {
                        code: 'Bad Request',
                        status: 400,
                    },
                });
            }

            return await Kullanici.findOneAndDelete({ email })

        } catch (error) {
            throw new GraphQLError(error)
        }

    },

    signIn: async (parent, { data: { email, password } }, { Kullanici }) => {
        let phoneNumber = email
        let newPhoneNumber = '(' + phoneNumber.substr(0, 3) + ') ' +
            phoneNumber.substr(3, 3) + ' ' +
            phoneNumber.substr(6, 2) + ' ' + phoneNumber.substr(8, 2);

        const user = await Kullanici.findOne({ $or: [{ phoneNumber: newPhoneNumber }, { email }] });

        if (!user) {
            throw new GraphQLError('Kullanıcı adı veya parola yanlıştır.', {
                extensions: {
                    code: 'Unauthorized',
                    status: 401,
                },
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)


        if (!isMatch) {
            throw new GraphQLError('Kullanıcı adı veya parola yanlıştır.', {
                extensions: {
                    code: 'Unauthorized',
                    status: 401,
                },
            })
        }

        const token = await createToken.generate({ email }, '1h');

        return { user: user, token }
    }
};