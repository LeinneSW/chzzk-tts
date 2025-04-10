import express from 'express';
import {googleTTS} from './google.js';

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
};
const agentHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
};

const baseURLs = {
    chzzk: "https://api.chzzk.naver.com",
    game: "https://comm-api.game.naver.com/nng_main"
};
const whitelistPatterns = [
    /^\/cors\/chzzk\/service\/v2\/channels\/[^\/]+\/live-detail$/,
    /^\/cors\/chzzk\/polling\/v2\/channels\/[^\/]+\/live-status$/,
    /^\/cors\/game\/v1\/chats\/access-token$/
];

const app = express();
app.use(express.text());
app.use(express.static('public'));

app.get('/text-to-speech', (req, res) => {
    const text = req.query.text || '';
    res.redirect(`https:/www.google.com/speech-api/v1/synthesize?lang=ko-kr&speed=0.5&text=${encodeURIComponent(text)}`);
    //googleTTS(res, text);
});

app.post('/text-to-speech', (req, res) => {
    const text = req.body || '';
    res.redirect(`https:/www.google.com/speech-api/v1/synthesize?lang=ko-kr&speed=0.5&text=${encodeURIComponent(text)}`);
    //googleTTS(res, text);
});

app.get('/cors/:base/*', async (req, res) => {
    // 요청 경로가 화이트리스트 패턴과 일치하는지 확인
    if(!whitelistPatterns.some(pattern => pattern.test(req.path))){
        return res.status(403).set(corsHeaders).send("This URL is not allowed.");
    }

    const {base} = req.params;
    const baseURL = baseURLs[base];
    if(!baseURL){
        return res.status(404).set(corsHeaders).send("Not Found");
    }

    // 대상 URL 구성
    const targetURL = `${baseURL}${req.url.replace(`/cors/${base}`, '')}`;
    try{
        const response = await fetch(targetURL, {headers: agentHeaders});
        const data = await response.text();
        res.set(corsHeaders);
        if(
            (data.startsWith("{") && data.endsWith("}")) ||
            (data.startsWith("[")) && data.endsWith("]")
        ){
            res.type("application/json");
        }
        res.send(data);
    }catch (error){
        console.error("Error fetching data:", error);
        res.status(500).set(corsHeaders).send("Failed to fetch data from the target URL.");
    }
});

const PORT = process.env.HTTP_PORT || 5000;
app.listen(PORT, () => {
    console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});