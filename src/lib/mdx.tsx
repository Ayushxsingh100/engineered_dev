import React from 'react';
import { compileMDX as compileMDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import { CopyButton } from '@/components/CopyButton';
import { Callout } from '@/components/mdx/Callout';
import { LightboxImage } from '@/components/LightboxImage';

/* -------------------------------------------------------------------------- */
/*  Custom MDX Components                                                     */
/* -------------------------------------------------------------------------- */

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const tag = `h${level}` as const;
  const sizes: Record<number, string> = {
    1: 'text-3xl sm:text-4xl lg:text-[42px] font-extrabold mt-14 mb-6 leading-tight',
    2: 'text-2xl sm:text-3xl lg:text-[32px] font-extrabold mt-12 mb-5 leading-snug',
    3: 'text-xl sm:text-2xl lg:text-[26px] font-bold mt-10 mb-4',
    4: 'text-lg sm:text-xl lg:text-[22px] font-bold mt-8 mb-3',
    5: 'text-base sm:text-lg lg:text-[18px] font-bold mt-6 mb-2',
    6: 'text-sm sm:text-base lg:text-[16px] font-bold mt-5 mb-2',
  };

  const HeadingComponent = (
    props: React.HTMLAttributes<HTMLHeadingElement>
  ) => {
    return React.createElement(tag, {
      ...props,
      className: `${sizes[level]} text-text-primary scroll-mt-20 group tracking-tight ${props.className ?? ''}`,
    });
  };

  HeadingComponent.displayName = `Heading${level}`;
  return HeadingComponent;
}

function Pre(props: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      {...props}
      className={`overflow-x-auto p-4 pt-10 text-[13px] leading-relaxed ${props.className ?? ''}`}
    />
  );
}

// Intercept figure which rehype-pretty-code uses as the root container
function Figure(props: React.HTMLAttributes<HTMLElement>) {
  if ('data-rehype-pretty-code-figure' in props) {
    return (
      <figure {...props} className="relative my-8 overflow-hidden rounded-2xl border border-border bg-code-bg group shadow-sm">
        <CopyButton />
        {props.children}
      </figure>
    );
  }
  return <figure {...props} className="my-8" />;
}

// Intercept figcaption which rehype-pretty-code uses for titles
function Figcaption(props: React.HTMLAttributes<HTMLElement>) {
  if ('data-rehype-pretty-code-title' in props) {
    return (
      <figcaption {...props} className="px-4 py-2 text-xs font-mono font-bold tracking-wider text-text-secondary border-b border-border/50 bg-surface-alt/50">
        {props.children}
      </figcaption>
    );
  }
  return <figcaption {...props} className="mt-3 text-center text-sm text-text-tertiary" />;
}

function Code(props: React.HTMLAttributes<HTMLElement>) {
  const isInline = !props.className?.includes('language-');

  if (isInline) {
    return (
      <code
        {...props}
        className="rounded-md bg-accent/10 px-[0.4em] py-[0.2em] text-[0.85em] font-mono text-accent border border-accent/20 shadow-[0_0_8px_rgba(139,92,246,0.05)]"
      />
    );
  }

  return <code {...props} className={`font-mono text-code-fg ${props.className ?? ''}`} />;
}

function Blockquote(props: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      {...props}
      className="my-8 border-l-4 border-accent bg-accent/5 p-6 rounded-r-2xl text-[18px] sm:text-[20px] text-text-primary font-semibold italic [&>p]:m-0"
    />
  );
}

function Table(props: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-6 w-full overflow-x-auto rounded-md border border-border">
      <table {...props} className="w-full text-sm text-left border-collapse" />
    </div>
  );
}

function Th(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className="border-b border-border bg-surface-alt px-4 py-2 font-medium text-text-primary"
    />
  );
}

function Td(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td {...props} className="border-b border-border px-4 py-2 text-text-secondary" />
  );
}

function Anchor(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = props.href?.startsWith('http');
  return (
    <a
      {...props}
      className="text-accent hover:text-[var(--accent-secondary)] underline decoration-accent/30 hover:decoration-accent underline-offset-4 font-bold transition-all"
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    />
  );
}

function Ul(props: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      {...props}
      className="my-5 ml-6 list-disc space-y-2 text-[17px] sm:text-[18px] md:text-[19px] text-text-secondary marker:text-accent/60 font-semibold"
    />
  );
}

function Ol(props: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      {...props}
      className="my-5 ml-6 list-decimal space-y-2 text-[17px] sm:text-[18px] md:text-[19px] text-text-secondary marker:text-accent/60 font-semibold"
    />
  );
}

function Hr() {
  return <hr className="my-10 border-t border-border" />;
}

function P(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...props}
      className="my-5 text-[17px] sm:text-[18px] md:text-[19px] font-semibold leading-[1.8] text-text-secondary"
    />
  );
}

function Li(props: React.HTMLAttributes<HTMLLIElement>) {
  return <li {...props} className="leading-relaxed pl-1 font-semibold text-text-secondary" />;
}

/* -------------------------------------------------------------------------- */
/*  Components Map                                                            */
/* -------------------------------------------------------------------------- */

export const mdxComponents: Record<string, React.ComponentType<any>> = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  pre: Pre,
  figure: Figure,
  figcaption: Figcaption,
  code: Code,
  blockquote: Blockquote,
  table: Table,
  th: Th,
  td: Td,
  a: Anchor,
  img: LightboxImage,
  ul: Ul,
  ol: Ol,
  li: Li,
  hr: Hr,
  p: P,
  Callout: Callout,
};

/* -------------------------------------------------------------------------- */
/*  compileMDX                                                                */
/* -------------------------------------------------------------------------- */

export async function compileMDX(source: string) {
  const contentToCompile = source || "";
  
  try {
    const compiled = await compileMDXRemote({
      source: contentToCompile,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [
              rehypePrettyCode,
              {
                theme: 'github-dark',
                keepBackground: true,
              },
            ],
            [
              rehypeAutolinkHeadings,
              {
                behavior: 'wrap',
                properties: {
                  className: ['anchor'],
                },
              },
            ],
          ],
        },
        parseFrontmatter: true,
      },
      components: mdxComponents,
    });
    
    // Robust TOC Extraction: strip out all code blocks first so we don't accidentally match comments.
    const contentWithoutCodeBlocks = contentToCompile.replace(/```[\s\S]*?```/g, '');
    const headingsMatch = contentWithoutCodeBlocks.match(/^#+\s+.+$/gm);
    
    const headings = headingsMatch 
      ? headingsMatch.map(h => {
          const level = h.match(/^#+/)?.[0].length || 1;
          const raw = h.replace(/^#+\s+/, '');
          // Strip all HTML tags (self-closing and paired) to extract plain text
          const text = raw.replace(/<[^>]*>/g, '').trim();
          const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
          return { level, text, id };
        }).filter(h => h.text.length > 0)
      : [];
      
    return { 
      content: compiled.content, 
      frontmatter: compiled.frontmatter,
      headings 
    };
  } catch (error) {
    console.error("MDX Compilation error:", error);
    return {
      content: <p>Error rendering content.</p>,
      frontmatter: {},
      headings: []
    };
  }
}
