const ttsQueue = [];
let isPlaying = false;

const emojiRegex = /\p{Extended_Pictographic}/gu; // 이모지 구분 정규식
const options = (() => {
    const defaultOptions = {
        name: { // 이름 필터링(특정 규칙의 이름은 TTS가 읽지 않음)
            enabled: true,
            regex: /^.*(봇|bot)$/i,
        },
        message: { // 문자열 필터링(특정 채팅 생략되어 재생되는 기능)
            enabled: false,
            regex: /\p{Extended_Pictographic}|\{:.*:\}/gu,
        },
        messageSkip: { // 문자열 스킵(특정 규칙의 채팅은 아예 TTS로 읽지 않음)
            enabled: true,
            regex: /^[!$/].*$/u, // 각종 명령어들 TTS 제외처리
        },
        maximumPlayTime: 6, // 1회 채팅당 최대 재생 시간, 초단위
    };
    try{
        const {name, message, messageSkip, maximumPlayTime} = JSON.parse(localStorage.getItem('options') || '{}');
        typeof name?.enabled == 'boolean' && (defaultOptions.name.enabled = name.enabled);
        typeof name?.regex == 'string' && (defaultOptions.name.regex = name.regex);

        typeof message?.enabled == 'boolean' && (defaultOptions.message.enabled = message.enabled);
        typeof message?.regex == 'string' && (defaultOptions.message.regex = message.regex);

        typeof messageSkip?.enabled == 'boolean' && (defaultOptions.messageSkip.enabled = messageSkip.enabled);
        typeof messageSkip?.regex == 'string' && (defaultOptions.messageSkip.regex = messageSkip.regex);

        maximumPlayTime != null && (defaultOptions.maximumPlayTime = +maximumPlayTime || defaultOptions.maximumPlayTime);
    }catch(e){
        console.error(e);
    }
    return defaultOptions;
})();

const saveOptions = () => {
    try{
        localStorage.setItem('options', JSON.stringify(options));
    }catch(e){
        console.error(e);
    }
}

// 반복 단어 파악(도배 방지를 위해 추가)
const normalizeRepeatedText = (text) => {
    const len = Math.floor(text.length / 4);
    for(let i = 1; i <= len; ++i){ // 문자열의 길이의 1/4 까지만 확인(4회이상 반복하는지 파악)
        let index = 0, count = 1;
        const substring = text.substring(0, i);
        while((index = text.indexOf(substring, index + i)) !== -1){
            ++count;
        }
        if(count > 3 && count * substring.length === text.length){
            const isEmoji = emojiRegex.test(substring);
            return substring.repeat(isEmoji || substring.length >= 3 ? 3 : Math.min(count, 8));
        }
    }
    return text;
}

const addText = (text, nickname) => {
    // 특정 닉네임, 문자열 제외 기능
    if(
        (options.name.enabled && nickname != null && options.name.regex.test(nickname)) ||
        (options.messageSkip.enabled && options.messageSkip.regex.test(text))
    ){
        return;
    }

    if(options.message.enabled){
        text = text.replace(options.message.regex, '');
    }

    ttsQueue.push(normalizeRepeatedText(text));
    processQueue();
}

// 큐의 첫 번째 항목을 가져와 TTS 실행
const processQueue = ()  => {
    if(ttsQueue.length > 0 && !isPlaying){
        playTTS(ttsQueue.shift());
    }
}

// 텍스트를 음성으로 불러와 재생
const playTTS = (text) => {
    isPlaying = true;
    const audio = new Audio(`/text-to-speech?text=${encodeURIComponent(text)}`);
    let timeoutId;

    // 공통 종료 로직
    const finishPlayback = () => {
        if(!isPlaying) return;
        isPlaying = false;
        if(timeoutId) clearTimeout(timeoutId);
        processQueue();
    };

    // 강제 중단 타이머
    if(options.maximumPlayTime > 0){
        timeoutId = setTimeout(() => {
            // 아직 재생 중이면 중단
            if(!audio.paused){
                audio.pause();
                audio.currentTime = 0;
                finishPlayback();
            }
        }, options.maximumPlayTime * 1000);
    }

    audio.onended = finishPlayback;
    audio.play().catch(finishPlayback);
}