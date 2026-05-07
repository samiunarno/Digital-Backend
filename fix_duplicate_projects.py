with open('src/data/portfolioData.ts', 'r') as f:
    lines = f.readlines()

new_lines = []
projects_count = 0

for line in lines:
    if line.strip().startswith('"projects": {'):
        projects_count += 1
        if projects_count == 2:
            continue # skip the second occurrence (which is my duplicate in en section)
        if projects_count == 4:
            continue # skip the fourth occurrence (duplicate in zh section)
    new_lines.append(line)

with open('src/data/portfolioData.ts', 'w') as f:
    f.writelines(new_lines)
print("Removed duplicate projects")
