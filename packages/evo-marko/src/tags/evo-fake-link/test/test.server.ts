import { describe, it } from "vitest";
import { composeStories } from "@storybook/marko";
import { snapshotHTML } from "../../../common/test-utils/snapshots";
import * as stories from "../fake-link.stories";

const { Default, Standalone } = composeStories(stories);

describe("evo-fake-link SSR", () => {
  it("renders default", async () => {
    await snapshotHTML(Default);
  });

  it("renders disabled", async () => {
    await snapshotHTML(Default, { disabled: true });
  });

  it("renders standalone", async () => {
    await snapshotHTML(Standalone);
  });

  it("renders with type override", async () => {
    await snapshotHTML(Default, { type: "submit" });
  });
});
