# CRITICAL ISSUE FOUND: Chat Mode vs Search Mode

## The Problem:
The chat component is sending `chatMode: getCookie('chat-mode') || 'search'` but the API is looking for `searchMode` based on the `'search-mode'` cookie.

### Chat Component (line 54):
```typescript
body: {
  id,
  chatMode: getCookie('chat-mode') || 'search'
}
```

### API Route (line 32):
```typescript
const searchMode = cookieStore.get('search-mode')?.value === 'true'
```

## The Issue:
1. **Different Cookie Names**: 
   - Chat component uses `'chat-mode'` cookie
   - API looks for `'search-mode'` cookie

2. **Different Logic**:
   - Chat component sends `chatMode` in request body
   - API ignores `chatMode` and only checks `'search-mode'` cookie

3. **Search Mode Toggle**:
   - The SearchModeToggle component correctly sets `'search-mode'` cookie
   - But the chat component doesn't use this cookie

## The Fix:
Either:
1. Update chat component to use `'search-mode'` cookie instead of `'chat-mode'`
2. Update API to use `chatMode` from request body instead of cookie
3. Ensure both systems use the same cookie name

## Root Cause:
The search functionality is completely broken because `searchMode` is always `false` in the API, which means:
- `experimental_activeTools` is always empty array `[]`
- `maxSteps` is always `1` (no tool calls allowed)
- Search tools are never activated

