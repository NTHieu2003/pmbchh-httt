interface AppEnv {
  API_URL: string;
  TIME_OUT: number;
}
const env: AppEnv = {
  // API_URL: 'http://103.124.94.201:8888', 
  // API_URL: 'https://smta.lqdtu.edu.vn:666',
  // API_URL: 'http://192.168.1.11:4200',
  API_URL: 'http://192.168.21.152:4200',
  TIME_OUT: 30000,
};

export default env;
