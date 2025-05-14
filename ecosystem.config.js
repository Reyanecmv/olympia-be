// ecosystem.config.js
module.exports = {
    apps: [{
        name: "soap-api",                   // Application name
        script: "./dist/src/app.js",            // Path to your application entry point
        instances: "max",                   // Use max CPU cores for cluster mode
        exec_mode: "cluster",               // Run in cluster mode
        watch: false,                       // Don't watch for file changes
        max_memory_restart: "1G",           // Restart if memory exceeds 1GB
        env: {
            NODE_ENV: "production",
            DATABASE_URL: "postgresql://doadmin:AVNS_AgI5gHL2tNGb1usiCTo@dbaas-db-9360433-do-user-22368198-0.g.db.ondigitalocean.com:25060/defaultdb?sslmode=require",
            JWT_SECRET: "fc8bcf865041604587eb18cb4fbaeef4a533692c3f3c172aa2669fe82c36e7ce1d8fb9688697ac299a466ac3b4eaa75604bc2fb5e48ed4cf0405838ce919006742cfbc63e28b4835c5cbf7dfcf3db5d7fb3f70666a603cdf2bd10c82a3f41c38525e06952b3f7b3f1a2bc95de455f7e2ddc99284c1a6d15a73dabdeab3b7cd85c82e73765789a478282ac3527db88b289971b0ab44aa10f7b185458b1bab67178a156659724c423941755e8267146a1240b312bd5fb117f58215e21088be72b18336e20f2bfcb430fe839032a0e63f42e4ae3611a65be407c04c9d7aa2338f80702f320da09e181a8d5e04a89377c694c85a5c5f89dc6112be969ad3ec248021",
            JWT_ISS: "http://localhost:3000",
            JWT_ALLOWED_ISS: "http://localhost:3000",
            JWT_ALGORITHM: "HS512",
            DEFAULT_DISK: "local",
            REDIS_HOST: "localhost",
            REDIS_PORT: "6379",
            NODE_TLS_REJECT_UNAUTHORIZED: "0",
            ABACUS_USER: "olimpia_webservice",
            ABACUS_PASSWORD: "Ol1mPi@_2021",
            ABACUS_BASE_URL: "http://92.82.40.66/AbacusWebService/Serviceoperation.asmx",
            PASSCODE: "this_is_a_random_passcode8473429"
        },
        // Error and out logs
        error_file: "./logs/error.log",
        out_file: "./logs/out.log",
        // Log formatting
        log_date_format: "YYYY-MM-DD HH:mm:ss",
        // Merge logs if running multiple instances
        merge_logs: true,
        // Restart behavior
        autorestart: true,
        restart_delay: 5000,  // 5 seconds between restarts
        // Graceful shutdown
        kill_timeout: 5000,   // Time to send SIGKILL after SIGINT (5 seconds)
        // Additional PM2 behavior configurations
        listen_timeout: 50000,
        max_restarts: 10,
        // Wait for app to be ready
        wait_ready: true,
        // Custom startup args if needed
        // node_args: "--max-old-space-size=1536"
    }]
};