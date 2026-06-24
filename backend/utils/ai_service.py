import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
OPENAI_DEMO_MODE = not OPENAI_API_KEY or OPENAI_API_KEY in ("", "your_openai_api_key_here")

MODEL = OPENAI_MODEL

if not OPENAI_DEMO_MODE:
    client = OpenAI(api_key=OPENAI_API_KEY)
else:
    client = None


def _get_ai_client():
    # In demo mode (no API key) return None so callers can provide a demo response
    return client


async def check_ats_score(resume_text: str, job_description: str) -> dict:
    prompt = f"""You are an ATS (Applicant Tracking System) expert.
Analyze this resume against the job description and give a detailed ATS score.

Resume:
{resume_text[:3000]}

Job Description:
{job_description[:2000]}

Return ONLY valid JSON, no markdown:
{{
  "ats_score": <int 0-100>,
  "matched_keywords": ["keyword1", "keyword2", ...],
  "missing_keywords": ["keyword1", "keyword2", ...],
  "keyword_match_percent": <int 0-100>,
  "format_score": <int 0-100>,
  "experience_match": <int 0-100>,
  "skills_match": <int 0-100>,
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "verdict": "Strong Match | Good Match | Needs Improvement | Poor Match"
}}"""
    client = _get_ai_client()
    if client is None:
        # Demo fallback response
        return {
            "ats_score": 65,
            "matched_keywords": ["Python", "SQL"],
            "missing_keywords": ["AWS"],
            "keyword_match_percent": 66,
            "format_score": 80,
            "experience_match": 70,
            "skills_match": 75,
            "suggestions": ["Add AWS experience", "Include metrics for projects"],
            "verdict": "Good Match"
        }
    r = client.chat.completions.create(
        model=MODEL, temperature=0.2,
        messages=[{"role": "user", "content": prompt}]
    )
    raw = r.choices[0].message.content.strip().replace("```json","").replace("```","").strip()
    return json.loads(raw)


async def analyze_keyword_gap(resume_text: str, job_description: str) -> dict:
    prompt = f"""You are a resume keyword expert.
Analyze the keyword gap between this resume and job description.

Resume:
{resume_text[:3000]}

Job Description:
{job_description[:2000]}

Return ONLY valid JSON, no markdown:
{{
  "critical_missing": [{{"keyword":"...","importance":"High","context":"why this matters"}}],
  "nice_to_have_missing": [{{"keyword":"...","importance":"Medium","context":"why this matters"}}],
  "present_keywords": ["keyword1","keyword2"],
  "total_jd_keywords": <int>,
  "matched_count": <int>,
  "gap_score": <int 0-100>,
  "top_recommendation": "one sentence on most important action to take"
}}"""
    client = _get_ai_client()
    if client is None:
        return {
            "critical_missing": [{"keyword": "AWS", "importance": "High", "context": "Cloud experience often required"}],
            "nice_to_have_missing": [{"keyword": "Docker", "importance": "Medium", "context": "Helpful for deployments"}],
            "present_keywords": ["Python", "SQL"],
            "total_jd_keywords": 5,
            "matched_count": 3,
            "gap_score": 60,
            "top_recommendation": "Add cloud (AWS) experience and list relevant tools."
        }
    r = client.chat.completions.create(
        model=MODEL, temperature=0.2,
        messages=[{"role": "user", "content": prompt}]
    )
    raw = r.choices[0].message.content.strip().replace("```json","").replace("```","").strip()
    return json.loads(raw)


async def build_ai_resume(user_data: dict) -> dict:
    prompt = f"""You are an expert resume writer. Create a professional, ATS-optimized resume.

Candidate Info:
Name: {user_data.get('name','')}
Role: {user_data.get('role','')}
Experience: {user_data.get('experience','')}
Skills: {user_data.get('skills','')}
Work History: {user_data.get('work_history','')}
Education: {user_data.get('education','')}
Projects: {user_data.get('projects','')}
Achievements: {user_data.get('achievements','')}
Target Job: {user_data.get('target_job','')}

Return ONLY valid JSON, no markdown:
{{
  "summary": "2-3 sentence professional summary",
  "skills": ["skill1","skill2",...],
  "experience": [
    {{
      "company": "...",
      "role": "...",
      "duration": "...",
      "bullets": ["achievement 1 with metrics","achievement 2","achievement 3"]
    }}
  ],
  "education": [{{"degree":"...","institution":"...","year":"..."}}],
  "projects": [{{"name":"...","description":"...","technologies":"..."}}],
  "certifications": ["cert1","cert2"],
  "keywords": ["ats keyword1","ats keyword2"]
}}"""
    client = _get_ai_client()
    if client is None:
        return {
            "summary": f"{user_data.get('name','')} is a {user_data.get('experience','')} professional experienced in {user_data.get('skills','')}",
            "skills": [s.strip() for s in (user_data.get('skills') or '').split(',') if s.strip()],
            "experience": [{
                "company": "Example Co",
                "role": user_data.get('role',''),
                "duration": user_data.get('experience',''),
                "bullets": ["Worked on REST APIs","Improved SQL performance by 20%"]
            }],
            "education": [{"degree": "B.Sc.", "institution": "University", "year": ""}],
            "projects": [],
            "certifications": [],
            "keywords": [k.strip() for k in (user_data.get('skills') or '').split(',') if k.strip()]
        }
    r = client.chat.completions.create(
        model=MODEL, temperature=0.4,
        messages=[{"role": "user", "content": prompt}]
    )
    raw = r.choices[0].message.content.strip().replace("```json","").replace("```","").strip()
    return json.loads(raw)