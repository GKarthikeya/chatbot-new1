from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

def get_attendance_summary(username, password):
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    try:
        driver.get("https://samvidha.iare.ac.in/")
        time.sleep(2)
        driver.find_element(By.ID, "txt_uname").send_keys(username)
        driver.find_element(By.ID, "txt_pwd").send_keys(password)
        driver.find_element(By.ID, "but_submit").click()
        time.sleep(3)

        driver.get("https://samvidha.iare.ac.in/home?action=course_content")
        time.sleep(5)
        full_text = driver.find_element(By.TAG_NAME, "body").text
        present_count = full_text.upper().count("PRESENT")
        absent_count = full_text.upper().count("ABSENT")
        total = present_count + absent_count

        if total > 0:
            percentage = round((present_count / total) * 100, 2)
            result = f"✅ Present: {present_count}\n❌ Absent: {absent_count}\n📊 Percentage: {percentage}%"
        else:
            result = "⚠️ No attendance data found."

    except Exception as e:
        result = f"❌ Error: {str(e)}"

    driver.quit()
    return result
