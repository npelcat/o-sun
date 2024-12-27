import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

export const parseMarkdown = (markdown) => {
  return md.render(markdown);
};
