with open('src/components/Portfolio.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    # Removing Education Section (975-999)
    if 974 <= i <= 998: continue
    # Removing SystemCoreTelemetry usage (1021-1022)
    if 1020 <= i <= 1021: continue
    # Removing SystemCoreTelemetry component (1425-1540)
    if 1424 <= i <= 1539: continue
    new_lines.append(line)

with open('src/components/Portfolio.tsx', 'w') as f:
    f.writelines(new_lines)
print("Removed sections successfully")
