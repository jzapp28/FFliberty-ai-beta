# Original Morphic Researcher Analysis

## Key Findings from GitHub Source Code

### Line 65-66: experimental_activeTools Configuration
```typescript
experimental_activeTools: searchMode
  ? ['search', 'retrieve', 'videoSearch', 'ask_question']
  : [],
```

### Line 68: maxSteps Configuration  
```typescript
maxSteps: searchMode ? 5 : 1,
```

## Critical Discovery:
The original Morphic uses `experimental_activeTools` to enable search tools ONLY when `searchMode` is true.

### Our Implementation Issue:
In our version, we need to verify:
1. Is `searchMode` being properly passed and set to `true`?
2. Are the `experimental_activeTools` being activated?
3. Is `maxSteps` being set to 5 to allow multiple tool calls?

### System Prompt Analysis:
The original includes this instruction:
"You are a helpful AI assistant with access to real-time web search, content retrieval, video search capabilities, and the ability to ask clarifying questions."

And specifically:
"3. If you have enough information, search for relevant information using the search tool when needed"
"7. Always cite sources using the [number](url) format, matching the order of search results"

## Next Steps:
1. Check if `searchMode` is properly being set in our chat API
2. Verify `experimental_activeTools` configuration
3. Ensure `maxSteps` allows multiple tool calls
4. Check if search tools are actually being invoked

