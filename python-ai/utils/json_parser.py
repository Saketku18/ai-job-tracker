import re
import json

def safe_parse(output: str, default: dict):
    output = output.strip()

    # remove markdown
    if "```" in output:
        output = output.split("```")[1]

    # extract JSON
    match = re.search(r'\{.*\}', output, re.DOTALL)
    if match:
        output = match.group(0)

    try:
        return json.loads(output)
    except:
        return default