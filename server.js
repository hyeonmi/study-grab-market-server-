const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
const model = require('./models');

app.use(express.json()); // json 형식의 데이터를 사용
app.use(cors());

app.get("/products", (req, res) => {
    res.send({
        "products": [
            {
                "id": 1,
                "name": "농구공",
                "price": 10000,
                "seller": "Jordan",
                "imageUrl": "images/products/basketball1.jpeg"
            },
            {
                "id": 2,
                "name": "축구공",
                "price": 50000,
                "seller": "Jordan",
                "imageUrl": "images/products/soccerball1.jpg"
            },
            {
                "id": 3,
                "name": "키보드",
                "price": 15000,
                "seller": "Grab",
                "imageUrl": "images/products/keyboard1.jpg"
            }
        ]
    });
});

app.get("/product/:id", (req, res) => {
    const { id } = req.params;
    res.send({
        "id": id,
        "name": "농구공",
        "price": 10000,
        "seller": "Jordan",
        "imageUrl": "images/products/basketball1.jpeg",
        "description": "농구공입니다."
    });
})

app.post("/products", (req, res) => {
    const body = req.body;
    res.send({
        body
    });
});

app.listen(port, () => {
    console.log('서버가 실행중입니다.')
    model.sequelize.sync().then(() => {
        console.log('DB 연결 성공');
    }).catch(err => {
        console.log(err);
        console.log('DB 연결 실패');
        process.exit();
    })
});


