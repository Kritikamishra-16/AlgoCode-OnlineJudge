const marked = require('marked');
const sanitizeHtmlLirary = require('sanitize-html');
const TurndownService = require('turndown');

function sanitizeMarkdownContent(markdownContent){
    const turndownService = new TurndownService();

    //1. convert markdown to html
    const convertedHtml = marked.parse(markdownContent); 

    //2. Sanitize html -> it will remove all the non allowed tags in output
    const sanitizedHtml = sanitizeHtmlLirary(convertedHtml, {
        //mention allowed tags-> we are only allowed default allowed tags
        allowedTags: sanitizeHtmlLirary.defaults.allowedTags.concat('img')
    });

    //3. convert the sanitized html back to markdown
    const sanitizedMarkdown = turndownService.turndown(sanitizedHtml);
    return sanitizedMarkdown;
}


// const input= `
// # Hello world

// ### this is a markdown

// - something

// <script>alert('wohoo')</script>

// [Link](www.google.com)
// `;
// sanitizeMarkdownContent(input);

// go to that folder -> cd src/utils/  and run using -> node markdownSanitizer.js

// markdown rendered -> stackedit.io
module.exports= sanitizeMarkdownContent;