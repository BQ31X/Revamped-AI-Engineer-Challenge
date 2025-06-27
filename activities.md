
# 🧪 Vibe Check Results and Iteration Summary

## 🎥 Loom Video
[View my Loom video here](https://www.loom.com/share/d6e99c269d4245e0a48db286a9cabf1e?sid=2383b87a-3a30-41f2-82de-cb8c7b2dbdaf)


## ✅ Baseline (v1)

This initial version used the default FastAPI backend with no modifications:
- **Model:** `gpt-4.1-mini`
- **Temperature:** 1.0 (default)
- **Max Tokens:** *Not set* (default model behavior)
- **Developer Prompt:** None explicitly set beyond boilerplate (“You are a helpful assistant.”)

**Performance:**  
Scored solidly across most categories, with high marks in accuracy, reasoning, and teaching value. Some issues in brevity and creativity. Overall, a strong starting point.

---

## 🔧 Improved Version (v2)

I tuned the app to target weaker areas — especially **creativity** and **brevity** — by:

- Reducing `max_tokens` to **350** to encourage concise answers
- Increasing `temperature` slightly to **1.2** to enhance creativity
- Updating the developer prompt to:  
  _"Be accurate and clear. For creative tasks, be imaginative and surprising, without being illogical. Structure responses for readability."_

**Result:**  
I tuned for more creativity, and saw modest gains there, plus slightly better clarity, but it came with a drop in teaching value, tone, and reasoning. That shows how sensitive these models are to even small parameter changes. But, with such a small sample maybe it was just natural variation across iterations.

---

## 💥 Degraded Version (v3)

I intentionally misconfigured the app to test its limits:

- Cranked `temperature` up to **1.8**
- Retained the structured prompt and 350 token limit

**Result:**  
Several responses broke down entirely. There were hallucinations, garbled text, and formatting failures. Clarity, creativity, and tone suffered most. Interestingly, math and logic remained robust, demonstrating the model's resilience on well-bounded tasks.

---

## 📊 Composite Aspect Comparison

| Aspect           | v1  | v2  | v3  | Commentary |
|------------------|-----|-----|-----|------------|
| Clarity/Brevity  | 4.00 | 4.75 | 2.75 | Major drop in v3 due to hallucinations and corruption; v2 was strongest. |
| Accuracy         | 4.88 | 4.88 | 3.50 | Consistent in v1/v2; v3 slightly degraded due to artifacts. |
| Teaching Value   | 5.00 | 4.50 | 2.75 | Clear loss in pedagogical value in v3; v1 was ideal. |
| Comprehension    | 5.00 | 5.00 | 4.25 | Still solid in v3 despite other failures. |
| Creativity       | 4.00 | 4.50 | 1.25 | Cratered in v3 due to story failure; v2 had standout imaginative tone. |
| Tone             | 4.75 | 4.50 | 2.63 | Degraded tone in v3 across multiple prompts; v1/v2 consistent. |
| Reasoning/Logic  | 5.00 | 4.50 | 4.50 | Resilient across builds; no impact from tuning. |
| Professionalism  | 4.75 | 4.75 | 4.25 | Slight loss of polish in v3, but not catastrophic. |
| Format           | 4.00 | 4.00 | 3.00 | Hallucinations and structure issues harmed v3 presentation. |

---

## 🎓 Reflection

## 🎓 Reflection

**Three things I learned:**
1. LLM responses are highly sensitive to parameters.
2. Parameter changes involve trade-offs.
3. My testing mindset will come in handy for AI engineering.

**Three things I didn't learn yet:**
1. Which parameters had which specific effect?
2. Why the ‘friendship’ stories were eerily similar across multiple iterations?
3. How the front-end code actually works behind the generated template?
