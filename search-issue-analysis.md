# Search Functionality Issue - Root Cause Analysis

## Problem
Tavily search is not working even after enabling search mode and fixing model configuration.

## Root Cause Found
In `/lib/utils/registry.ts`, line 158-162:

```typescript
// Deepseek R1 is not supported
// Deepseek v3's tool call is unstable, so we include it in the list
return !modelName?.includes('deepseek')
```

**The `isToolCallSupported()` function explicitly returns `false` for ANY model containing "deepseek".**

This means:
1. DeepSeek models are hardcoded to NOT support tool calling
2. Even though we changed the model config to `"toolCallType": "native"`, the registry overrides this
3. The search tools (Tavily API) cannot be called because tool calling is disabled for DeepSeek

## Solution Options

### Option 1: Enable DeepSeek Tool Calling (Risky)
- Remove the DeepSeek exclusion from `isToolCallSupported()`
- May be unstable as noted in the comment

### Option 2: Use Tool Call Model Fallback
- DeepSeek models can use a different model for tool calling via `getToolCallModel()`
- Currently set to fallback to `deepseek:deepseek-chat` which still won't work

### Option 3: Add OpenAI as Tool Call Model
- Configure a different provider (like OpenAI) specifically for tool calling
- Keep DeepSeek for main responses, use OpenAI for search

## Recommendation
Option 1 - Enable DeepSeek tool calling since the user specifically wants DeepSeek functionality and the original Morphic should support this.

