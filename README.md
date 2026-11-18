# Scale institutional knowledge using Copilot Spaces

<img src="https://octodex.github.com/images/Professortocat_v2.png" align="right" height="200px" />

Hey darrenmcmanus04-beep!

Mona here. I'm done preparing your exercise. Hope you enjoy! 💚

Remember, it's self-paced so feel free to take a break! ☕️

[![](https://img.shields.io/badge/Go%20to%20Exercise-%E2%86%92-1f883d?style=for-the-badge&logo=github&labelColor=197935)](https://github.com/darrenmcmanus04-beep/silver-lamp/issues/1)

---

&copy; 2025 GitHub &bull; [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md) &bull; [MIT License](https://gh.io/mit)


## OpenRouter quick test

A single chat completion through [OpenRouter](https://openrouter.ai) using the official [`@openrouter/sdk`](https://www.npmjs.com/package/@openrouter/sdk) lives in `src/openrouter.ts`.

1. Create an API key at <https://openrouter.ai/keys> and export it (never commit it):
   `export OPENROUTER_API_KEY=sk-or-...`
2. `npm install`
3. `npm run ask -- "Explain recursion in one sentence."`

Set `OPENROUTER_MODEL` to use another model slug from <https://openrouter.ai/models> (default: `anthropic/claude-opus-5.5`). `OPENROUTER_MAX_TOKENS` caps the reply length (default: 2000) so small credit balances can afford a request.
