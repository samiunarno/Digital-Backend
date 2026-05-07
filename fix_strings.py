import re

with open('src/components/Portfolio.tsx', 'r') as f:
    code = f.read()

# 1. Fix Duplicates
code = re.sub(
    r"\{language === 'en' \? 'The' : ''\} (\s*<span[^>]*>\{content\[language\]\.ui\.about\.title\}</span>)",
    r"\1", code
)
code = re.sub(
    r"\{language === 'en' \? 'Strategic' : ''\} (\s*<span[^>]*>\{content\[language\]\.ui\.services\.title\}</span>)",
    r"\1", code
)
code = re.sub(
    r"\{language === 'en' \? 'Technical' : ''\} (\s*<span[^>]*>\{content\[language\]\.ui\.tech\.title\}</span>)",
    r"\1", code
)
code = re.sub(
    r"\{language === 'en' \? 'Selected' : ''\}<br/>(\s*<span[^>]*>\{content\[language\]\.ui\.projects\.title\}</span>)",
    r"\1", code
)
code = re.sub(
    r"\{language === 'en' \? 'Initialize' : ''\}<br/>(\s*<span[^>]*>\{content\[language\]\.ui\.contact\.title\}</span>)",
    r"\1", code
)

# 2. Contact form replacements
code = code.replace("{language === 'en' ? 'Full_Name' : '姓名'}", "{content[language].ui.contact.name}")
code = code.replace("{language === 'en' ? \"John Doe\" : \"张三\"}", "{content[language].ui.contact.placeholderName}")
code = code.replace("{language === 'en' ? 'Email_Address' : '电子邮箱'}", "{content[language].ui.contact.emailLabel}")
code = code.replace("{language === 'en' ? 'Message_Payload' : '消息内容'}", "{content[language].ui.contact.message}")
code = code.replace("{language === 'en' ? \"Describe your project requirements...\" : \"描述您的项目需求...\"}", "{content[language].ui.contact.placeholderMessage}")
code = code.replace("{formStatus === 'idle' ? (language === 'en' ? 'Transmit Message' : '发送消息') : formStatus === 'sending' ? (language === 'en' ? 'Transmitting...' : '正在发送...') : (language === 'en' ? 'Message Received' : '消息已收到')}", "{formStatus === 'idle' ? content[language].ui.contact.transmit : formStatus === 'sending' ? content[language].ui.contact.transmitting : content[language].ui.contact.received}")

with open('src/components/Portfolio.tsx', 'w') as f:
    f.write(code)
print("Phase 1 done")
