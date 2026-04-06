import { WebSocketServer } from 'ws';
// import mqtt from 'mqtt';
// 準備存放 MQTT 客戶端實體
// let mqttClient = null;

// 存放之後建立的 WebSocket 伺服器實體
let wss = null;

// 初始化 WebSocket Server
export const initSocket = (server) => {
  wss = new WebSocketServer({ server });
  wss.on('connection', (ws) => {
    console.log('---[Socket]前端已連線---');
    // 測試訊息
    ws.send(JSON.stringify({ type: 'SYSTEM', msg: '已成功連接到伺服器' }));
    ws.on('close', () => console.log('--- [Socket] 前端已斷開 ---'));
    // 錯誤處理
    ws.on('error', (err) => console.error('Socket 錯誤:', err));
  });

  // --- 初始化 MQTT 連線---
  // 斷線重連設定
  // const mqttOptions = {
  //   reconnectPeriod: 5000,
  //   connectTimeout: 30000,
  //   keepalive: 60
  // };
  // Broker 地址
  // mqttClient = mqtt.connect('mqtt://localhost:1883', mqttOption);
  // 訂閱產線設備的主題
  // mqttClient.on('connect', () => {
  //   mqttClient.subscribe('factory/line1/temp');
  // });
  // --- MQTT 消息轉換為 WebSocket 廣播 ---
  // mqttClient.on('message', (topic, message) => {
  //   try {
  //     // 假設 MQTT 傳過來的是 Buffer，先轉成字串再解析 JSON
  //     const rawData = JSON.parse(message.toString());
  //     // 數據清洗：
  //     const ioTData = {
  //       type: 'TEMP_SENSOR',
  //       value: parseFloat(rawData.temp || rawData.value).toFixed(1),
  //       time: rawData.time || new Date().toLocaleTimeString()
  //     };
  //     // 廣播數據
  //     broadcast(ioTData);
  //   } catch (err) {
  //     console.error('MQTT 數據解析失敗:', err);
  //   }
  // });

  // --- 模擬IoT 數據流 ---
  setInterval(() => {
    const mockIoIData = {
      type: 'TEMP_SENSOR',
      value: (Math.random() * 10 + 25).toFixed(1),
      time: new Date().toLocaleTimeString()
    };
    broadcast(mockIoIData);
  }, 5000);
};

// 廣播方法
export const broadcast = (data) => {
  if (!wss) return;
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
};
