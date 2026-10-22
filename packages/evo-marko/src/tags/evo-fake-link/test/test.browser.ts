import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { render, fireEvent, cleanup } from "@marko/testing-library";
import { userEvent, type UserEvent } from "vitest/browser";
import { composeStories } from "@storybook/marko";
import * as stories from "../fake-link.stories";

const { Default } = composeStories(stories);

afterEach(cleanup);

let component: Awaited<ReturnType<typeof render>>;
let user: UserEvent;
const clickSpy = vi.fn();
const escapeSpy = vi.fn();

describe("evo-fake-link", () => {
  beforeEach(() => {
    user = userEvent.setup();
  });
  afterEach(() => {
    user.cleanup();
    clickSpy.mockReset();
    escapeSpy.mockReset();
  });

  describe("given fake link is enabled", () => {
    beforeEach(async () => {
      component = await render(Default, {
        onClick: clickSpy,
        onEscape: escapeSpy,
      });
    });

    it("then it renders a button with the fake-link class", () => {
      const button = component.getByRole("button");
      expect(button.classList.contains("fake-link")).toBe(true);
      expect(button.getAttribute("type")).toBe("button");
    });

    describe("when fake link is clicked", () => {
      beforeEach(async () => {
        await fireEvent.click(component.getByRole("button"));
      });

      it("then it calls onClick", () => {
        expect(clickSpy).toBeCalledTimes(1);
      });
    });

    describe("when escape key is pressed", () => {
      beforeEach(async () => {
        await user.type(component.getByRole("button"), "{Escape}");
      });

      it("then it calls onEscape", () => {
        expect(escapeSpy).toBeCalledTimes(1);
      });
    });
  });

  describe("given fake link is disabled", () => {
    beforeEach(async () => {
      component = await render(Default, {
        disabled: true,
        onClick: clickSpy,
        onEscape: escapeSpy,
      });
    });

    it("then the native button is disabled", () => {
      expect(component.getByRole("button")).toHaveProperty("disabled", true);
    });

    describe("when escape key is dispatched", () => {
      beforeEach(async () => {
        await fireEvent.keyDown(component.getByRole("button"), {
          key: "Escape",
        });
      });

      it("then it does not call onEscape", () => {
        expect(escapeSpy).not.toBeCalled();
      });
    });
  });
});
