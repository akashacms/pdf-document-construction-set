---
layout: blog.njk
title: "Updated to v1.0.2, several added features"
publicationDate: February 2, 2025
blogtag: news
---

The package `@akashacms/pdf-document-maker` v1.0.2 has been published on npm.

https://www.npmjs.com/package/@akashacms/pdf-document-maker

Updates include:

**Adding KaTeX support**:  This is a LaTeX-inspired (I'm showing my age) syntax for describing both mathematical and chemical equations.  They look cool even if I don't remember much mathematics from college.


**Spinning off a package, `@akashacms/diagrams-maker`**: While editing this website, it was noted that regular AkashaCMS websites needed an easier path for including diagrams and mathematics.  The `@akashacms/diagrams-maker` package does that.

**Add the `markdown-it-bracketed-span` extension**: This extension wraps a `<span>` around text by `[adding brackets around the text]`.  Bracketed text [that is wrapped by a `<span>` tag] is not by itself very interesting.  Unless you look at the page source you will not have noticed the previous sentence has some words wrapped by a `<span>` tag.  But, when combined with another Markdown extension, `markdown-it-attrs`, one can easily add `id=` or `class=` attributes to the `<span>`.

To demonstrate, consider this CSS declaration:

```css
.text-color-red { color:#FF0000; }
```

Then, write something like `[text within brackets]{.text-color-red}`, or [example text within brackets]{.text-color-red}, and notice that the text is red.

The HTML generated for the previous paragraph is:

```html
<p>
Then, write something like
<code>[text within brackets]{.text-color-red}</code>,
or <span class="text-color-red">example text within brackets</span>,
and notice that the text is red.
</p>
```

The `markdown-it-bracketed-span` plugin was needed because it was noted that simply adding an attribute marker, like `{.text-color-red}`, did not have an effect unless it were added to text that was wrapped by a tag.  The `<span>` it introduced took care of that issue.