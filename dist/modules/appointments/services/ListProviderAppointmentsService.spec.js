"use strict";

require("reflect-metadata");

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _ListProviderAppointmentsService = _interopRequireDefault(require("./ListProviderAppointmentsService"));

var _FakeAppointmentsRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentsRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let listProviderAppointments;
let fakeAppointmentsRepository;
let fakeCacheProvider;
describe("ListProviderAppointments", () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new _FakeAppointmentsRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    listProviderAppointments = new _ListProviderAppointmentsService.default(fakeAppointmentsRepository, fakeCacheProvider);
  });
  it("should be able to list appointments on a specific day", async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: "provider",
      user_id: "user",
      date: new Date(2020, 6, 20, 14, 0, 0)
    });
    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: "provider",
      user_id: "user",
      date: new Date(2020, 6, 20, 15, 0, 0)
    });
    const appointments = await listProviderAppointments.execute({
      provider_id: "provider",
      year: 2020,
      month: 7,
      day: 20
    });
    expect(appointments).toEqual([appointment1, appointment2]);
  });
});