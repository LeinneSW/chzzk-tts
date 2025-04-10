import {join, resolve} from 'path';
import {TextToSpeechClient} from '@google-cloud/text-to-speech';

process.env.GOOGLE_APPLICATION_CREDENTIALS = join(resolve(), 'data/key.json');

const client = new TextToSpeechClient();
export const googleTTS = async (res, text) => {
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