import { IUser } from "@/lib/user.model";

interface UserProfileProps {
  user: IUser | null;
}
export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="box-center">
      <img
        src={user?.photoURL}
        className="card-img-center"
        alt="user profile picture"
      />
      <p>
        <i>@{user?.username}</i>
      </p>
      <h1>{user?.displayName}</h1>
    </div>
  );
}
