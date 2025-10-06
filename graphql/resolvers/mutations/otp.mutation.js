
const auth = require("../../../helpers/auth");
const { GraphQLError } = require('graphql');
const crypto = require('crypto');
const sendSmsOnce = require("../../../functions/sendSMS");
const dayjs = require('dayjs');
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");

dayjs.extend(isSameOrAfter)

module.exports = {
    createOtp: async (parent, args, { token, Otp }) => {
        try {
            let { phone, type } = args.data;
            const text = 'Şifre:';
            const otp = Math.floor(100000 + Math.random() * 900000);
            const registerDate = dayjs(new Date());
            const expires = registerDate.add(5, 'minute');
            const data = `${phone}.${otp}.${expires}`;
            const hash = crypto.createHmac('sha256', process.env.smsKey).update(data).digest('hex');
            const fullhash = `${hash}.${expires}`;
            const tryCount = 3;

            const _otp = await new Otp({
                type,
                phone,
                hash: fullhash,
                tryCount,
                status: 'Active',
                registerDate
            }).save();


            console.log(otp)
            // sendSmsOnce(phone, `Doğrulama kodunuz: ${otp}`)

            return { tryCount, status: 'Active', otpId: _otp._id }

        } catch (error) {
            console.log(error)
            throw new GraphQLError({ msg: 'Onay kodu gönderilemedi' }, {
                extensions: {
                    code: 'Kötü İstek',
                    status: 400,
                },
            })
        }

    },
    validOtp: async (parent, args, { token, Otp }) => {

        try {
            const valid = async (otp, type, otpId, phone) => {

                let _otp = await Otp.findById(otpId)

                let [hashValue, expires] = _otp.hash.split('.');

                if (dayjs(expires).isSameOrAfter(dayjs(new Date()))) {

                    const data = `${phone}.${otp}.${expires}`;
                    const calculateHash = crypto.createHmac('sha256', process.env.smsKey).update(data).digest('hex');

                    if (_otp.tryCount > 0) {
                        if (calculateHash === hashValue) {
                            await Otp.findByIdAndUpdate(otpId, { $set: { status: 'Aborted' } }, { new: true })

                            return { tryCount: _otp.tryCount - 1, status: 'Aborted', responseStatus: 'success' }
                        }
                        else {
                            let newCount = _otp.tryCount - 1;
                            if (newCount > 0) {
                                await Otp.findByIdAndUpdate(otpId, { $set: { tryCount: newCount } }, { new: true })
                                return { tryCount: newCount, status: 'Active', error: 'Telefonunuza gelen kodu tekrar kontrol edin!', responseStatus: 'error', otpId }
                            }
                            else {
                                await Otp.findByIdAndUpdate(otpId, { $set: { status: 'Aborted' } }, { new: true })
                                return { tryCount: newCount, status: 'Aborted', error: 'Deneme hakkınız doldu!', responseStatus: 'error', otpId }
                            }
                        }
                    }
                    else {
                        return { tryCount: newCount, status: 'Active', error: 'Telefonunuza gelen kodu tekrar kontrol edin!', responseStatus: 'error', otpId }
                    }
                }
                else {
                    return { tryCount: _otp.tryCount - 1, status: 'Aborted', error: 'Onay zamanınız doldu!', responseStatus: 'error', otpId }
                }
            }

            const { phone, type, otp, otpId } = args.data;

            return await valid(otp, type, otpId, phone);

        } catch (error) {
            throw new GraphQLError({ msg: error.msg }, {
                extensions: {
                    code: error.extensions.code,
                    status: error.extensions.status,
                },
            })
        }


    }
};
//await Otp.findOneAndUpdate({ phone }, { $set: { 'request.$[elem].status': 'Aborted' } }, { arrayFilters: [{ "elem.status": 'Active' }] }, { new: true })
//sendSmsOnce(phone, `${text} ${otp}`)