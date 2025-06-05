from flask import Flask, request
import datetime
import os

app = Flask(__name__)
LOG_FILE = 'visitors.log'

# تأكد من وجود ملف السجل
if not os.path.exists(LOG_FILE):
    with open(LOG_FILE, 'w') as f:
        f.write("Visitor Logs:\n")

@app.route('/log_visit', methods=['GET'])
def log_visit():
    # الحصول على عنوان IP للزائر
    # نستخدم get('X-Forwarded-For') أولاً لأنها تعمل بشكل أفضل خلف البروكسيات (مثل خدمات الاستضافة)
    # إذا لم تكن موجودة، نستخدم remote_addr
    if 'X-Forwarded-For' in request.headers:
        ip_address = request.headers['X-Forwarded-For'].split(',')[0].strip()
    else:
        ip_address = request.remote_addr
        
    # الحصول على الوقت الحالي
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # تسجيل البيانات في ملف السجل
    log_entry = f"{timestamp} - IP: {ip_address}\n"
    with open(LOG_FILE, 'a') as f:
        f.write(log_entry)

    # إرجاع استجابة بسيطة (يمكن أن تكون فارغة)
    return "Logged!", 200

@app.route('/')
def index():
    return "Visitor Logger is running. Send GET requests to /log_visit to log visitors.", 200

if __name__ == '__main__':
    # تشغيل التطبيق على المنفذ 5000
    # يمكن تغيير المنفذ إذا كان 5000 مستخدماً
    # debug=True مفيد للتطوير، يجب تعطيله في الإنتاج
    app.run(host='0.0.0.0', port=5000, debug=False) 