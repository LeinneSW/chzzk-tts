const path = require('path');
const express = require('express');
const {TextToSpeechClient} = require('@google-cloud/text-to-speech');

const app = express();

process.env.HTTP_PORT = process.env.HTTP_PORT || 5000;
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'data/key.json');

// JSON 파싱과 정적 파일 서빙
app.use(express.text());
app.use(express.static('public'));

app.get('/text-to-speech', (req, res) => {
    const text = req.query.text;
    textToSpeech(text, res);
});

app.post('/text-to-speech', (req, res) => {
    const text = req.body;
    textToSpeech(text, res);
});

app.listen(process.env.HTTP_PORT, () => {
    console.log(`서버가 ${process.env.HTTP_PORT} 포트에서 실행 중입니다.`);
});

const client = new TextToSpeechClient();
async function textToSpeech(text, res){
    if(!res){
        return;
    }

    if(!text){
        return res.status(500).send('음성 생성에 실패했습니다.');
    }
    const request = {
        input: {text},
        voice: {
            languageCode: 'ko-KR',
            ssmlGender: 'NEUTRAL',
        },
        audioConfig: {audioEncoding: 'MP3'},
    };

    client.synthesizeSpeech(request).then(([response]) => {
        // 응답 헤더 설정: audio/mp3로 스트리밍 전송
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': response.audioContent.length
        });
        res.send(response.audioContent);
    }).catch(error => {
        console.error(error);
        res.status(500).send('음성 생성에 실패했습니다.');
    });
}