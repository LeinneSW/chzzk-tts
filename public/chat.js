import {ChzzkClient} from "https://cdn.skypack.dev/chzzk"

let chzzkChat;
let lastTryMillis = 0;

async function connectChannel(channelId){
    if(Date.now() - lastTryMillis < 2000){ // 과한 요청 방지
        return;
    }

    if(!channelId){
        return false;
    }else if(channelId.length !== 32){
        alert('채널 아이디를 올바르게 작성해주세요');
        return false;
    }

    lastTryMillis = Date.now();
    if(chzzkChat?.connected){
        chzzkChat.disconnect();
    }
    const client = new ChzzkClient({
        baseUrls: {
            chzzkBaseUrl: "/cors/chzzk",
            gameBaseUrl: "/cors/game"
        }
    });
    let liveDetail = null;
    try{
        liveDetail = await client.live.detail(channelId);
    }catch(e){
        alert(e.message);
        return false;
    }

    if(!liveDetail){
        alert('채널 아이디를 올바르게 작성해주세요');
        return false;
    }

    chzzkChat = client.chat({
        channelId: liveDetail.channel.channelId,
        pollInterval: 30 * 1000
    });
    chzzkChat.on('chat', data => {
        const nickname = data.profile.nickname;
        if(nickname.match(/^.*(봇|bot)$/i)){
            return;
        }
        addTTSQueue(data.message);
    });
    try{
        await chzzkChat.connect();
        addTTSQueue('TTS가 활성화 되었습니다.');
        return true;
    }catch{}
    return false;
}

window.onload = async () => {
    const params = new URLSearchParams(location.search);
    const channelId = params.get('channel') || params.get('channelId') || params.get('id');
    if(!channelId){
        document.body.innerHTML = '채널ID: <input type="text" id="text"><br><input type="button" id="button" value="접속">';
        button.onclick = () => connectChannel(text.value);
    }else{
        connectChannel(channelId);
        document.body.style.background = 'background: rgba(0, 0, 0, 0)';
    }
};