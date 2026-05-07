with open('src/data/portfolioData.ts', 'r') as f:
    content = f.read()

content = content.replace("},,", "},")

with open('src/data/portfolioData.ts', 'w') as f:
    f.write(content)
print("Fixed commas")
