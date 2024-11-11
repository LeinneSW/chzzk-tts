const ttsQueue = [];
let isPlaying = false;

const emojiRegex = /\p{Emoji}/u; // 이모지 구분 정규식

const addTTSQueue = (text) => {
    let repeatData = null;

    // 반복 글자 파악 로직(도배 방지를 위해 추가)
    const len = Math.floor(text.length / 4);
    for(let i = 1; i <= len; ++i){ // 문자열의 길이의 1/4 까지만 확인(4회이상 반복하는지 파악)
        let index = 0, count = 1;
        const substring = text.substring(0, i);
        while((index = text.indexOf(substring, index + i)) !== -1){
            ++count;
        }
        if(count > 3 && count * substring.length === text.length){
            repeatData = {substring, count};
            break;
        }
    }
    if(repeatData){
        const {substring, count} = repeatData;
        const isEmoji = emojiRegex.test(substring);
        text = substring.repeat(isEmoji || substring.length >= 3 ? 3 : Math.min(count, 8));
    }
    ttsQueue.push(text);
    processQueue();
}

// 큐의 첫 번째 항목을 가져와 TTS 실행
const processQueue = ()  => {
    if(ttsQueue.length > 0 && !isPlaying){
        const text = ttsQueue.shift();
        playTTS(text);
    }
}

const playTTS = (text) => {
    isPlaying = true;
    const audio = new Audio("/text-to-speech?text=" + encodeURIComponent(text));
    const playNext = () => {
        isPlaying = false;
        processQueue();
    }
    audio.onended = playNext;
    audio.play().catch(playNext);
}