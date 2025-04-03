import {ChzzkClient} from "https://cdn.skypack.dev/chzzk"

let chzzkChat;
let lastTryMillis = 0;

async function connectChannel(channelId){
    if(Date.now() - lastTryMillis < 2000){ // 과한 요청 방지
        return;
    }

    if(typeof channelId !== 'string'){
        return false;
    }else if(channelId.length !== 32){
        alert('잘못된 형태의 치지직 채널 아이디입니다.');
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
        addText(data.message, data.profile.nickname);
    });
    try{
        await chzzkChat.connect();
        addText('TTS가 활성화 되었습니다.');
        return true;
    }catch{}
    return false;
}

window.onload = async () => {
    const params = new URLSearchParams(location.search);
    const channelId = params.get('channel') || params.get('channelId') || params.get('id');
    if(!channelId){
        document.body.classList.remove('hidden');
        document.body.innerHTML = '채널ID: <input type="text" id="channel"><br><input type="button" id="button" value="접속">';
        button.onclick = () => connectChannel(channel.value);
    }else{
        connectChannel(channelId);
    }
};