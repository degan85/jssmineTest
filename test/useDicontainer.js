MyApp = {};

MyApp.diContainer = new DiContainer();

MyApp.diContainer.register(
    'Service',  // 웹 서비슬를 가리키는 DI 태그
    [],         // 의존성 없음
    function() {// 인스턴스를 반환하는 함수
        return new ConferenceWebSvc();
    };
);

MyApp.diContainer.register(
    'Messenger',
    [],         
    function() {
        return new Messenger();
    };
);


MyApp.diContainer.register(
    'AttendeeFactory',  
    ['Service', 'Messenger'], // Attendee는 service 및 messenger에 의존한다
    function(service, messenger) {
        return function(attendeeId) {
            return new Attendee(service, messenger, attendeeId);
        }
    }
);

/*
* Attendee를 어떻게 DiContainer 안에 넣는지 주목하라.
* 매우 중요한 고급 기법이다.
* Attendee를 만드는 함수가 아닌, 
* Attendee를 만들 팩토리를 만드는 함수를 등록한다.
*/

// 사용
var attendeeId = 123;
var sessionId = 1;

// DI 컨테이너에서 attendeeId를 넘겨 Attendee를 인스턴스화함
var attendee = MyApp.diContainer.get('AttendeeFactory')(attendeeId);
attendee.reserve(sessionId);
