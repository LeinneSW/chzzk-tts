# chzzk-tts
치지직 채팅 TTS

# 뭔가요?
구글 text to speech api를 활용해 chzzk 채팅을 tts로 갖고오는 기능입니다  
브라우저에 추가하셔서 사용 가능합니다

# 사용 전 확인해야할 사항
chat.js 의 하단 내용을 본인의 프록시에 맞게 변경 후 사용 가능합니다.  
치지직 URL의 CORS 정책때문에 자체 프록시를 설계하셔야 합니다.
```js
const client = new ChzzkClient({
    baseUrls: {
        // 해당 구문 수정
        chzzkBaseUrl: "https://change.domain/chzzkBase",
        gameBaseUrl: "https://change.domain/gameBase"
    }
});
```
또한 `data/key.json` 경로에 api 키를 넣으셔야합니다.

# 어떻게 쓰나요?
OBS에 브라우저로 http://localhost:5000/?channel=채널Id 를 등록하시면 됩니다.  
개발자가 아니라 잘 모르겠다면 저에게 문의하세요. 저와 친하다면 알려드립니다.

# 기능
기본적으로 닉네임 끝이 bot/봇 이면 해당 텍스트는 무시합니다.  
또한 반복되는 텍스트는 여러번 읽지 않도록 설계돼있습니다.