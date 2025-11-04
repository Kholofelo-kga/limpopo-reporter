import { signOut } from "firebase/auth";
import { auth } from "./lib/firebase";

/* inside your footer div */
<button
  onClick={() => signOut(auth)}
  className="ml-2 px-2 border rounded"
  title="Sign out"
>
  Sign out
</button>
