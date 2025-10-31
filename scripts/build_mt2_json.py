import json, re, os
from pathlib import Path

EXTRACT_DIR = Path('EECS16A/Extracted')
OUT_DIR = Path('EECS16A/site/data')
OUT_DIR.mkdir(parents=True, exist_ok=True)

TOPIC_KEYWORDS = {
  'vectors-matrices': ['vector', 'matrix', 'span', 'linear transform', 'basis', 'orthonormal', 'dot product'],
  'rank-nullspace': ['rank', 'null space', 'nullspace', 'column space', 'independent', 'pivot', 'nullity'],
  'projections': ['least squares', 'normal equation', 'a^t a', 'projection', 'residual', 'orthogonal projection'],
  'kcl-kvl': ['kcl', 'kvl', 'kirchhoff', 'loop', 'mesh'],
  'nodal': ['nodal', 'node voltage', 'supernode', 'conductance', 'g matrix'],
  'thevenin': ['thevenin', 'norton', 'rth', 'vth', 'i_n', 'equivalent circuit'],
  'opamp': ['op-amp', 'opamp', 'comparator', 'amplifier', 'ideal op'],
  'transforms': ['homography', 'affine', 'perspective', 'transform', 'warp'],
  'camera': ['camera', 'intrinsic', 'extrinsic', 'calibration', 'focal'],
}

START_PATTERNS = [
  re.compile(r'^\s*(MT2\.\d+)\b', re.I),
  re.compile(r'^\s*(E2\.\d+)\b', re.I),
  re.compile(r'^\s*(Problem|Question)\s*(\d+)\b', re.I),
  re.compile(r'^\s*Q\s*(\d+)\b', re.I),
  re.compile(r'^\s*(\d+)\s*[\).]\s'),
]

SKIP_TITLES = ['honor code', 'instructions', 'read the following']

def detect_starts(lines):
    idx = []
    for i, l in enumerate(lines):
        s = l.strip().lower()
        if not s:
            continue
        for pat in START_PATTERNS:
            m = pat.match(l)
            if m:
                # filter out obvious non-problem headers
                if any(k in s for k in SKIP_TITLES):
                    break
                idx.append(i)
                break
    # ensure unique and sorted
    out = []
    for i in idx:
        if not out or i != out[-1]:
            out.append(i)
    return out


def chunk_problems(text):
    lines = text.splitlines()
    starts = detect_starts(lines)
    if not starts:
        return [{'title': 'All', 'body': text}]
    chunks = []
    for k, st in enumerate(starts):
        en = (starts[k+1]-1) if k < len(starts)-1 else len(lines)-1
        body = "\n".join(lines[st:en+1]).strip()
        title_line = lines[st].strip()
        title = 'Q?'
        for pat in START_PATTERNS:
            m = pat.match(title_line)
            if m:
                if m.lastindex and m.lastindex >= 1:
                    val = m.group(m.lastindex)
                else:
                    val = m.group(1)
                val = str(val)
                # normalize
                if val.lower().startswith(('mt2.', 'e2.')):
                    title = val.upper()
                else:
                    title = 'Q'+val
                break
        chunks.append({'title': title, 'body': body})
    return chunks


def classify_topic(body):
    s = body.lower()
    best = None
    for topic, kws in TOPIC_KEYWORDS.items():
        for kw in kws:
            if kw in s:
                return topic
    # heuristic for circuits vs linear algebra
    if any(w in s for w in ['resistor', 'capacitor', 'current', 'voltage', 'node', 'source']):
        return 'kcl-kvl'
    if any(w in s for w in ['vector', 'matrix', 'span', 'rank', 'null']):
        return 'vectors-matrices'
    return 'vectors-matrices'

results = {}
for p in sorted(EXTRACT_DIR.glob('*_mt2_exam.txt')):
    name = p.stem  # e.g., sp23_mt2_exam
    exam_code = name.replace('_exam','')
    txt = p.read_text(encoding='utf-8', errors='ignore')
    probs = chunk_problems(txt)
    items = []
    for pr in probs:
        topic = classify_topic(pr['body'])
        # snippet or full? we embed full body
        snippet = pr['body']
        items.append({
            'title': pr['title'],
            'topic': topic,
            'snippet': snippet,
            'exam': exam_code
        })
    results[name] = {'sourceExam': exam_code, 'problems': items}

OUT = OUT_DIR / 'mt2_examples.json'
OUT.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'Wrote {OUT}')
