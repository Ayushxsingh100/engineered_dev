const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'articles');
const blogsDir = path.join(__dirname, 'content/blogs');

// Read all old MDX files and delete them
const oldFiles = fs.readdirSync(blogsDir).filter(f => f.endsWith('.mdx'));
for (const file of oldFiles) {
  fs.unlinkSync(path.join(blogsDir, file));
  console.log(`Deleted ${file}`);
}

// Process new MD files
const newFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
const today = new Date().toISOString().split('T')[0];

for (const file of newFiles) {
  const content = fs.readFileSync(path.join(articlesDir, file), 'utf8');
  
  // Basic frontmatter regex match
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) continue;
  
  const frontmatterLines = frontmatterMatch[1].split('\n');
  const metadata = {};
  
  frontmatterLines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      metadata[key] = value;
    }
  });

  const slug = file.replace('.md', '');
  
  // Generate correct frontmatter
  let newFrontmatter = `---
title: "${metadata.title || ''}"
description: "${metadata.excerpt || metadata.seoDescription || ''}"
date: "${today}"
tags:
`;

  // Process tags
  if (metadata.tags && metadata.tags.startsWith('[')) {
    const tagString = metadata.tags.replace('[', '').replace(']', '').replace(/"/g, '');
    const tags = tagString.split(',').map(t => t.trim());
    tags.forEach(t => {
      newFrontmatter += `  - ${t}\n`;
    });
  } else {
    newFrontmatter += `  - backend\n`;
  }

  newFrontmatter += `featured: true
published: true
author: "Engineering Team"
image: "/images/featured_cover_story.png"
---`;

  // Replace frontmatter in content
  const newContent = content.replace(/^---\n[\s\S]*?\n---/, newFrontmatter);
  
  const mdxPath = path.join(blogsDir, `${slug}.mdx`);
  fs.writeFileSync(mdxPath, newContent);
  console.log(`Created ${slug}.mdx`);
}
