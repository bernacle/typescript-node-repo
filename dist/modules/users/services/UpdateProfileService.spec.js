"use strict";

require("reflect-metadata");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

var _UpdateProfileService = _interopRequireDefault(require("./UpdateProfileService"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUserRepository;
let fakeHashProvider;
let updateProfile;
describe("UpdateProfile", () => {
  beforeEach(() => {
    fakeUserRepository = new _FakeUsersRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    updateProfile = new _UpdateProfileService.default(fakeUserRepository, fakeHashProvider);
  });
  it("should be able to update the profile", async () => {
    const user = await fakeUserRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    });
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: "John Three",
      email: "johntre@example.com"
    });
    expect(updatedUser.name).toBe("John Three");
    expect(updatedUser.email).toBe("johntre@example.com");
  });
  it("should not be able to update the profile from non-existing user", async () => {
    expect(updateProfile.execute({
      user_id: "non-existing-user-id",
      name: "Test",
      email: "test@example.com"
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it("should not be able to change to another user email", async () => {
    await fakeUserRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    });
    const user = await fakeUserRepository.create({
      name: "Teste",
      email: "teste@example.com",
      password: "123456"
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: "Teste",
      email: "johndoe@example.com"
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it("should be able to update the password", async () => {
    const user = await fakeUserRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    });
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: "John Three",
      email: "johntre@example.com",
      old_password: "123456",
      password: "123111"
    });
    expect(updatedUser.password).toBe("123111");
  });
  it("should not be able to update the password without the old password", async () => {
    const user = await fakeUserRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: "John Three",
      email: "johntre@example.com",
      password: "123111"
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it("should not be able to update the password with wrong old password", async () => {
    const user = await fakeUserRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: "John Three",
      email: "johntre@example.com",
      old_password: "wrong-old-password",
      password: "123111"
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});