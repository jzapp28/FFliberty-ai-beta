# FINAL ISSUE IDENTIFIED: Wrong Cookie System

## The Problem:
The chat panel uses `'chat-mode'` cookie to track the selected mode (search, general, image, code), but the API and search functionality expect `'search-mode'` cookie.

## Current Implementation:
1. **Chat Panel**: Uses `'chat-mode'` cookie with values: 'search', 'general', 'image', 'code'
2. **API Route**: Looks for `'search-mode'` cookie with boolean value 'true'/'false'
3. **SearchModeToggle**: Sets `'search-mode'` cookie but is not used anywhere

## The Fix:
We need to modify the chat panel to set the `'search-mode'` cookie when search mode is selected.

## Current Flow:
1. User clicks "Search" button → sets `chat-mode=search`
2. API checks `search-mode` cookie → finds undefined → sets searchMode=false
3. Search tools are disabled → no web search happens

## Required Fix:
When user clicks "Search" button, also set `search-mode=true` cookie.

