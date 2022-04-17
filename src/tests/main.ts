import sinon from 'sinon';

let stub;
beforeEach(function () {
	stub = sinon.stub(console, 'info');
	stub.callsFake(() => null);
});

afterEach(function () {
	stub.restore();
});
