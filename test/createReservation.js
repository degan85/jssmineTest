//Test
describe('createReservation(passenger, flight)', function() {

    var testPassenger =null,
      testFlight = null,
      testReservation = null,
      testSaver = null;

    beforeEach(function() {  
        testPassenger = {
            firstName: '윤지',
            lastName: '김'
        };

        testFlight = {
            number: '3443',
            carrier: '대한항공',
            destination: '울산'
        };

        testSaver = new ReservationSaver();

        spyOn(testSaver, 'saveReservation');

        testReservation = createReservation(testPassenger, testFlight, testSaver);
    });


    it('주어진 passenger를 passengerInfo 프로퍼티에 할당한다', function() {
    expect(testReservation.passengerInformation).toBe(testPassenger);
    });

    it('confirm reservation' ,function() {
        expect(testSaver.saveReservation).toHaveBeenCalled();
    });
});


// code
function createReservation(passenger, flight, saver) {
    var reservation = {
        passengerInformation : passenger,
        flightInformation: flight
    };

    saver.saveReservation(reservation);
        
    return reservation;
 }

function ReservationSaver() {
    this.saveReservation = function(reservation) {};
}

