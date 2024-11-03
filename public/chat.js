import {ChzzkClient} from "https://cdn.skypack.dev/chzzk"

window.onload = async () => {
    const params = new URLSearchParams(location.search);
    const channelId = params.get('channel');
    if(!channelId){
        alert('채널 아이디를 올바르게 작성해주세요');
        return;
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
        return;
    }

    if(!liveDetail){
        alert('채널 아이디를 올바르게 작성해주세요');
        return;
    }

    const chzzkChat = client.chat({
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
    chzzkChat.connect();
};