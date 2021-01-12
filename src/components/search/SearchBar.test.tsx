import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import { render } from "@testing-library/react";
import SearchBar from "./SearchBar";

describe("SearchBar", () => {
  let updateSearchTerm: jest.Mock;

  beforeEach(() => {
    updateSearchTerm = jest.fn();
    jest.useFakeTimers();
  });

  test("properly renders default initial state", () => {
    const result = render(
      <SearchBar searchTerm={""} updateSearchTerm={updateSearchTerm} />
    );
    const inputElement = result.container.querySelector("input");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue("");
    expect(updateSearchTerm).not.toBeCalled();
  });

  test("properly renders initial search term", () => {
    const result = render(
      <SearchBar searchTerm={"ahaM"} updateSearchTerm={updateSearchTerm} />
    );
    const inputElement = result.container.querySelector("input");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("value", "ahaM");
    expect(inputElement).toHaveValue("ahaM");
    expect(updateSearchTerm).not.toBeCalled();
  });

  test("changes displayed value on user input", () => {
    const result = render(
      <SearchBar searchTerm={"ahaM"} updateSearchTerm={updateSearchTerm} />
    );
    const inputElement = result.container.querySelector("input");
    expect(inputElement).not.toBeNull();
    expect(inputElement).toHaveAttribute("value", "ahaM");
    expect(inputElement).toHaveValue("ahaM");
    jest.runOnlyPendingTimers();
    inputElement!.value = "vin";
    expect(inputElement).toHaveValue("vin");
    expect(inputElement).toHaveAttribute("value", "ahaM");
    ReactTestUtils.Simulate.change(inputElement!);
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("value", "vin");
    expect(inputElement).toHaveValue("vin");
    jest.runOnlyPendingTimers();
    expect(inputElement).toHaveAttribute("value", "vin");
    expect(inputElement).toHaveValue("vin");
  });

  test("propagates search term change only after delay", () => {
    const result = render(
      <SearchBar searchTerm={"ahaM"} updateSearchTerm={updateSearchTerm} />
    );
    const inputElement = result.container.querySelector("input");
    expect(inputElement).not.toBeNull();
    jest.runOnlyPendingTimers();
    inputElement!.value = "aha";
    ReactTestUtils.Simulate.change(inputElement!);
    jest.advanceTimersByTime(499);
    expect(updateSearchTerm).not.toBeCalled();
    jest.advanceTimersByTime(1);
    expect(updateSearchTerm).toBeCalledTimes(1);
    expect(updateSearchTerm).toBeCalledWith("aha");
  });

  test("cancels pending search term update if new one happens", () => {
    const result = render(
      <SearchBar searchTerm={"ahaM"} updateSearchTerm={updateSearchTerm} />
    );
    const inputElement = result.container.querySelector("input");
    expect(inputElement).not.toBeNull();
    jest.runOnlyPendingTimers();
    inputElement!.value = "aha";
    ReactTestUtils.Simulate.change(inputElement!);
    jest.advanceTimersByTime(499);
    expect(updateSearchTerm).not.toBeCalled();
    inputElement!.value = "vin";
    ReactTestUtils.Simulate.change(inputElement!);
    jest.advanceTimersByTime(499);
    expect(updateSearchTerm).not.toBeCalled();
    jest.advanceTimersByTime(1);
    expect(updateSearchTerm).toBeCalledTimes(1);
    expect(updateSearchTerm).toBeCalledWith("vin");
  });
});
