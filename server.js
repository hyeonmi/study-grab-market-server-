const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
const models = require('./models');

app.use(express.json()); // json 형식의 데이터를 사용
app.use(cors());

app.get("/products", (req, res) => {
    models.Product.findAll({
        order: [
            ["createdAt", "DESC"]
        ],
        attributes: ["id", "name", "price", "seller", "imageUrl", "createdAt"]
    }).then((result) => {
        console.log("PRODUCTS : ", result);
        res.send({ products : result });
    }).catch((error) => {
        console.error(error);
        res.send("상품 전체 조회에 문제가 발생했습니다.");
    });
});

app.get("/product/:id", (req, res) => {
    const { id } = req.params;
    models.Product.findOne({
        where: { id: id }
    }).then((result) => {
        console.log("PRODUCT : ", result);
        res.send(result);
    }).catch((error) => {
        console.error(error);
        res.send("상품 조회에 문제가 발생했습니다.");
    });
})

app.post("/products", (req, res) => {
    const body = req.body;
    const { name, description, price, seller } = body;
    if(!name || !description || !price || !seller){
        res.send("모든 필드를 입력해주세요");
    }
    models.Product.create({
        name,
        description,
        price,
        seller
    }).then((result) => {
        console.log("상품 생성 결과 : ", result);
        res.send({ result })
    }).catch((error) => {
        console.error(error);
        res.send("상품 업로드에 문제가 발생했습니다.");
    })
});

app.listen(port, () => {
    console.log('서버가 실행중입니다.')
    models.sequelize.sync().then(() => {
        console.log('DB 연결 성공');
    }).catch(err => {
        console.log(err);
        console.log('DB 연결 실패');
        process.exit();
    })
});


