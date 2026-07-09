import DOMPurify from 'dompurify';

const ALLOWED_TAGS = ['p', 'strong', 'em', 'br', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'img'];
const ALLOWED_ATTR = ['src', 'alt', 'title'];

export function sanitizeHTML(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}

export function createSanitizedHTML(content: string) {
  return {
    __html: sanitizeHTML(content),
  };
}

export function createExcerpt(content: string, maxLength = 200): string {
  const sanitizedContent = sanitizeHTML(content);
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = sanitizedContent;
  let textContent = tempDiv.textContent || tempDiv.innerText || '';
  textContent = textContent.trim();

  if (textContent.length > maxLength) {
    textContent = textContent.substring(0, maxLength).split(' ').slice(0, -1).join(' ') + '...';
  }

  return textContent;
}
