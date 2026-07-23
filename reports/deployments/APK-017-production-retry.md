# APK-017 production deployment retry

- Task: APK-017 embedding and RAG cost calculator
- Merged commit: `7fa4f4b026369591613def5d5679a733d904d376`
- Reason: the merge completed with passing CI and Preview, but Vercel did not create a production deployment for the merge commit.
- Action: this documentation-only commit retriggers the main-branch production deployment without changing application behavior.
- Completion rule: mark APK-017 complete only after the canonical production URL returns the calculator successfully.
