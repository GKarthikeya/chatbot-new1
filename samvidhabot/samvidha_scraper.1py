from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time

def get_attendance_summary(username, password):
    options = Options()
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    # options.add_argument('--headless')  # Optional: Uncomment for production

    driver = webdriver.Chrome(options=options)

    try:
        # Step 1: Login
        driver.get("https://samvidha.iare.ac.in/")
        time.sleep(2)

        driver.find_element(By.ID, "txt_uname").send_keys(username)
        driver.find_element(By.ID, "txt_pwd").send_keys(password)
        driver.find_element(By.ID, "but_submit").click()
        time.sleep(3)

        # Step 2: Navigate to attendance page
        driver.get("https://samvidha.iare.ac.in/home?action=course_content")
        time.sleep(5)

        # Step 3: Get full visible page text
        full_text = driver.find_element(By.TAG_NAME, "body").text

        # Step 4: Count PRESENT and ABSENT
        present_count = full_text.upper().count("PRESENT")
        absent_count = full_text.upper().count("ABSENT")
        total = present_count + absent_count

        if total > 0:
            percentage = round((present_count / total) * 100, 2)
            result = (
                f"📊  Attendance Summary:\n"
                f"✅ Present: {present_count}\n"
                f"❌ Absent: {absent_count}\n"
                f"👉Percentage: {percentage}%"
            )
        else:
            result = "⚠️ No attendance data found (0 present/absent combined)."

    except Exception as e:
        result = f"❌ Error: {str(e)}"

    finally:
        driver.quit()

    return result

# Optional: for local testing only
if __name__ == "__main__":
    username = "23951a67e1"
    password = "Satya@9100"
    print(get_attendance_summary(username, password))
