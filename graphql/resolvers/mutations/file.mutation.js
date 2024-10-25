const { createWriteStream, unlinkSync } = require('fs');
const path = require('path');

module.exports = {
    uploadFile: async (parent, { file }) => {
        // args.file üzerinden gelen dosya bilgilerini konsola yazdırma
        // Dosya bilgilerini değişkenlere atama
        const { createReadStream, filename, mimetype, encoding } = await file.file;

        //console.log(token);
        //Güvenlik kontrolleri
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        const maxFileSize = 10 * 1024 * 1024; // 10MB

        // Mime tipi kontrolü
        if (!allowedMimeTypes.includes(mimetype)) {
            throw new Error('Dosya türüne izin verilmiyor.');
        }

        const stream = createReadStream();
        const uploadPath = path.join(__dirname, '../../../upload', filename);


        //const totalSize = file.file.size;

        let progress = 0;


        await new Promise((resolve, reject) => {
            const writeStream = createWriteStream(uploadPath);

            stream.on('data', (chunk) => {
                progress += chunk.length // / totalSize;
                // İlerleme değerini burada hesaplıyoruz ve bu değeri döneceğiz.
                // Apollo Client tarafında bu değeri kullanarak ilerlemeyi gösterebiliriz.
                // Örneğin, bu değeri bir WebSocket üzerinden istemciye gönderebiliriz.
                console.log(progress)
            });

            stream.pipe(writeStream);

            writeStream.on('finish', () => resolve({
                success: true,
                message: "Dosya yükleme başarılı",
                progress: 1 // Yükleme tamamlandığında ilerleme değeri 1 olacak
            }));

            writeStream.on('error', (error) => {
                unlinkSync(uploadPath);
                reject({
                    success: false,
                    message: "Dosya yükleme sırasında hata oluştu",
                    progress: progress
                });
            });
        });

        return file.file; // Yükleme başarılıysa dosya bilgilerini döndürme
    },

};
