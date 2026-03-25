# Workshop app plan
## working items
- confirmation form
  - doctor inspection
    - treatment items
    - date
    - location
    - expect n times follow up
    - special concerns
  - follow up
    - make an excel form
- Excel form
  - 進銷存
    - part no.
      - BBB-xxx-cccccc
      - BBB : Brand code
      - xxx : serial number
      - cccccc : ml or g and quantity
    - 
  - treatment order
    - follow up sheet
  - 固定資產分攤
  - 房租
  - 薪資
- Clinext app 
  - bar code reader
  - data entry page


# AI prompt
## 2026/3/1

- 療程訂單目前的狀態如上圖, 但仍覺得混淆.目前的情況有:
  - 新客戶的新療程單.
  - 老客戶的固定週期療程單的新單, 如一個療程共須5個療程的第一個療程, 1/5... 5/5 中的 1/5 如何訂狀態？ 又 3/5 應為何狀態(回診單? 週期單?) 

  - 已完成有可分兩種狀態：
    - 第一種: (已完成 ? )
      - 已服務完成.僅記錄療程項目,藥材,收入及費用.
    - 第二種: (已扣帳 ? )
      - 扣除成本及費用計算出該單之毛利
      - 使用藥材之庫存銷貨的數量扣帳
  - 其他訂單狀態：
    - 預約訂單
    - 已取消
    - 進行中
- 請提供所有可能的療程狀態並說明之.