import {
  getOrderNoValue,
  hasFieldValue,
  isCaseSelected,
  validateSelectionField,
} from "./formFieldValidation";

describe("isCaseSelected", () => {
  test("treats case 0 as selected", () => {
    expect(isCaseSelected(0)).toBe(true);
  });

  test("rejects null and empty", () => {
    expect(isCaseSelected(null)).toBe(false);
    expect(isCaseSelected("")).toBe(false);
  });
});

describe("getOrderNoValue", () => {
  test("uses name, value, or id in that order", () => {
    expect(getOrderNoValue({ id: 1, name: "3103301W0512" })).toBe(
      "3103301W0512",
    );
    expect(getOrderNoValue({ id: 9, value: "ABC" })).toBe("ABC");
    expect(getOrderNoValue("3103301W0512")).toBe("3103301W0512");
  });
});

describe("validateSelectionField", () => {
  test("requires selection only when options exist", () => {
    expect(
      validateSelectionField({
        required: true,
        hasOptions: true,
        value: "",
        missingSelectionMessageKey: "orderNoRequired",
      }).valid,
    ).toBe(false);

    expect(
      validateSelectionField({
        required: true,
        hasOptions: true,
        value: "3103301W0512",
        missingSelectionMessageKey: "orderNoRequired",
      }).valid,
    ).toBe(true);

    expect(
      validateSelectionField({
        required: true,
        hasOptions: false,
        value: "",
        missingSelectionMessageKey: "orderNoRequired",
      }).valid,
    ).toBe(true);
  });
});

describe("hasFieldValue", () => {
  test("rejects undefined string literal from bad templates", () => {
    expect(hasFieldValue("undefined")).toBe(true);
    expect(hasFieldValue("")).toBe(false);
    expect(hasFieldValue("3103301W0512")).toBe(true);
  });
});
