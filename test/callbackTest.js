/*
* 하나의 파일로 넣기 복잡하니 5장의 소스를 참고하자
*/

// Code
var Conference = Conference || {};

Conference.attendee = function(firstName, lastName) {
    var checkedIn = false,
        first = firstName || 'None',
        last = lastName || 'None';

    return {
        getFullName: function() {
            return first + ' ' + last;
        },

        isCheckedIn: function() {
            return checkedIn;
        },

        checkIn: function() {
            checkedIn = true;
        }
    };
};

Conference.attendeeCollection = function() {
    var attendees = [];

    return {
        contains: function(attendee) {
            return attendees.indexOf(attendee) > -1;
        },
        add: function(attendee) {
            if (!this.contains(attendee)) {
                attendees.push(attendee);
            }
        },
        remove: function(attendee) {
            var index = attendees.indexOf(attendee);
            if (index > -1) {
                attendees.splice(index, 1);
            }
        },

        iterate: function(callback) {
            // attendees의 각 attendee에 대해 콜백을 실행한다
            attendees.forEach(callback);
        }
    };
};

Conference.checkInService = function(checkInRecorder) {
    // 주입한 checkInRecorder의 참조값을 보관한다
    var recorder = checkInRecorder;

    return {
        checkIn: function(attendee) {
            attendee.checkIn();
            recorder.recordCheckIn(attendee);
        }
    };
};

Conference.checkInRecorder = function() {
    return {
        recordCheckIn: function(attendee) {
            // 외부 서비스를 통해 체크인 등록한다
        }
    };
};


//==== counter code
Conference.checkedInAttendeeCounter = function() {
    var checkedInAttendees = 0;
    self = {
        increment: function() {
            checkedInAttendees++;
        },
        getCount: function() {
            return checkedInAttendees;
        },
        countIfCheckedIn: function(attendee) {
            if (attendee.isCheckedIn()) {
                self.increment();
            }
        }
    };

    return self;
};
/*
* 바로 다른 함수에 콜백으로 넘기면 문제가 있다
* 1. 익명 콜백 함수는 콜백만 따로 떼어낼 방법이 없어서 단위테스트가 불가능하다
* 2. 익명 함수는 디버깅을 어렵게 한다
* 
* 따라서 checkInService에 의존성을 주입하게 만드는 것이 타당하다
*/
//====================
// use 1 - 리팩토링 전 
// var attendees = Conference.attendeeCollection();

// UI에서 선택된 참가자드을 추가한다

// attendees.iterate(function(attendee) {
    // 외부 서비스에 체크인을 등록한다
//    attendee.checkIn();
// }

//====================
// use 2 - 리팩토링 후
var checkInService = Conference.checkInService(Conference.checkInRecorder()),
    attendees = Conference.attendeeCollection();

// UI에서 선택된 참가자들을 컬렉션에 추가한다

attendees.iterate(checkInService.checkIn);


//====================
// Test
describe('Conference.attendeeCollection', function() {
    describe('contains(attendee)', function() {
        // Contains Test
    });
    describe('add(attendee)', function() {
        // add Test
    });
    describe('remove(attendee)', function() {
        // remove Test
    });

    describe('iterate(callback)', function() {
        var collection, callbackSpy;

        //도우미 함수
        function addAttendeesToCollection(attendeeArray) {
            attendeeArray.forEach(function(attendee) {
                collection.add(attendee);
            });
        }

        function verifyCallbackWasExecutedForEachAttendee(attendeeArray) {
            // 각 원소마다 한 번씩 스파이가 호출되었는지 확인한다
            expect(callbackSpy.calls.count()).toBe(attendeeArray.length);

            // 각 호출마다 spy에 전달한 첫 번째 인자가 해당 attendee인지 확인한다.
            var allCalls = callbackSpy.calls.all();
            for (var i = 0; i < allCalls.length; i++) {
                expect(allCalls[i].args[0]).toBe(attendeeArray[i]);
            }
        }

        beforeEach(function() {
            collection = Conference.attendeeCollection();
            callbackSpy = jasmine.createSpy();
        });

        it('빈 컬렉션에서는 콜백을 실행하지 않는다', function() {
            collection.iterate(callbackSpy);
            expect(callbackSpy).not.toHaveBeenCalled();
        });

        it('원소가 하나뿐인 컬렉션은 콜배을 한 번만 실행한다', function() {
            var attendees = [Conference.attendee('윤지', '김')];
            addAttendeesToCollection(attendees);

            collection.iterate(callbackSpy);

            verifyCallbackWasExecutedForEachAttendee(attendees);
        });

        it('컬렉션 원소마다 한 번씩 콜백을 실행한다', function() {
            var attendees = [
                Conference.attendee('Tom', 'Kazansky'),
                Conference.attendee('Charlotte', 'Blackwood'),
                Conference.attendee('태영', '김')
            ];

            addAttendeesToCollection(attendees);

            collection.iterate(callbackSpy);

            verifyCallbackWasExecutedForEachAttendee(attendees);
        });
    });

    describe('Conference.checkInService', function() {
        var checkInService,
            checkInRecorder,
            attendee;

        beforeEach(function() {
            checkInRecorder = Conference.checkInRecorder();
            spyOn(checkInRecorder, 'recordCheckIn');

            // checkInRecorder를 주입하면서
            // 이 함수의 recordCheckIn 함수에 스파이를 심는다
            checkInService = Conference.checkInService(checkInRecorder);
            
            attendee = Conference.attendee('형철', '서');
        });

        describe('checkInService.checkIn(attendee)', function() {
            it('참가자를 체크인 처리한 것으로 표시한다', function() {
                checkInService.checkIn(attendee);
                expect(attendee.isCheckedIn()).toBe(true);
            });
            it('체크인을 등록한다', function() {
                checkInService.checkIn(attendee);
                expect(checkInRecorder.recordCheckIn).toHaveBeenCalledWith(attendee);
            });
        });
    });
});


//====== counter test
describe('Conference.checkedInAttendeeCounter', function() {
    var counter;

    beforeEach(function() {
        counter = Conference.checkedInAttendeeCounter();
    });
    describe('increment()', function() {
        // increment Test
    });
    describe('getCount()', function() {
        // getCount Test
    });
    describe('countIfCheckedIn(attendee)', function() {
        var attendee;

        beforeEach(function() {
            attendee = Conference.attendee('태영', '김');
        });

        it('참가자가 체크인하지 않으면 인원수를 세지 않는다', function() {
            counter.countIfCheckedIn(attendee);
            expect(counter.getCount()).toBe(0);
        });

        it('참가자가 체킁인하면 인원수를 센다', function() {
            attendee.checkIn();
            counter.countIfCheckedIn(attendee);
            expect(counter.getCount()).toBe(1);
        });

        it('this가 꼭 checkedInAttendeeCounter 인스턴스를 가리키는 것은 아니다', function() {
            attendee.checkIn();
            // this에 빈 객체를 넣고
            // counter.countIfCheckedIn을 실행한다
            counter.countIfCheckedIn.call({}, attendee);
            expect(counter.getCount()).toBe(1);
        });
    });
});
