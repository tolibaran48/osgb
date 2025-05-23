const auth = require("../../../helpers/auth");
const { GraphQLError } = require('graphql');
const { createWriteStream, unlinkSync, existsSync, mkdirSync } = require('fs');
const path = require('path');
const mongoose = require('mongoose');

module.exports = {
    createEmployee: async (parent, args, { token, Employee }) => {
        await auth(token);

        console.log(Date.parse(args.data.entryDate))
        try {
            const { person, insurance, entryDate } = args.data;

            return await new Employee({
                person,
                insurance,
                entryDate: Date.parse(entryDate),
            }).save();

        } catch (error) {
            throw new GraphQLError(error)
        }
    },
    uploadWhatsAppDocument: async (parent, args, { token, Employee, Person }) => {
        await auth(token);

        const { file, name, surname, company, identityId, companyVergi, processTime } = await args.data;
        const { createReadStream, filename, mimetype, encoding } = await file.file;



        const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];

        // Mime tipi kontrolü
        if (!allowedMimeTypes.includes(mimetype)) {
            throw new Error('Dosya türüne izin verilmiyor.');
        }

        const stream = createReadStream();
        const filetype = mimetype.split("/")[1]
        const underPath = path.join(__dirname, `../../../employeeFiles/${companyVergi}`);
        const uploadPath = path.join(__dirname, `../../../employeeFiles/${companyVergi}`, `${identityId}-${name} ${surname}.${filetype}`);

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            let person = await Person.findOne({ "identityId": identityId });

            if (!person || person == null) {
                person = await new Person({
                    name,
                    surname,
                    identityId
                }).save({ session })
            }

            let employee = await Employee.findOne({ "person": person._id });
            if (!employee || employee == null) {
                employee = await new Employee({
                    person: person._id,
                    processTime: processTime,
                    company
                }).save({ session })
            }


            if (!existsSync(underPath)) {
                mkdirSync(underPath, { recursive: true });
            }

            await new Promise((resolve, reject) => {
                const writeStream = createWriteStream(uploadPath);
                stream.pipe(writeStream);

                writeStream.on('finish', () => resolve(true));

                writeStream.on('error', (error) => {
                    unlinkSync(uploadPath);
                    throw new Error(error)
                });
            });

            await session.commitTransaction();
            return true
        }
        catch (error) {
            await session.abortTransaction()
            res.status(400).json({ msg: error.message })
        }
        finally {
            session.endSession();
        }

    },
}