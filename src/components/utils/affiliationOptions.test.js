import { describe, expect, it } from "vitest";
import {
  buildAffiliationOptions,
  parseLocationsFromResponse,
  resolveAffiliationOptions,
} from "./affiliationOptions";

describe("parseLocationsFromResponse", () => {
  it("reads nested data arrays", () => {
    expect(
      parseLocationsFromResponse({
        data: { data: [{ name: "KHI" }] },
      }),
    ).toEqual([{ name: "KHI" }]);
  });

  it("reads top-level data arrays", () => {
    expect(
      parseLocationsFromResponse({
        data: [{ location: "Nagoya" }],
      }),
    ).toEqual([{ location: "Nagoya" }]);
  });

  it("returns an empty array for invalid shapes", () => {
    expect(parseLocationsFromResponse({ data: { items: [] } })).toEqual([]);
  });
});

describe("buildAffiliationOptions", () => {
  it("normalizes supported location fields", () => {
    expect(
      buildAffiliationOptions([
        { name: "KHI" },
        { location: "Akashi" },
        { affiliation: "Harima" },
        "Tokyo",
      ]),
    ).toEqual([
      { value: "KHI", label: "KHI" },
      { value: "Akashi", label: "Akashi" },
      { value: "Harima", label: "Harima" },
      { value: "Tokyo", label: "Tokyo" },
    ]);
  });

  it("reads nested location payloads", () => {
    expect(
      buildAffiliationOptions({
        data: [{ name: "Harima Plant" }, { name: "Akashi Works" }],
      }),
    ).toEqual([
      { value: "Harima Plant", label: "Harima Plant" },
      { value: "Akashi Works", label: "Akashi Works" },
    ]);
  });

  it("filters invalid location values", () => {
    expect(
      buildAffiliationOptions([
        "",
        null,
        true,
        false,
        "True",
        "12345",
        "2026-06-17",
        "06/17/2026",
        { name: "Harima Plant" },
        { location: "Site 01" },
      ]),
    ).toEqual([
      { value: "Harima Plant", label: "Harima Plant" },
      { value: "Site 01", label: "Site 01" },
    ]);
  });
});

describe("resolveAffiliationOptions", () => {
  it("uses backend data when the request succeeds", () => {
    expect(
      resolveAffiliationOptions({
        locations: [{ name: "KHI" }],
        affiliationError: undefined,
        isAffiliationLoading: false,
      }),
    ).toEqual({
      options: [{ value: "KHI", label: "KHI" }],
      showLoadError: false,
    });
  });

  it("shows a load error when the request fails", () => {
    expect(
      resolveAffiliationOptions({
        locations: undefined,
        affiliationError: new Error("network"),
        isAffiliationLoading: false,
      }),
    ).toEqual({
      options: [],
      showLoadError: true,
    });
  });
});
