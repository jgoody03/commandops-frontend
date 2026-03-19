import { callFunction } from "../../lib/functions";

const quickCreateProductFn = callFunction<any, any>("quickCreateProduct");
const receiveInventoryFn = callFunction<any, any>("receiveInventory");

function makeSeedId() {
  const rand = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");

  return rand;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return String(error);
  }
}

export async function seedDemoData(workspaceId: string) {
  const seedId = makeSeedId();
  const locationId = "main";

  let productId: string | undefined;

  try {
    const productRes = await quickCreateProductFn({
      workspaceId,
      name: `Demo Product ${seedId}`,
      sku: `DEMO-${seedId}`,
      barcode: `900000${seedId}`,
    });

    productId =
      productRes.data?.productId ??
      productRes.data?.product?.id ??
      productRes.data?.id;

    if (!productId) {
      throw new Error("Could not determine created productId");
    }
  } catch (error) {
    throw new Error(
      `quickCreateProduct failed: ${getErrorMessage(error)}`
    );
  }

  try {
    await receiveInventoryFn({
      workspaceId,
      locationId,
      lines: [
        {
          productId,
          quantity: 50,
          unitCost: 5,
        },
      ],
    });
  } catch (error) {
    throw new Error(
      `receiveInventory failed: ${getErrorMessage(error)}`
    );
  }
}