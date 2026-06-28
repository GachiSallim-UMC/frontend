import re, glob, os

files = (
    glob.glob('src/assets/icons/action/*.svg')
    + glob.glob('src/assets/icons/rule/*.svg')
    + glob.glob('src/assets/icons/card/*.svg')
)
for f in files:
    with open(f, encoding='utf-8') as fp:
        s = fp.read()
    # Figma 캔버스/섹션 배경 + 컴포넌트 점선 테두리 제거
    s = re.sub(r'<rect[^>]*fill="#F5F5F5"[^>]*/>', '', s)
    s = re.sub(r'<rect[^>]*fill="#C5C5C5"[^>]*/>', '', s)
    s = re.sub(r'<rect[^>]*fill="white"[^>]*/>', '', s)
    s = re.sub(r'<rect[^>]*fill="#FFFFFF"[^>]*/>', '', s, flags=re.I)
    s = re.sub(r'<rect[^>]*stroke="#9747FF"[^>]*/>', '', s)
    s = re.sub(r'<svg width="\d+" height="\d+"', '<svg', s)
    # card(다색)는 색 유지, 나머지(단색)는 currentColor
    is_card = 'card' in os.path.normpath(f).split(os.sep)
    if not is_card:
        s = re.sub(r'(stroke|fill)="#[0-9A-Fa-f]{6}"', r'\1="currentColor"', s)
    with open(f, 'w', encoding='utf-8') as fp:
        fp.write(s)

print(f'후처리 완료: {len(files)}개')
print()
print('=== action/share.svg ===')
print(open('src/assets/icons/action/share.svg', encoding='utf-8').read()[:350])
print()
print('=== card/today-chore.svg (다색 유지) ===')
print(open('src/assets/icons/card/today-chore.svg', encoding='utf-8').read()[:450])
