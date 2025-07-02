# Search Mode Issue Analysis

## Problem Found: Cookie-based Search Mode Detection

### Current Implementation:
```typescript
const searchMode = cookieStore.get('search-mode')?.value === 'true'
```

### Issue:
The search mode is determined by a cookie called 'search-mode', but our UI might not be setting this cookie properly when the Search button is clicked.

## Investigation Needed:
1. Check if the Search button click sets the 'search-mode' cookie
2. Verify the cookie is being sent with API requests
3. Ensure the cookie value is exactly 'true' (string)

## Potential Solutions:
1. Fix the frontend to properly set the search-mode cookie
2. Add logging to verify searchMode value in API
3. Check if the Search button component is working correctly

## Next Steps:
1. Examine the Search button component
2. Check cookie setting mechanism
3. Add debug logging to verify searchMode value
4. Test cookie persistence across requests

