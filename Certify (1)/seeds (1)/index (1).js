if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const comunasCL = require('./comunasCL');
const {
    brands,
    models
} = require('./seedHelpers');
const Report = require('../models/report');


// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/CertifyBeta_Dev';
const dbUrl = 'mongodb://localhost:27017/CertifyBeta_Dev';
mongoose.connect(dbUrl);


const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once("open", () => {
    console.log("Database connected");
});



const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Report.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const currentYear = 1990 + Math.floor(Math.random() * 30);
        const currentCondition = Math.floor(Math.random() * 10);
        const currentBrand = sample(brands);
        const currentModel = sample(models);
        const currentLocation = sample(comunasCL);
        const report = new Report({
            brand: currentBrand,
            model: currentModel,
            year: currentYear,
            author: '618d7985a506bc2c72189182',
            condition: currentCondition,
            location: `${currentLocation.city}, ${currentLocation.admin_name}`,
            geometry: {
                type: "Point",
                coordinates: [
                    currentLocation.lng,
                    currentLocation.lat
                ]
            },
            images: [{
                    url: 'https://res.cloudinary.com/aguleonserver/image/upload/v1636624252/Certify/Porsche_1_zv9rht.jpg',
                    filename: 'Certify/Porsche_1_zv9rht'
                },
                {
                    url: 'https://res.cloudinary.com/aguleonserver/image/upload/v1636624252/Certify/Porsche_2_d9tqxr.jpg',
                    filename: 'Certify/Porsche_2_d9tqxr'
                },
                {
                    url: 'https://res.cloudinary.com/aguleonserver/image/upload/v1636624253/Certify/Porsche_3_cq0uex.jpg',
                    filename: 'Certify/Porsche_3_cq0uex'
                },
                {
                    url: 'https://res.cloudinary.com/aguleonserver/image/upload/v1636624251/Certify/Porsche_4_ojvkdf.jpg',
                    filename: 'Certify/Porsche_4_ojvkdf'
                }
            ],
            description: 'El vehículo se encuentra en inmejorable estado. La inspección mecánica arrojó 0 alertas y solo 1 precaución. El sistema de detección de siniestros solamente reporta detalles superficiales menores y ningún daño estructural.',
        })
        await report.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})