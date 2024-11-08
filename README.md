# chzzk-tts
치지직 채팅 TTS

# 뭔가요?
구글 text to speech api를 활용해 chzzk 채팅을 tts로 갖고오는 기능입니다  
브라우저에 추가하셔서 사용 가능합니다

# 사용 전 확인해야할 사항
`data/key.json` 경로에 구글 tts api 키를 넣으시면 동작합니다.

## 실행 방법
다음과 같이 실행이 가능합니다.
```bash
git clone https://github.com/LeinneSW/chzzk-tts.git
cd chzzk-tts
npm i
node .
```

# 어떻게 쓰나요?
치지직 링크를 참고하여 본인의 채널 id를 취득 후
OBS에 브라우저로 http://localhost:5000/?channel=채널Id 를 등록하시면 됩니다.

## 치지직 id 취득 방법
치지직 URL은 아래의 구조를 갖고있습니다.
```
https://chzzk.naver.com/{channelId}/...
https://chzzk.naver.com/live/{channelId}/...
```
해당 채널 아이디를 복사하여 사용하시면 됩니다.  
잘 모르셔도 괜찮습니다. 저에게 문의하시면 친절하게 알려드립니다.

# 기능
올라오는 채팅 메시지들을 음성으로 읽어주는 역할을 합니다.  
봇에 대한 예외처리가 있어 닉네임이 bot/봇으로 끝난다면 읽지 않습니다.  
또한 TTS 도배 방지를 위해 반복 텍스트는 적은 횟수로 읽도록 설계돼있습니다.