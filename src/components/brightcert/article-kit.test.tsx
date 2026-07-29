import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import { ARTICLES } from "@/lib/seo/registry";
import { ArticleRelatedLinks } from "./article-kit";

afterEach(cleanup);

describe("ArticleRelatedLinks", () => {
  test.each(Object.values(ARTICLES))(
    "keeps $path connected to three distinct supporting articles",
    (article) => {
      render(<ArticleRelatedLinks currentPath={article.path} />);

      const hrefs = screen
        .getAllByRole("link")
        .map((link) => link.getAttribute("href"))
        .filter((href): href is string => Boolean(href));

      expect(hrefs).toHaveLength(3);
      expect(new Set(hrefs).size).toBe(3);
      expect(hrefs).not.toContain(article.path);
      if (article.path !== ARTICLES.whatIsCyberEssentials.path) {
        expect(hrefs).toContain(ARTICLES.whatIsCyberEssentials.path);
      }
    }
  );
});
