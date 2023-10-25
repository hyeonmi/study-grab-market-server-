const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads");
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now());
        },
    }),
});;
const app = express();
const port = 8080;
const models = require('./models');

app.use(express.json()); // json 형식의 데이터를 사용
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get("/products", (req, res) => {
    models.Product.findAll({
        order: [
            ["createdAt", "DESC"]
        ],
        attributes: ["id", "name", "price", "seller", "imageUrl", "createdAt", "soldout"]
    }).then((result) => {
        console.log("PRODUCTS : ", result);
        res.send({ products : result });
    }).catch((error) => {
        console.error(error);
        res.status(400).send("상품 전체 조회에 문제가 발생했습니다.");
    });
});

app.get("/products/:id", (req, res) => {
    const { id } = req.params;
    models.Product.findOne({
        where: { id: id }
    }).then((result) => {
        console.log("PRODUCT : ", result);
        res.send(result);
    }).catch((error) => {
        console.error(error);
        res.status(400).send("상품 조회에 문제가 발생했습니다.");
    });
})

app.post("/product", (req, res) => {
    const body = req.body;
    const { name, description, price, seller, imageUrl } = body;
    if(!name || !description || !price || !seller || !imageUrl){
        res.send("모든 필드를 입력해주세요");
    }
    models.Product.create({
        name,
        description,
        price,
        seller,
        imageUrl
    }).then((result) => {
        console.log("상품 생성 결과 : ", result);
        res.send({ result })
    }).catch((error) => {
        console.error(error);
        res.status(400).send("상품 업로드에 문제가 발생했습니다.");
    })
});

app.post("/image", upload.single("image"), (req, res) => {
    const file = req.file;
    res.send({
        imageUrl: file.path
    })
})


app.get("/banners", (req, res) => {
  models.Banner.findAll({
      limit: 2
  }).then((result) => {
        res.send({ banners: result });
  }).catch((error) => {
     res.status(500).send("배너 조회에 실패했습니다.");
  });
})

app.post("/purchase/:id", (req, res) => {
    const { id } = req.params;
    models.Product.update({
        soldout: 1
    }, {
        where: { id }
    }).then((result) => {
        res.send({ result: true });
    }).catch((error) => {
        res.status(500).send("구매에 실패했습니다.");
    })
})
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


