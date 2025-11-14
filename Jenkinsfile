pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    parameters {
        string(name: 'BRANCH_NAME', defaultValue: 'main', description: 'Branch to build from')
        string(name: 'STUDENT_NAME', defaultValue: 'Mohammed Zain ul Hassan', description: 'I am Zain and my roll no is 23i-6030')
        choice(name: 'ENVIRONMENT', choices: ['dev', 'qa', 'prod'], description: 'Select environment')
        
        // --- NEW PARAMETER ---
        string(name: 'DOCKERHUB_USERNAME', defaultValue: 'your-dockerhub-username', description: 'Your Docker Hub Username')
    }

    environment {
        APP_VERSION = "1.0.${BUILD_NUMBER}"
        MAINTAINER = "Student"
        
        // --- NEW ENVIRONMENT VARIABLES ---
        // Creates an image name like: <username>/temp-converter
        IMAGE_NAME = "${params.DOCKERHUB_USERNAME}/temp-converter"
        // Creates a tag like: v1.0.12 (using the Jenkins build number)
        IMAGE_TAG = "v${APP_VERSION}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out branch: ${params.BRANCH_NAME}"
                checkout scm
                // --- Kept your robust checkout script ---
                sh """
                git fetch --all --prune
                git checkout ${params.BRANCH_NAME} || git checkout -b ${params.BRANCH_NAME} origin/${params.BRANCH_NAME}
                git pull --ff-only origin ${params.BRANCH_NAME}
                """
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing required packages..."
                // --- Kept your npm ci script ---
                sh '[ -f package-lock.json ] && npm ci || npm install'
            }
        }

        // 'Build' stage is REMOVED (now happens in Dockerfile)
        // 'Test' stage is REMOVED (now happens in Dockerfile)
        // 'Package' stage is REMOVED (replaced by Docker push)
        // 'Archive Artifacts' stage is REMOVED (Docker Hub is our archive)

        // --- NEW MERGED STAGE ---
        stage('Build & Push Docker Image') {
            steps {
                echo "Building Docker Image: ${IMAGE_NAME}:${IMAGE_TAG}"
                
                // 1. Build the image. The 'RUN npm test' inside the
                //    Dockerfile will run here. If tests fail, the build fails.
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                
                // 2. Log in to Docker Hub using the credentials
                //    (You must create 'dockerhub-creds' in Jenkins)
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    echo "Logging in to Docker Hub..."
                    sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                }

                // 3. Push the image to Docker Hub
                echo "Pushing image to ${IMAGE_NAME}:${IMAGE_TAG}"
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"

                // 4. (Optional) Also push a 'latest' tag
                echo "Tagging and pushing 'latest'..."
                sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
                sh "docker push ${IMAGE_NAME}:latest"
            }
        }

        stage('Deploy (Simulation)') {
            steps {
                // --- Updated echo message ---
                echo "Simulating deployment of ${IMAGE_NAME}:${IMAGE_TAG} to ${params.ENVIRONMENT}"
            }
        }
    }

    post {
        always {
            echo "Cleaning up workspace..."
            // --- Good hygiene: Log out of Docker Hub ---
            sh "docker logout"
            deleteDir()
        }
        success {
            // --- Kept your custom success messages ---
            echo "Mohammed Zain ul Hassan, i236030"
            echo "Pipeline succeeded! Image ${IMAGE_NAME}:${IMAGE_TAG} pushed to Docker Hub."
        }
        failure {
            echo "Pipeline failed! Check console output for details."
        }
    }
}