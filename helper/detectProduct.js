const tf = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
const fs = require('fs');

module.exports = function detectProduct(url, callback) {
    const image = fs.readFileSync(url);
    const input = tf.node.decodeImage(image, 3); // 2차원 이미지를 3차원으로 변환(RGB + alpha)
    mobilenet.load().then(model => {
        model.classify(input).then(result => {
            callback(result[0].className || null);
        })
    });
}
