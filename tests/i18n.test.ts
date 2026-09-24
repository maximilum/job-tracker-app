import { describe, it, expect } from "vitest";
import {
  translations,
  getLocalizedColumnName,
  getLocalizedBoardName,
} from "@/lib/i18n/translations";

describe("i18n Translations and Localization", () => {
  it("should have complete and matching keys for both ar and en", () => {
    const arKeys = Object.keys(translations.ar) as (keyof typeof translations.ar)[];
    const enKeys = Object.keys(translations.en) as (keyof typeof translations.en)[];

    expect(arKeys.sort()).toEqual(enKeys.sort());

    for (const section of arKeys) {
      const arSubKeys = Object.keys(translations.ar[section]).sort();
      const enSubKeys = Object.keys(translations.en[section]).sort();
      expect(arSubKeys).toEqual(enSubKeys);
    }
  });

  it("should correctly translate standard column names from English to Arabic", () => {
    expect(getLocalizedColumnName("Wish List", "ar")).toBe("قائمة الرغبات");
    expect(getLocalizedColumnName("Applied", "ar")).toBe("تم التقديم");
    expect(getLocalizedColumnName("Interviewing", "ar")).toBe("المقابلات");
    expect(getLocalizedColumnName("Offer", "ar")).toBe("عرض وظيفي");
    expect(getLocalizedColumnName("Rejected", "ar")).toBe("مرفوض");
  });

  it("should correctly translate standard column names from Arabic to English", () => {
    expect(getLocalizedColumnName("قائمة الرغبات", "en")).toBe("Wish List");
    expect(getLocalizedColumnName("تم التقديم", "en")).toBe("Applied");
    expect(getLocalizedColumnName("المقابلات", "en")).toBe("Interviewing");
    expect(getLocalizedColumnName("عرض وظيفي", "en")).toBe("Offer");
    expect(getLocalizedColumnName("مرفوض", "en")).toBe("Rejected");
  });

  it("should preserve existing column name when it matches the target language", () => {
    expect(getLocalizedColumnName("قائمة الرغبات", "ar")).toBe("قائمة الرغبات");
    expect(getLocalizedColumnName("Applied", "en")).toBe("Applied");
  });

  it("should preserve custom column names not in standard dictionary", () => {
    expect(getLocalizedColumnName("Technical Assessment", "ar")).toBe(
      "Technical Assessment",
    );
    expect(getLocalizedColumnName("اختبار تقني", "en")).toBe("اختبار تقني");
  });

  it("should localize board names correctly", () => {
    expect(getLocalizedBoardName("New Board", "ar")).toBe("لوحة الوظائف");
    expect(getLocalizedBoardName("Job Board", "ar")).toBe("لوحة الوظائف");
    expect(getLocalizedBoardName("لوحة الوظائف", "en")).toBe("Job Board");
    expect(getLocalizedBoardName("Custom User Board", "ar")).toBe(
      "Custom User Board",
    );
  });
});
