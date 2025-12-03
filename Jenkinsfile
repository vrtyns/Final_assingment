pipeline {
    agent any

    // 1. ประกาศตัวแปร Environment ตรงนี้เพื่อให้ Shell มองเห็นได้เลย
    environment {
        // ฝั่งซ้ายคือชื่อตัวแปรที่จะใช้ใน Shell / ฝั่งขวาคือ ID ใน Jenkins Credentials
        MYSQL_ROOT_PASSWORD = credentials('MYSQL_ROOT_PASSWORD')
        MYSQL_DATABASE      = credentials('MYSQL_DATABASE')
        MYSQL_USER          = credentials('MYSQL_USER')
        MYSQL_PASSWORD      = credentials('MYSQL_PASSWORD')
        DB_PORT             = credentials('DB_PORT')
        
        // ตัวแปรทั่วไป (ไม่ใช่ความลับ) ก็ประกาศตรงนี้ได้
        API_PORT            = '3000' 
    }

    stages {
        stage('Deploy') {
            steps {
                script {
                    // 2. ใช้ ''' (Single Quotes 3 ตัว) ครอบคำสั่ง
                    sh '''
                        echo "Starting Deployment..."
                        
                        # ลบ Container เก่าทิ้งก่อน (ถ้ามี)
                        docker compose down || true
                        
                        # สร้างใหม่
                        docker compose build
                        
                        # รันขึ้นมา (ไม่ต้องพิมพ์ MYSQL_...=... ยาวๆ แล้ว เพราะมันอ่านจาก env ด้านบนเอง)
                        docker compose up -d
                        
                        echo "Deployment Finished!"
                    '''
                }
            }
        }
        
        stage('Verify') {
             steps {
                 script {
                     // รอสักนิดให้ Database ตื่น
                     sleep 10
                     sh 'docker compose logs --tail=20'
                 }
             }
        }
    }
}