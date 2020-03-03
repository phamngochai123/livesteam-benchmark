# livesteam-benchmark
Hướng dẫn sử dụng tool benchmark.

B1: CD đến thư mục project rồi install thư viện: yarn hoặc npm install.

B2: Chạy tool: node index.js

2.1: Chọn số luồng muốn tạo: Nhập số từ 1-10.

2.2: Chọn file nguồn:

  - 2.2.1: Gõ ‘no’ hoặc 'n' nếu không chọn (nếu không chọn file thì sẽ lấy file mặc định trong code).
  
  - 2.2.2: Nếu chọn file thì điền danh sách đường dẫn file cách nhau bởi dấu ‘,’.
  
    - Ví dụ:  /Applications/work/project/tool-upload/public/VideoSample-720p.mp4
    
2.3: Lấy link rtmp push:

  - 2.3.1: Chọn file để lấy link rtmp push: Nhập đường dẫn file hoặc enter để bỏ qua (Lưu ý: File text utf8 và mỗi link rtmp 1 dòng).
  
  - 2.3.2: Nếu bỏ qua 2.3.1 thì nhập api để lấy link push rtmp: Nhập api hoặc enter để bỏ qua(nếu không nhập thì lấy api mặc định).
  
2.4: Nhập thời gian delay giữa các job: Nhập số nguyên (thời gian tính theo giây, enter để bỏ qua. Thời gian mặc định là 0).

===> Các job bắt đầu chạy
