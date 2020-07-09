import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import FakeHashProvider from "@modules/users/providers/HashProvider/fakes/FakeHashProvider";
import UpdateProfileService from "./UpdateProfileService";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe("UpdateProfile", () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });
  it("should be able to update the profile", async () => {
    const user = await fakeUserRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: "John Three",
      email: "johntre@example.com",
    });

    expect(updatedUser.name).toBe("John Three");
    expect(updatedUser.email).toBe("johntre@example.com");
  });

  it("should not be able to update the profile from non-existing user", async () => {
    expect(
      updateProfile.execute({
        user_id: "non-existing-user-id",
        name: "Test",
        email: "test@example.com",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it("should not be able to change to another user email", async () => {
    await fakeUserRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const user = await fakeUserRepository.create({
      name: "Teste",
      email: "teste@example.com",
      password: "123456",
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: "Teste",
        email: "johndoe@example.com",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it("should be able to update the password", async () => {
    const user = await fakeUserRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: "John Three",
      email: "johntre@example.com",
      old_password: "123456",
      password: "123111",
    });

    expect(updatedUser.password).toBe("123111");
  });
  it("should not be able to update the password without the old password", async () => {
    const user = await fakeUserRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: "John Three",
        email: "johntre@example.com",
        password: "123111",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it("should not be able to update the password with wrong old password", async () => {
    const user = await fakeUserRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: "John Three",
        email: "johntre@example.com",
        old_password: "wrong-old-password",
        password: "123111",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
