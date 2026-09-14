import os
import shutil
import zipfile

base_dir = r'c:\Users\patha\OneDrive\Desktop\bt-security-platform'
standalone_dir = os.path.join(base_dir, '.next', 'standalone')

# 1. Copy our robust standalone server.js
shutil.copy2(
    r'C:\Users\patha\.gemini\antigravity\brain\18b1d004-8208-4d03-b761-fd6b8353b196\scratch\standalone_server.js',
    os.path.join(standalone_dir, 'server.js')
)

# 2. Copy .next/static to .next/standalone/.next/static
src_static = os.path.join(base_dir, '.next', 'static')
dst_static = os.path.join(standalone_dir, '.next', 'static')
if os.path.exists(dst_static):
    shutil.rmtree(dst_static)
shutil.copytree(src_static, dst_static)

# 3. Copy public to .next/standalone/public
src_public = os.path.join(base_dir, 'public')
dst_public = os.path.join(standalone_dir, 'public')
if os.path.exists(dst_public):
    shutil.rmtree(dst_public)
shutil.copytree(src_public, dst_public)

# 4. Copy .htaccess
htaccess_content = '''# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION BEGIN
PassengerAppRoot "/home/bestcctv/domains/bestcctvservice.com/public_html"
PassengerBaseURI "/"
PassengerNodejs "/home/bestcctv/nodevenv/domains/bestcctvservice.com/public_html/22/bin/node"
PassengerAppType node
PassengerStartupFile server.js
PassengerAppEnv production
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION END
'''
with open(os.path.join(standalone_dir, '.htaccess'), 'w', encoding='utf-8') as f:
    f.write(htaccess_content)

# 5. Zip
zip_path = os.path.join(base_dir, 'bestcctv_standalone.zip')
if os.path.exists(zip_path):
    os.remove(zip_path)

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(standalone_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, standalone_dir)
            zf.write(full_path, rel_path.replace(os.sep, '/'))

size_mb = os.path.getsize(zip_path) / (1024 * 1024)
print(f'NEW_STANDALONE_ZIP_WITH_LINUX_PRISMA: {size_mb:.2f} MB')
