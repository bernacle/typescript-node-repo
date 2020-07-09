import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import ShowProfileService from "./ShowProfileService";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";

let fakeUserRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe("SHowProfile", () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUserRepository);
  });
  it("should be able to show the profile", async () => {
    const user = await fakeUserRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe("John Doe");
    expect(profile.email).toBe("johndoe@example.com");
  });
  it("should not be able to show the profile from non-existing user", async () => {
    expect(
      showProfile.execute({
        user_id: "non-existing-user-id",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
