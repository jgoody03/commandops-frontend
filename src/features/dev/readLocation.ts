import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export async function readLocationDoc(workspaceId: string, locationId: string) {
  const ref = doc(db, "workspaces", workspaceId, "locations", locationId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Location doc not found");
  }

  return {
    id: snap.id,
    ...snap.data(),
  };
}