# Build Error Found

There's a module import error in the liberty-ai.ts file:

```
Module not found: Can't resolve './utils/smooth-stream'
```

The error is in `/lib/agents/liberty-ai.ts` line 3:
```typescript
import { smoothStream } from '../utils/smooth-stream'
```

This import path is incorrect. Need to check the correct path for smooth-stream utility.

