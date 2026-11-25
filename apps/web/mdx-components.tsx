import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h2: (props) => <h2 className="mt-10 mb-4 text-2xl font-bold" {...props} />,
  h3: (props) => <h3 className="mt-8 mb-3 text-xl font-bold" {...props} />,
  p: (props) => <p className="my-4 leading-relaxed text-ink-80" {...props} />,
  ul: (props) => <ul className="my-4 list-disc space-y-2 pl-6 text-ink-80 marker:text-teal-deep" {...props} />,
  ol: (props) => <ol className="my-4 list-decimal space-y-2 pl-6 text-ink-80 marker:font-semibold marker:text-navy" {...props} />,
  li: (props) => <li className="leading-relaxed pl-1" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  a: (props) => <a className="text-navy underline underline-offset-4 hover:text-teal-deep" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
