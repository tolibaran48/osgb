const bcrypt = require('bcrypt');
const createToken = require('../../../helpers/token');
const { GraphQLError }=require("graphql");
const auth = require("../../../helpers/auth");

module.exports = {
    createUser: async (parent, args, { token,Kullanici }) => {
        await auth(token);
        
        try {
            const { email, name, surname, phoneNumber, employment, auth } = args.data;
            const user = await Kullanici.findOne({ email })

            if (user) {
                throw new GraphQLError('Bu kulanıcı adına sahip başka bir kullanıcı mevcut.', {
                    extensions: {
                      code: 'Bad Request',
                      status: 400 ,
                    },
                  });
            }

            return await new Kullanici({
                name,
                surname,
                email,
                phoneNumber,
                employment,
                auth
                //    type:"Own",
                //    status:["PublicRelations"]
            }).save();

        } catch (error) {
            throw new GraphQLError(error)
        }
    },

    deleteUser: async (parent, args, { token,Kullanici }) => {
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
        const user = await Kullanici.findOne({ email: email });

        if (!user) {
            throw new GraphQLError('Kullanıcı adı veya parola yanlıştır.', {
                extensions: {
                    code: 'Unauthorized',
                    status: 401 ,
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

        const token = await createToken.generate({ email }, '2h');

        return { user: user, token }
    }    
};