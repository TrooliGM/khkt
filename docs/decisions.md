# Quyết định và việc còn mở

## UI cuối thay phương án cũ — đã xác nhận 2026-10-31

- Cơ chế nhóm/Quay về thay tại cùng lưới áp dụng cả PC/mobile, giữ4/2cột và đủ kết quả. Khám phá là thông tin nghề với CTA chính “Cùng khám phá”, popup đầy đủ và video phụ; Truyện là video/truyện đúng nghề. Giữ dữ liệu và các mục/action popup cũ, không rút thành tổng quan. Chat theo header gọn, nội dung đầy đủ và trạng thái thật. Được commit nhánh tối ưu/tạo Preview, không push/merge main hoặc phát hành Production. Chi tiết `docs/ui-ux-final-checkpoint.md`.


## Tối ưu UI cả desktop/mobile — đã xác nhận 2026-10-31

- Người dùng cho phép tái sử dụng chọn lọc `fed4dee`, sửa CSS/JS để có chuyển động trên cả PC/điện thoại cho Khám phá/Truyện/Chat, commit nhánh tối ưu và tạo Preview. Desktop giữ cấu trúc, trang chủ giữ nguyên; không push/merge main, đổi env Production hoặc deploy Production. Yêu cầu đã chốt ưu tiên hơn gợi ý skill/mẫu; giữ HTML/Bootstrap, backend/auth/DB/quota8, giấy phép Galaxy và thay đổi local. Xem `docs/ui-ux-optimization-checkpoint.md`.


## Production video đã phát hành, không mở rộng phạm vi QA — 30/10/2026

Đã thực hiện quyền phát hành: Neon OAuth/read-only PASS, Preview Google/DeepSeek/Member/Guest8 PASS, tích hợp/push main92703d3 không force. Production dpl_AF4FHHHTCci7dGNLuvyiuCDqMojk READY, domain chính đã xác minh; candidate env Production không override/Preview DB và runtime100file khớp Preview. Hậu kiểm UI/3mẫu phát/Member/Guest PASS, giữ main:false/DB/quota/auth và không Hồ sơ. Kế thừa200video cũ, không gọi197video chưa phát lại là Production LIVE PASS. Rollback dpl_Gqr6yuuyfyurkBYZJEVuFaqjBs6Z cònREADY, không cần rollback. Commit tài liệu hậu kiểm riêng sau mã phát hành, không redeploy docs-only; SHA đã chạy luôn báo92703d34cdfacff7aa20a7ca37ae092ed3bd73bc.

## Neon MCP và phát hành Production video — đã xác nhận 30/10/2026

Người dùng cho phép bật lại đúng Neon MCP hiện có, OAuth lại và xác minh bằng đọc project/database, không đổi DATABASE_URL/tạo DB/reset/migration. Cổng phát hành: Google login thật, DeepSeek LIVE, Member lưu/reload và Guest quota8 trên Preview đầy đủ bằng tài khoản/phiên thử riêng. Khi cổng quan trọng đạt, được commit tài liệu liên quan, push/tích hợp main an toàn, giữ thay đổi mới hơn và phát hành Production bằng env Production hiện có, không promote DB Preview. Ghi rollback trước, hậu kiểm domain/200 nghề/Video-Truyện/tìm-lọc/mẫu phát/luồng chính; rollback nếu hồi quy nghiêm trọng. Không hỏi lại quyền phát hành đã cấp. Nếu blocker thực, ghi đúng và chưa vượt cổng.

Cổng Preview/Neon đã PASS. Chọn worktree release riêng từ origin/main, giữ main:false để push không tự promote; so hash toàn manifest với Preview thay vì rà lại code/kiểm thử toàn bộ. Mốc rollback thực dpl_Gqr6yuuyfyurkBYZJEVuFaqjBs6Z đã READY, Production hiện có đã mang 200 video nhưng ghi chú cũ. Dựng --prod --skip-domain không env override, xác minh database bằng MCP chỉ đọc trên đúng hội thoại QA, rồi promote/hậu kiểm. Các bằng chứng Google trước bị dừng do helper thiếu CTA/đồng ý lưu đã được hoàn tất bằng phiên thật; không thay logic website.

## Commit sửa UTF-8 và tạo Preview mới — đã xác nhận 30/10/2026

Người dùng cho phép commit riêng bản sửa tiếng Việt cùng tài liệu/bằng chứng video liên quan trong worktree career-video-pilot, rồi tạo Preview mới từ commit đó. Kế thừa bằng chứng 200/200 video khởi chạy PASS trên Preview trước; chỉ kiểm nhanh ghi chú sửa, catalog, tìm/lọc, Video/Truyện và luồng bị ảnh hưởng. Giữ Preview đầy đủ AI/auth/database và staging đã dùng, không mang override tắt dịch vụ của pilot. Không push/merge main hoặc phát hành Production; không tìm lại nguồn hay chạy lại toàn bộ kiểm thử khi không có thay đổi liên quan.

Đã thực hiện: commit `2366ad42a4d9e4130215db999515eaea09dadad1`, Preview `dpl_4kmjZ6KBTQFj3qni4uQedJGgUhtt` READY và smoke PASS. Không biến kết quả 200/200 kế thừa thành 200/200 trên Preview mới: chỉ 3 mẫu phát mới, 197 chưa phát lại. Giữ hậu kiểm mới local sau commit để HEAD vẫn chính là SHA đã deploy; chưa stage/commit hậu kiểm hoặc push. AI/auth chỉ xác minh configured và giữ flags/database, không tuyên bố LIVE login/DeepSeek PASS từ health.

## Tiếp tục QA video — yêu cầu xác nhận 29/10/2026

Tiếp tục đúng worktree career-video-pilot từ `0c9ddbb`, không làm lại 32 file hoặc tìm nguồn mới. Sửa đúng ghi chú mã hóa tái hiện được rồi kiểm Preview hiện có; phân biệt metadata commit dirty với nội dung thực tế, verified với LIVE, chưa thử với lỗi player và chưa xác nhận phát. Không đổi AI/auth/database/quota hoặc ghi đè thay đổi local; cập nhật checkpoint theo mốc, chưa Production. Lượt này chỉ sửa văn bản local và kiểm runtime hiện có, không triển khai mới.

## Video toàn bộ 200 nghề — quyền đã xác nhận, checkpoint 29/10/2026

Yêu cầu mới thay phạm vi pilot 5 nghề: được tìm nguồn toàn bộ 200 nghề, sửa mã/dữ liệu và deploy Preview đầy đủ; chưa được commit/push/merge hoặc phát hành Production. Giữ 200 truyện, video riêng từng nghề, không dùng nguồn sai nghề để đủ số; chỉ công khai nguồn có rà mẫu nội dung và bằng chứng player thật. Phân biệt mức rà mẫu với xem/nghe toàn bộ, và build READY với nghiệm thu Preview. Tái sử dụng staging đã xác minh, không mang cấu hình tắt AI/auth/database của pilot sang bản đầy đủ. Checkpoint hiện tại có lỗi mã hóa tiếng Việt đã biết và QA Preview còn thiếu, chưa hoàn tất bàn giao. Chi tiết: `docs/career-video-200-checkpoint.md`.

## Video thực tế — chỉ5 nghề mẫu và Preview (28/10/2026)

Người dùng yêu cầu kiểm kê thực tế có/thiếu/lỗi video rồi thêm5nghề khác nhóm, giữ truyện và hai lựa chọn rõ ràng. Chưa cho Production hay mở rộng200nghề. Chọn dữ liệu tĩnh biên tập từ nguồn thật; metadata/oEmbed không đủ để duyệt, phải thử phát nhúng Chrome. Không dùng chung video cho nhiều career_id.5nguồn mẫu đã phát thật, kiểm mẫu nội dung, chờ người dùng duyệt âm thanh/nội dung đầy đủ trên Preview; không giả định đã xem trọn. Giữ nguyên API/model/Neon/Firebase/quota; Preview riêng tắt các thao tác cần database, không dùngProduction làm môi trường thử. Không commit/push/merge trong đợt này. Chi tiết docs/career-video-pilot.md.

## Xác nhận phát hành sản phẩm cho Guest/Member — 28/10/2026

**Đã thực hiện:** commit43a8337 fast-forward main, Production dpl_7cdWzerGqdzD3c4Ucjvfb8GaJbfE đã promote và hậu kiểm Guest/Member/Google popup PASS. Không cần thêm QA flag vì source base đã công khai pipeline/search/analysis; các quyền dữ liệu, quota và công tắc sự cố giữ nguyên. Không migration/đổi env/DB/reset. Báo cáo hậu kiểm commit riêng chỉ tài liệu, không đổi mã Production; rollbackDa9yyb/1a534b1 sẵn sàng.

Người dùng trực tiếp cho phép commit/push/tích hợp main và deploy Production sau kiểm thử quan trọng, không hỏi lại bước phát hành đã duyệt. Giữ quota Guest8/rate limit, quyền sở hữu/Firebase và giới hạn dữ liệu tài khoản; không cấp QA/admin/debug/bypass. Không khôi phục Hồ sơ riêng; không migration/đổi DATABASE_URL/reset database. Rà source đã không còn QA gate cho pipeline/search/analysis nên kế thừa, không thêm rollout trùng lặp. Preview mới và Google popup đã đạt theo bằng chứng tại docs/task4-public-release.md; vẫn phải build candidate bằng environment Production riêng, smoke rồi promote/rollback có kiểm soát.

## Quyền tiếp tục Preview — đã thực hiện 28/10/2026

User thay gate cũ: cho reuse staging có sẵn và tạo Preview dù LIVE có thể BLOCKED, không tạo DB/schema/reset. Đã xác minh staging độc lập và dùng env riêng từng Preview, không đổi binding env dịch vụ. Không phát hành Production vì GuestLIVE/popupGoogle mới chưa đủ bằng chứng, dù Preview READY và Member/DeepSeek/DDGS PASS. Lỗi area hiện tại sửa ở schema sinh model, giữ validator cũ; không gọi đó là nguyên nhân Historical ValidationError. Giữ bản vá chưa commit; báo cáo docs/task4-profile-removal-preview-result.md.

## Preview gỡ Hồ sơ — quyền có gate (28/10/2026)

Người dùng cho kiểm tra/link/Preview từ đúng worktree local, không commit/push/merge/Production; bắt buộc dừng nếu chưa chứng minh database Preview độc lập. Đã xác minh thiếu DATABASE_URL áp dụng nhánh mới và dừng, không lấy cấu hình nhánh cũ làm mặc định hay tự tạo database. CLI/token local bị ignore không phải thay binding env dịch vụ. Chờ cấu hình Preview hợp lệ rồi mới tiếp tục manifest/build/deploy. docs/task4-profile-removal-preview.md.

## Đã xác nhận — bỏ Hồ sơ riêng (28/10/2026)

Người dùng chốt loại bỏ Hồ sơ hướng nghiệp cá nhân khỏi UI/nghiệp vụ, giữ ghi chú/tóm tắt/khảo sát/hành trình trong session và dữ liệu legacy. API Hồ sơ cũ ngừng với 410; cờ môi trường cũ không tái bật chức năng. Lưu hội thoại và xóa dữ liệu độc lập, dùng danh tính server và bảo vệ hiện hành. Phân tích khảo sát hiển thị trong chat từ kết quả đã lưu, trường hướng nghề thêm tùy chọn để tương thích dữ liệu cũ, không tự gọi AI khi render. Đã sửa/kiểm thử local ở nhánh riêng; chưa stage/commit/push/merge/Preview/Production hay migration. Không coi việc này là hoàn thành Task 4 hoặc xác định nguyên nhân Historical ValidationError. Xem docs/task4-profile-removal.md.

## Task 4 — xác nhận 25/10/2026

- User giao đủ53 yêu cầu theo4giaiđoạn; cho commit checkpoint, push nhánh Task4 và Preview, chưa Production.
- Xác minh Production df1c300 rồi tạo worktree riêng; không lấy checkout chính đang dirty hoặc main làm nguồn.
- Hồ sơ trích xuất cũ không tự thành consent: giữ dữ liệu phiên cũ, bảng confirmed mới có xác nhận từng mục/evidence/version. Profile opt-in theo cuộc trò chuyện; guest TTL không tự nâng thành lưu lâu dài sau claim.
- User xác nhận chưa có môi trường thử mới/Search key, chọn hoàn thiện code và Preview cách ly; LIVE ghi BLOCKED, không dùng secrets/DB Production. Neon Preview cũ chỉ đọc metadata/count, không áp006 vào đó.
- Preview readonly dựa envserver+VERCEL_ENVpreview, khóa mutation và không tạo guest/token/AI demo; module chat bình thường không thêm request preview-info. Đã deploy5bbc282 Preview, hậu kiểmREADY/desktop-mobile/isolationPASS;19PASS/34BLOCKED tiêu chí. Chưa cấp phép Production.

## Task 3.1 — quyết định mới 24/10/2026

- Người dùng yêu cầu trực tiếp redesign Truyện nghề/video YouTube, commit và push nhánh riêng để tạo Preview; chưa cho phát hành Production.
- Chọn thư viện tải thêm 12 nghề/lượt, chi tiết hai tab, reader một cảnh; giữ dữ liệu truyện và 200 hồ sơ nguyên trạng.
- Chỉ public video đã rà với phương pháp trung thực; chưa có Data API thì import URL thủ công vào candidate/pending, không tự duyệt. Hai video tiếng Anh cần người dùng nghe/duyệt trước Production.
- Preview thiếu DB/provider thử riêng: giữ read-only, không sao chép Production. Tắt Git auto-deploy đúng nhánh Task 3.1 để cấu hình cách ly sau khi nhánh tồn tại, rồi deploy Preview qua CLI; không đổi cấu hình Production.

## Truyện nghề2.0 — xác nhận24/10/2026

Đã thực hiện Preview chỉđọc c23cdf3, không thay Production và không push. Vercel giữ bảo vệ truy cập; không phát link có token.200truyệnHTTP và desktop/mobile Preview PASS. Còn cần duyệt người dùng và môi trường staging riêng nếu muốn kiểm provider thật trước phát hành. Bản commit báo cáo sau Preview chỉdocs, không phát hành thêm vì code không đổi. Không coi0video hoặc kiểm định chuỗi là200video/chứng nhậnchuyên gia hoàn tất.

Người dùng giao triển khai Task3, cho phép checkpointcommit4đợt và VercelPreview để duyệt; chưa cho phép Production. Nền5aaed6e Vercel thực, không quay về6c5ce23. Chọn dữ liệu tĩnh200ID hiện hành,5cảnh/2tìnhhuống, không migration hay lưu lựa chọn vàoDB.6legacy giữAPIversion1. Bản thảo riêng có phản hồi/hệ quả; component hiện có được mở rộng, không đổi hồ sơ200/ngôn ngữ thiết kế. AIhandoff tab TTL2h có scopephiên, khôngtoken trongURL/storagehandoff, chỉ gửi theo thao tác chủ động qua lớp bảo vệ cũ. Preview chưa cóDBriêng nên khóa AI/Firebase bằng overridedeployment và ghi nhãn chỉđọc, không dùngsecrets/DBProduction. Không đòi hỏi cài dịch vụ trả phí hoặc kết nối lạiProduction. Nội dung cần người dùng duyệt; validator không chứng nhậnchuyên gia toàn bộ200nghề. Quyết định hoãnTask3 ở checkpointcũ được yêu cầu mới thay thế.

## Đã xác nhận trong phiên làm việc

| Ngày | Nội dung | Cơ sở |
| --- | --- | --- |
| 2026-10-13 | Chuẩn bị Vercel theo tự nhận diện FastAPI; chỉ chỉnh cấu hình/tài liệu local, không commit/push, không sửa đăng nhập hoặc đổi Firebase project. | Yêu cầu trực tiếp mới nhất. Chưa triển khai; storage chat production còn thiếu. |
| 2026-10-13 | Đề xuất PostgreSQL managed và adapter/phiên TTL dùng chung để thay SQLite/RAM khi lên Vercel. | Đề xuất kỹ thuật, chưa được thực hiện và chưa là quyết định migrate dữ liệu của người dùng. |
| 2026-10-13 | Sau đăng nhập mở sẵn cuộc trò chuyện AI, không cần bấm Bắt đầu lần nữa; khôi phục phiên tab nếu có, phiên mới không tự lưu lâu dài. | Người dùng yêu cầu đi thẳng vào trò chuyện; giữ yêu cầu đồng ý lưu lịch sử hiện có. |
| 2026-10-13 | Dùng bản chạy trên máy trước; tiếp tục lưu mã nguồn GitHub, hoãn deployment. | Người dùng trả lời trực tiếp khi được hỏi về kết nối Vercel. Đây là quyết định mới nhất về triển khai. |
| 2026-10-13 | Xây dựng truyện nghề mô phỏng một ngày làm việc; lưu GitHub và hướng tới Vercel theo yêu cầu mới. | Người dùng yêu cầu trực tiếp, ghi rõ bác sĩ và bộ công nghệ hiện có; Vercel chưa kết nối, chưa triển khai thành công. |
| 2026-10-13 | Bản đầu gồm sáu nghề hiện có, bốn cảnh mỗi nghề, SVG/CSS và comic tương tác; AI giải thích theo cảnh. | Lựa chọn triển khai của trợ lý để cung cấp nội dung dùng được ngay, chưa phải video có lồng tiếng. |
| 2026-10-06 | Cài frontend-design ở phạm vi dự án. | Yêu cầu trực tiếp của người dùng; tệp đã được sao chép và kiểm tra khớp nội dung. |
| 2026-10-12 | Chỉ đưa micro nhận diện lời nói trở lại chat; giọng đọc Vbee không nằm trong bản hiện tại. | Yêu cầu trực tiếp mới nhất của người dùng, thay thế phạm vi voice rộng hơn trước đó. |
| 2026-10-12 | Lưu mã nguồn hiện tại lên GitHub `TrooliGM/quocan4`; chưa deploy website. | Người dùng yêu cầu trực tiếp, repository đã cung cấp trước đó. |
| 2026-10-06 | Tạo bộ nhớ dự án từ báo cáo DOCX. | Yêu cầu trực tiếp của người dùng. |
| 2026-10-06 | Triển khai chức năng 1: trang chủ và giới thiệu. | Yêu cầu trực tiếp của người dùng. |
| 2026-10-06 | Python backend, DeepSeek là AI chính, HTML/Bootstrap/CSS/JavaScript, LangGraph, Vercel và GitHub. | Công nghệ người dùng chỉ định. |
| 2026-10-06 | Repository đích: TrooliGM/quocan4. | URL người dùng cung cấp. |
| 2026-10-07 | Setup đăng nhập bằng Firebase. | Yêu cầu trực tiếp của người dùng. |
| 2026-10-07 | Dùng Firebase project khoa-hoc-86942, ứng dụng Web “la bàn tương lai”; cấu hình đặt ở .env cục bộ. | firebaseConfig người dùng cung cấp. |
| 2026-10-11 | Sau đăng nhập mở chat AI 1:1; bổ sung text/voice và bộ nhớ tài khoản. | Yêu cầu trực tiếp và brief đính kèm. |
| 2026-10-11 | Chưa triển khai website công khai. | Người dùng đã hoãn đưa website lên mạng trong trao đổi trước. |
| 2026-10-11 | Cấu hình khóa DeepSeek và token/App ID Vbee vào môi trường riêng để dùng dịch vụ thật. | Người dùng trực tiếp cung cấp thông tin dịch vụ cho tính năng AI. |
| 2026-10-11 | Thêm nhận diện/giọng đọc trình duyệt để thử voice ngay khi Google/Vbee chưa sẵn sàng. | Người dùng chọn “Thêm giọng trình duyệt để thử ngay”. |
| 2026-10-12 | Cho phép cài gói giọng tiếng Việt từ Windows Update trên máy. | Người dùng chọn “Đồng ý, cài giọng tiếng Việt giúp tôi”. Chưa cài thành công vì dịch vụ Windows Update kẹt; chưa được cho phép reboot máy. |
| 2026-10-12 | Cho phép tạm ngắt WARP để thử tải giọng, rồi kết nối lại. | Người dùng đồng ý trực tiếp. Đã thực hiện và xác minh WARP kết nối lại; Windows Update còn StopPending nên chưa thử lại được bước tải. Không kết luận WARP gây lỗi. |

## Lựa chọn triển khai của trợ lý

- FastAPI cho backend Python; dữ liệu mẫu đặt trong `content.py` để thay đổi dễ dàng.
- Tên hiển thị La Bàn; phong cách sổ tay khám phá với nền kem, xanh bạc hà và cam san hô. Đây là lựa chọn thiết kế, có thể điều chỉnh.
- LangGraph gồm hai node: chuẩn bị ngữ cảnh nghề và gọi DeepSeek. API key chỉ dùng trên server.
- Firebase Web SDK qua CDN cho email/password và Google; thêm quên mật khẩu, xác minh email, đăng xuất. Provider cụ thể là lựa chọn triển khai của trợ lý.
- Backend xác minh ID token bằng google-auth, không dùng service account. Chưa kiểm tra token bị thu hồi/disabled theo thời gian thực; chưa có chức năng quản trị nhạy cảm.
- Chưa lưu Firestore; mặc định chọn phiên theo tab, có lựa chọn giữ đăng nhập trên máy cá nhân.
- Tư vấn mới dùng `advisor/` với DeepSeek Flash configurable, một lời gọi/model mỗi lượt, đầu ra JSON kiểm tra trước khi lưu. Prompt nằm riêng.
- Chọn SQLite bổ sung cho bản local vì dự án chưa có database; không di chuyển/xóa dữ liệu cũ. Lưu lịch sử/hồ sơ khi có đồng ý; phiên không lưu ở RAM. Đây là lựa chọn kỹ thuật, chưa chốt database cloud.
- Voice dùng Google STT REST sau ghi âm WAV/VAD client, transcript sửa trước khi gửi; Vbee v1 sync chia đoạn <=280 ký tự. Không dùng streaming/WebSocket hoặc Vbee batch/webhook. Không tự bật micro sau giọng đọc.
- Thiếu khóa: demo có nhãn; không giả kết quả provider. Voice disabled khi thiếu cấu hình. Các provider thật chưa kiểm thử.
- Cập nhật sau nhận khóa: DeepSeek đã kiểm thử thật thành công và tắt demo local. Vbee lấy danh sách giọng thành công nhưng sync TTS bị gói tài khoản từ chối; tạm tắt bằng `VBEE_TTS_ENABLED=false`, UI giải thích hạn chế. Google STT vẫn chưa cấu hình. Chưa mua/nâng cấp dịch vụ hoặc chuyển sang batch/webhook.
- Sau xác nhận voice trình duyệt: thiếu Google/Vbee thì dùng Web Speech nếu được hỗ trợ. Nhận diện vi-VN cần thao tác xin quyền, transcript sửa trước khi gửi; giọng đọc chỉ chọn giọng Việt có trên máy, tự đọc mặc định tắt. Không coi chế độ này là offline hoặc đã xác minh Google/Vbee. Dừng/hủy/đổi phiên/đăng xuất chặn callback cũ.

## Chưa được quyết định

- Tên thương hiệu, logo, bảng màu và phong cách giao diện cụ thể.
- Phạm vi sau tính năng tư vấn 1:1.
- Cơ sở dữ liệu và nơi lưu nội dung đa phương tiện khi mở rộng.
- Hình thức trực quan hóa đầu tiên: comic, hoạt hình hay video; nguồn tài sản hình ảnh.
- Nguồn và cách cập nhật lương, triển vọng nghề, trường đào tạo, thông tin tuyển sinh.
- Bộ câu hỏi, quyền sử dụng nội dung trắc nghiệm, cách tính điểm và ánh xạ kết quả sang nghề.
- Quy trình chuyển câu hỏi cho giáo viên/chuyên gia và phạm vi AI khi mở rộng.
- Kiểm thử Email/Password và Google thật trên project đã cấu hình (ảnh đã thể hiện provider bật); Zalo chưa triển khai.
- Vai trò người dùng, quyền quản trị, thông tin học sinh cần thu thập và thời gian lưu dữ liệu.
- Phương pháp đánh giá hiệu quả hướng nghiệp cho báo cáo KHKT; chưa có kết quả khảo sát được cung cấp.

## Hướng triển khai đề xuất, chưa được phê duyệt

1. Chốt phạm vi bản đầu tiên và một số nghề có nội dung đủ tin cậy.
2. Thiết kế hành trình khám phá nghề → xem một ngày làm việc → xem kỹ năng và lộ trình.
3. Xây dựng giao diện responsive cùng nội dung nghề mẫu.
4. Bổ sung trắc nghiệm, cá nhân hóa, tư vấn và quản trị theo phạm vi đã chốt.
5. Kiểm tra trải nghiệm trên điện thoại, hiệu năng nội dung đa phương tiện và tính đúng của dữ liệu.

Danh sách này phục vụ những lượt làm việc tiếp theo; không phải công việc đã hoàn thành hoặc lịch triển khai đã được cam kết.


## Nhiệm vụ 1 — 2026-10-23

Yêu cầu đã xác nhận qua tài liệu Nhiệm vụ 1: được phát triển và commit nhánh riêng; không tự merge/deploy Production. Quyết định triển khai: khảo sát gắn session/owner trong metadata messages hiện có; giữ nguyên consent và TTL; không đổi schema, Firebase hay quota 8. Phân tích đi qua API chat hiện có và tính một lượt AI như trước. Chưa có phê duyệt push/triển khai; xem docs/task-1-checkpoint.md.


## Nhiệm vụ 2 — 2026-10-24

### Quyết định được xác nhận: AI Chat2.1 và hồ sơ nghề sâu —24/10/2026

Người dùng yêu cầu làm trọn Chat2.1 và mở rộng200 hồ sơ theo đợt25–50, commit nhánh phát triển từ Production hiện hành; không merge/deploy Production hay tự migration. Đã chọn nền Vercel xác minh d5f10cc, nhánh feat/ai-chat-2-1, giữ các worktree dirty nguyên trạng. Dùng dữ liệu nghề để tạo câu nháp, không gọi LLM chỉ để mở modal/đặt tên. Dùng metadata messages cho tên thủ công và sessionStorage tab cóTTL cho draft; không lưu token khách trong storage. Claim chỉ bằng chứng server hiện có và ràng buộc tài khoản; kết quả không chắc chắn phải xác minh ownership trước phục hồi. Kết quả fixture/local không thay chứng nhận dịch vụ thật. Cần người dùng duyệt bản vá và cấp môi trường thử trước phát hành; không coi commit/localPreview là quyền push hoặc deploy.

Thư viện 200 nghề/12 nhóm, modal chung, hai mode AI và liên kết truyện theo ID đã triển khai trên feat/task-2-career-library. Preview localhost:8003 riêng dùng PostgreSQL local và AI demo. 17 test backend và browser desktop/mobile PASS có fixture; Firebase/DeepSeek thật cho flow mới chưa kiểm chứng. Không push/merge/deploy/Neon; Nhiệm vụ 3 chưa bắt đầu. Xem docs/task-2-checkpoint.md.

### Quyết định QA Nhiệm vụ 1 + 2 — 2026-10-24

Đã xác nhận: chỉ sửa lỗi thực tế, giữ thiết kế và commit bản sửa đã kiểm chứng trên nhánh `feat/task-2-career-library`; không push/merge/deploy. Đã sửa whitelist runtime đúng bốn JSON nghề (không mở toàn bộ data/) và generation fence cho modal. Không đổi Firebase, quota 8 hoặc schema.

Còn mở, **chưa được duyệt triển khai**: bảo vệ `/api/advice` và `/api/career-stories/{career_id}/ask` bằng auth/quota/rate chung, hoặc chốt chính sách vô hiệu hóa legacy AI. Hiện hai API vượt lớp bảo vệ khi có provider key, tái hiện bằng mock; không tự tắt để tránh phá chức năng. Vì vậy kết luận NOT READY FOR VERCEL PREVIEW. Firebase/DeepSeek thật cho hai mode mới và Vercel build thật chưa kiểm chứng; không dùng fixture PASS thay cho bằng chứng live. Chi tiết tại docs/task-2-checkpoint.md và artifacts/super-board-report.md.

### Quyết định được duyệt: bảo vệ chung AI — 2026-10-24

Người dùng đã duyệt sửa auth/quota/rate chung thay vì tắt legacy, server guest không phụ thuộc Firebase, giới hạn shared PostgreSQL và commit cùng nhánh; không cấp quyền push/deploy/remote migration. Đã triển khai và kiểm local197PASS/0FAIL, hai High boundary cũ được đóng ở mức source/fixture. Chuẩn bị migration004 thêm bảng guest cookie và charge_quota cho member lease, không đổi CHECK quota8/status. Default proxy không tin XFF; không dùng session advisory lock với Neon pooling. Tích hợp live, migration target (gồm prerequisite003) và Vercel proxy/origin vẫn cần duyệt/kiểm riêng. Không blind-revert vềb8cef96 khi còn request member reserved, không DROP schema/data; xem docs/shared-ai-protection.md. Chưa sẵn sàng Preview dùng provider thật hoặc Production.

### Tích hợp bản chính — 2026-10-24

Yêu cầu mới cho phép chuẩn bị tích hợp và chỉ PR/merge/phát hành sau khi các kiểm tra bắt buộc đạt. Chọn nền Production thực7c07d33, fast-forward candidate349ff92, giữ migration002 nguyên byte; chưa nối lịch sử main không liên quan. Đã kiểm004 trên staging riêng theo yêu cầu, không ghi Production. Dữ liệu Production còn legacy UUID và1 request completed thiếu phiên nên chưa cho phép tiếp tục phát hành; không tự phê duyệt ngoại lệ, tạo phiên giả hoặc đổi DATABASE_URL khi binding chưa xác minh. Phương án đưa patch đã đối chiếu vào nhánh xuất phát origin/main chỉ là kế hoạch, chưa thực hiện. Chi tiết docs/release-task12-readiness.md.

## Quyết định hotfix được duyệt —24/10/2026

Cho phép nhánh riêng và phát hành hotfix performance/login khi an toàn; không sửa thư viện/thiết kế/Production credentials hoặc schema. Chọn connection reuse trong phạm vi request quản lý session và SET LOCAL, không pool toàn cục/auth cache. Cache nội dung chỉ RAM20phiên/30s và xóa khi đổi identity, mọi API vẫn xác minhserver. Return target allowlist/UUID không cấp quyền dữ liệu. Thử Production chỉ dữ liệu tổng hợp của phiên khách riêng,0AIcalls trong tạo/mở; latency member/Firebase Google thật phải ghi chưa kiểm chứng khi chưa có người dùng thao tác. Rollback là deployment6c trước hotfix, không reverse schema hoặc restore dữ liệu.


## Task4 Production canary — 25/10/2026

Đã xác nhận quyền triển khai có kiểm soát theo yêu cầu mới. Đã backup Neon READY/readback, áp migration006 additive trong transaction sau kiểm target/hash và bảng cũ/quota không đổi; không chạy001–005. Phát hành fde7ed2 / dpl_7ZaE94zBvSeBAps9HgTPkak9Q1aT lên domain chính thức, chỉ 1 UID QA Firebase đã verify được Task4; account khác/Guest giữ df1c300 ổn định, không sửa thư viện/Truyện nghề. Firebase email/password, DeepSeek, khảo sát/đề xuất/xác nhận/Neon và Guest8/concurrency LIVE có bằng chứng. Chưa Google popup/Brave; ID23 FAIL khi AI chưa dùng hồ sơ opt-in dù lưu/đọc đúng. 36PASS/16BLOCKED/1FAIL; không mở đại trà. Rollback deployment df1c300, giữ bảng additive/dữ liệu, không reset quota. Xem docs/task-4-production-rollout.md; không ghi secrets/UID/email học sinh vào memory.


## Task4 hotfix cá nhân hóa —25/10/2026

Được duyệt sửa/commit/phát hành QA-only, không migration. Tạo hotfix/task4-profile-context từ Production fde7ed2, kế thừa tài liệu36a5b8e. Hotfix957ffde / dpl_BwthFvvNpNDscwEuKPC744bVe38z đã lên domain chính thức, chỉ3 UID QA verified. Context cũ có dữ liệu nhưng model báo không có; A/B cùng hồ sơ/mode/model:old không đọc nonce, new đọc đúng sau tách block enabled/status/items gần câu hỏi, phân biệt conversation_notes. SELECT tối thiểu readonly/filterconfirmed/TTL/owner, OFF không query hoặc gửi giá trị.26 test local unique +LIVE ON/OFF/edit/2owner/irrelevant/correction và browser checkbox mới/old PASS. ID23 đã đóng,43PASS/10BLOCKED/0FAIL; không mở đại trà. Google popup user-confirmed PASS nhưng mode/career_id chưa khớp metadataNeon, giữ42partialBLOCKED; Brave thiếuenv; khảo sát mơ hồ structuredunavailable; Guest-profile canary chưa mở. Backup cũ READY; rollback về dpl_7ZaE94zBvSeBAps9HgTPkak9Q1aT, không DROP/resetquota/restoređè. Xem docs/task4-profile-hotfix.md. Không lưu email/UID/secrets trong memory.

## Task4.1 — quyết định Preview25/10/2026

Đã xác nhận: chỉ nhánh riêng/code/commit/Preview, không tự promoteProduction. Chọn metadata messages và bảngratelimits hiện có cho analysisjob thay vì migration006mới; UID verified, cùng thứ tựusage→session, PostgreSQLbudgetchung tách Guest8, cachehash/attemptlease, failure retry rõ. Chỉ confirmed opt-in mới dùng xuyênphiên; modeldraft/notes không biến thành hồ sơ xácnhận. Tạo Neon schema-only/credentialriêng và chỉthử QA tổnghợp; binding DeepSeek/Firebase Preview có sẵn dùng chungtarget vớiProduction, không claim provideraccountđộc lập/khôngcopysecret. Giữ canary QA-only, thêm đúnghostnamePreview vào Firebase và giữmiềncũ. Search thiếukey phảiBLOCKEDkhônggiảnguồn; GooglepopupPreview cầnngười dùng nghiệmthu. Backend/frontend/qualityeval hoànthànhởPreviewa2a2f76,56PythonPASS,16rubric13PASS3BLOCKED; không đổisốliệuTask4cũ. Remote377, commitcuối localchưapush; phát hành/merge/Productionvẫnchờduyệtriêng. Xem docs/task41-validation.md.

### Quyết định bổ sung UI công khai trên Preview

Đã xác nhận theo yêu cầu mới: UI Premium cho Guest/member/QA không cần quyền QA, backendanalysis/profilecanary không mở rộng. Flag ADVISOR_PREMIUM_UI_PREVIEW chỉPreview, Productionfailclosed; HTMLassetnewkhôngtrộnbackendeligibility. NonQA panel giải thích chưa phân tích, khảo sát vẫn lưu và chatđược qua stablegraph/DeepSeek thật. e933f98/Previewmới đã Chrome3persona LIVE PASS,5unitmới+3regressionPASS,12ảnh. Đãpush cáccheckpoint trên đúngfeaturebranch; không merge/Production/DBreset/migration. Giữ BraveBLOCKED nếuchưakey và khôngclaimGooglepopupPASS khi chỉ dùngSDKpassword. Xem docs/task41-preview-ui-fix.md.

### Quyết định thay thế: không giới hạn trí tuệ theo QA

Đã xác nhận theo yêu cầu mới nhất: mọi phiên hợp lệ dùng cùng pipeline Task4.1. Gỡ fallback stable theoUID, thay2promptcompatibility bằng core chung, UI không còn cần QAflag; analysisdraft mở với ngân sách riêng PG. Giữ canary chỉ cho bankprofile chưapháthành và context phải có quyền server, Guest không đọc confirmedbank. Không mở vôhạn API/quota, không đổi model theo vai trò. Những câu trả lời đã lưu vẫn cached để không mất lịch sử/charge lại, ghi rõ saved_response, không giả mới.

Preview dee7785 đã nghiệm thu ở mức mô tả docs/task41-unified-preview.md:57localPASS,3persona autoanalysisLIVE,18sharedturnLIVE+focusedstylefix/exploration,security/quota/rateLIVE. Không hợp thức hóa Brave hayGooglepopup chưa kiểm thànhPASS. Production vẫn957ffde. Chưa cho phép deployProduction; cần phêduyệt và build riêng envProduction, không promote Previewstaging hoặc chạy migration. Rollback ứng dụng về deployment đãghi, khôngreset/restoređèDB. Quyết định này thay thế chính sách “Guest/member dùng AIlegacy” của báo cáo trước.
## Quyết định mới — Task4.2 DDGS25/10/2026

Đã xác nhận theo đặc tả: dùngDDGS keyless như provider tùy chọn trongpipelineTask4.1, chỉ bậttrênPreview, giữBraveoptional vàmodelthật chungchoGuest/member/QA. Không thayđổi nhánh/envproject/Production, khôngmigration/resetquota. Chỉ quyền dữliệuprofile còncanary. Adapterchỉsnippet+kiểmlink, khôngextract/fullpagehayLLMURLfetch. Không épSearchmọitin; khônggửisurvey/profile/địnhdanhchotool. Preview4aae6f8 cóLIVE Searchthật nhưngGuestLIVE/Hadversarial/chấtlượngmộtcâupháplýcònthiếu, khôngđánhdấuhoàn tấttoànTask hoặcREADYProduction. Khôngtựpush; cầnphêduyệtProductionriêngvàbuildenvProduction, khôngpromotePreviewDBstaging. Chi tiết docs/task42-search-preview.md; quyếtđịnh này thay trạng thái “SearchchỉBrave/thiếukey”trướckia choPreview, khôngmặcđịnhbậtSearchởProduction.

## Đã xác nhận — Production canary Task 4.2

Theo yêu cầu mới, cho phép DDGS chỉ QA trên domain chính, không mở đại trà khi Guest Search/Google popup/injection LIVE chưa đạt. Mọi người giữ Task 4.1; chỉ giới hạn công cụ Search, không chuyển legacy. SEARCH_TEST_UIDS tách khỏi quyền profile; Production mặc định fail closed và controlled=false không tự mở Search. Source 1b1b640/deployment dpl_EJvYVHp8yYb4Ync29JPu91WXWa6c đã phát hành; rollback dee7785/deployment cũ. Canary smoke/bảo mật PASS nhưng nghiệm thu chất lượng Search PARTIAL (DDGS intermittent, ngữ cảnh ca4, nhãn cache ca3). Không đổi secrets, migration/reset hoặc merge. docs/task42-production-canary.md là trạng thái mới nhất, thay kết luận chỉ Preview/chưa có quyền Production trước đó; không cấp quyền mở Search cho tất cả.

Google Login QA và hiển thị nguồn trên domain chính đã được chủ dự án xác nhận thành công ngày 25/10/2026. Chỉ đóng mục popup/hiển thị nguồn đã kiểm; không mở rộng allowlist, không xem đó là phê duyệt Search đại trà hoặc chứng minh fresh-search/cache. Các hạn chế chất lượng và injection LIVE giữ nguyên.

## Sửa truy vấn nối tiếp — quyết định theo yêu cầu mới

Ưu tiên sửa bước khôi phục query và lọc nguồn, không viết lại AI. Ngữ cảnh chỉ lấy chủ đề công khai từ lịch sử có giới hạn, không gửi survey/profile; câu mới có chủ đề rõ ràng không kế thừa chủ đề cũ. Chỉ tìm lại một lần khi các kết quả sai chủ đề, chung timeout hiện có; không tăng quota hoặc đổi provider. Nguồn có năm không tự trở thành bằng chứng điểm chuẩn. Bản sửa local đã có kiểm thử, nhưng DDGS LIVE gặp timeout và chưa nghiệm thu DeepSeek thật/Preview; không tự thay Production canary hoặc mở Search đại trà. Chi tiết docs/task42-search-context-fix.md.

## Quyền phát hành có điều kiện — Search mọi role

Theo yêu cầu mới nhất, Search có thể mở cho Guest/member/QA trên Production chỉ sau LIVE và an toàn đạt; không còn yêu cầu giữQA-only vĩnh viễn. Điều kiện chưa đạt: Preview đã thử DeepSeek thật và sửa ngữ cảnh, nhưng nguồn số liệu thứ cấp có sai khác với thông báo chính thức, attribution chưa ổn và Guest LIVE thiếu quota hợp lệ. Không coi thông sốenabled hoặc testmock làPASS. Vì vậy chỉ có checkpointlocal và Preview; chưapush/pháthành hay mởSearchmọirole trênmain. Không lách/reset hạn mức. Tạm giữ Productioncanary hiệnhành; bước tiếp là reader bảng chính thức an toàn, metadata nguồn đượcxácminh và nghiệmthu lại đúng các ca thiếu. Docs/task42-context-live-validation.md là trạng thái mới nhất.


## Điểm chuẩn cần chứng cứ từ dòng công bố
Theo yêu cầu người dùng, snippet hoặc link đã kiểm không đủ cấp phép trả số điểm/dải điểm. Reader nhận diện bố cục công bố đã kiểm và đối chiếu tuple năm/trường/ngành/giới/khu vực/tổ hợp; thiếu chứng cứ thì hỏi lại hoặc báo chưa xác minh, không suy rộng. Metadata phân biệt nơi đăng, đơn vị cung cấp và nguồn được ghi; chưa có URL văn bản gốc thì để trống. Không thay bằng LLM tự điền. Mở Search đại trà chỉ sau LIVE/an toàn đạt, Guest hết hạn mức vẫn BLOCKED và không lách.

Đã xác nhận cuối đợt: người dùng báo Guest cũng hết lượt. Không reset/đổi định danh/IP/DB hay tăng hạn mức để đạt test; GuestLIVE còn BLOCKED nên chưa phát hành Search mọi role. Bản Preview d8491be đã xác minh nội dung bảng và DeepSeek qua API member/QA, guard không đoán ở các bảng chưa hỗ trợ. Giữ nguyên Production1b1b640 và canary; chưa push các sửa local khi điều kiện phát hành còn thiếu. Không gộp popupGoogle trước đó hay unitinjection thành bằng chứng LIVE của Preview mới.

## Quyết định phát hành Search toàn bộ — đã thực hiện
Yêu cầu trực tiếp mới cho phép Production Guest/Member/QA sau kiểm tra an toàn. Phát hiện Guest QA Production cũ còn7 lượt, khác staging hết lượt, cho phép nghiệm thu hợp lệ cùng backend; không phải xóa/reset/đổi định danh. Sau LIVE và bảo mật, promote đúng Production build bd906df /dpl_CoeNba7iFQNA7412ibdQbCUqqfwP; cấu hình SEARCH_PROVIDER=ddgs và SEARCH_QA_ONLY=false targetProduction đã xác minh. Không âm thầm giữ QA-only, không mở thêm quyền dữ liệu hồ sơ. Không thay Production Branch/main vì bản hoạt động được phát hành từ feature branch có ancestry Production. Giữ rollbackdeployment EJV và hai bindingSearch mới có thể gỡ riêng; không rollbackDB/quota. Báo cáo docs/task42-all-role-production-release.md là trạng thái mới nhất; các BLOCKED Guest/injection cũ được đóng đúng bằng chứng mẫu thực tế, không gộp Google popup mới vào PASS.

## Task 4.3 — thiết kế được chọn
Theo đặc tả mới, chỉ triển khai Preview, giữ Production Task4.2. Hiểu ý do DeepSeek trong cùng lượt trả lời (tool auto), không router từ khóa hoặc đáp án nghề hardcode. Model không nhận quyền chọn URL; server đối chiếu ID và dựng đường dẫn nội bộ, xác minh trích lời học sinh làm căn cứ; nguồn web không được tự yêu cầu điều hướng. Metadata lưu trong messages JSON, không migration; nút click không gọi thêm AI và không tự lưu nghề vào hồ sơ xác nhận. Mở tab mới để giữ chat/khảo sát; không thay UI chức năng đã duyệt. Không push nhánh mới để tránh một Preview tự động thiếu binding staging; dùng CLI Preview với cấu hình tách biệt hiện có.

Task4.3 sau LIVE: bổ sung hàng rào tham chiếu mơ hồ bằng tên/ID từ catalog/lượt vừa nói; đây là kiểm tra consistency bên cạnh LLM, không router nghề keyword hay phản hồi nghề mẫu. Model vẫn trả lời tự nhiên và có thể không phát nút khi cần hỏi chọn nghề. Chặn cả href Markdown không có trong sources để không đi vòng qua cấu trúc navigation_actions; citation thật và nút nội bộ vẫn hoạt động. Preview04a67da đã có bằng chứng API/Chrome; chưa đủ nghiệm thu GuestLIVE/Googlepopup, không dùng PASS local/password thay thế. Chỉ Preview, chưa push hoặc Production.

## Task4.3 — quyền phát hành Production mới đã thực hiện
Yêu cầu mới ghi rõ commit/push/deploy sau kiểm thử, thay phạm vi chỉPreview trước đó. Dùng candidate Production build --skip-domain kế thừa env hiện có, kiểm thật3nhóm với phiên GuestQAProduction còn quota4/8 (không đổi danh tính hoặc ngân sách) trước promote. Đã mở Navigation mọi role, Source608146c/deploymentG11k5MKTVWNhEAcszbhqGEZm1KiW; giữ DDGS mọi role và quyền dữ liệu riêng như cũ. Sourcebranch có ancestor Production thực, không thay main/ProductionBranch. Không resetDB/quota hoặc chạy migration; rollback vềCoeNba7 giữ metadata/hội thoại/quota. Googlepopup chưa tựnghiệmthu mới, báo rõ giới hạn. Docs/task43-production-release.md là trạng thái hiện hành.


## Task4.4 — Điều hướng liên tục
Yêu cầu mới thay quyết địnhTask4.3 mở tab mới: nội bộ mặc định cùng tab, mang conversation đã xác minh; external citations vẫn tabmới. Giữ backendownership/quota/model và không tự gọi phân tích khi quay lại chat. Phải kiểm Preview trước Production; không coi authfixture là Googlepopup thật.


## Task4.4 — Hồ sơ và ngữ cảnh nghề (27/10/2026)
Đã nhận đặc tả đầy đủ; thêm đề xuất có căn cứ trong cùng completion,8area không schema mới, metadata nghề vừa xem và bản nháp theo UID. Không tự ghi đè confirmed profile hoặc tháo QA gate cho quyền lưu. 113 phương thức localPASS, Chrome Task41/journeyPASS; chưa Preview/LIVE/Production. Chi tiết docs/task44-single-tab-journey.md.


## Task4.4 — Preview đủ điều kiện phát hành
57b67e0/5QsxtNtq: LIVE và ChromeGuest/Member/QA PASS, same-tab1→1, không AI/quota do điều hướng. GuestQAstaging6/8 còn2, khôngreset. Google do người dùng xác nhận ởa02d201; quyền confirmed-profile giữQA gate, không tách trí tuệ. Chuẩn bị Productioncandidate kế thừa env, rollbackG11/608146c. Xem docs/task44-single-tab-journey.md.

## Task4.4 — Đã thực hiện quyền phát hành có điều kiện
Yêu cầu người dùng cho phép Production sau Preview đạt được áp dụng cho da6d146/9TdB69Ns, mọirole dùng chung phân tích và hành trình. Chỉ promote build targetProduction kế thừa bindings, không promote staging hoặc nới quyền confirmed-profile. Hậu kiểm domain chính thành công; GuestProduction/Googlepopup mới còn giới hạn bằng chứng đã ghi riêng, không tự đánh dấuPASS hay reset hạn mức. Rollback chỉ deployment G11, khôngDB. Không thay ProductionBranch/main.

## Task4.4 — bản vá nút sai nghề, quyền mới
Đặc tả mới yêu cầu Preview trước và **phê duyệt riêng trước Production**, thay quyền phát hành tự động của đợt trước cho bản vá này. Chọn kiểm định ngữ nghĩa độc lập, chỉ khi có nút, để không dựa riêng trên việc tìm tên nghề. Dịch vụ không xác minh được thì không hiện nút, không đoán nghề khác; boundedretry1, không trả502 chỉ vì metadata. Giữ nguyên main/Production, dữ liệu và quyền hồ sơ; không tự push nhánh làm phát sinh Preview thiếu binding. Kết quả LIVE còn chờ, không suy từ mock.

## Nghiệm thu bản vá nút — phạm vi xác nhận
Preview3f77005/33DRW8y có58testlocal+11chatLIVE+Chrome3rolePASS cho điều hướng; không đồng nhất với Task4hoànthành. Giữ lỗi phân tích khảo sátLIVEValidationError và Googlepopup mới ở trạng thái chưađạt/chưakiểm, không che bằng mock. Không thay quyền hồ sơ hoặc tạoGuestmới để vượtquota. Chỉ bàn giaoPreview và chờ quyềnProduction mới; main/domainchính/ngữcảnhdữliệucũgiữnguyên.

## Final QA — giữ nguyên cổng phát hành
UserchỉchoFinalQA, khôngProduction/push/merge. Chọnsafe diagnosticskhônginput/context/locals; boundedrepairdùngvalidatorcũvàcùngsurveyrequest_id, khôngnớicăn cứ. DùngaliasPreviewtargetnullđãauthorizedthayvìsửaFirebasehoặcaliascótargetProduction. KhôngsuynguyênnhânValidationErrorlịch sửtừfixture; khôngbypassanalysisday6/6. Source3df3897hồiphụcLIVEvà55localtestPASSnhưngGooglepopupvàchứngcứlỗicũcònBLOCKED, nênNOTREADYProduction; báo cáo docs/task44-final-qa.md.

### Google QA đã được xác nhận
Phản hồi người dùng đóng blocker popup thật: thành công, đúng hội thoại và cùngtab. Chỉ nâng đúng mục Google thủ công lênPASS; không nâng mức xác minh lỗi lịch sử, phép đo quota hay quyền deploy. Giữ NOTREADYProduction trong khi còn blocker ValidationError; không push/merge/deploy.

### Historical ValidationError — không suy nguyên nhân
Yêu cầu mới cho phép kết luận root cause undetermined nếu không có bằng chứng. Dùng ma trậndữliệu giả đểkiểmhànhvihiện tại và theo dõi tái phát bằng schema_version/UUIDtrace, khôngdùngfieldvalue/UID/session làmtrace. Giữ schema/căn cứ/rate limit, không gọi lại Google đãPASS. ChỉPreview; khôngphát hànhProduction hoặcclaimđãsửalỗilịch sử.

Preview36a0490 kiểmAPI/cache/privacyPASS; chỉđổialiasPreview đãcấpphépsẵn,khôngauthconfig/Production. Tracecủa tácvụcũgiữnull,khôngbackfillgiả. Không đánhdấuPASSloglỗiLIVEvìanalysisbudget6/6; giữnguyênkếtluậnlịch sửundeterminedvàbằngchứnglocalriêng.

### Quyền đồng bộmain có điều kiện
Usermới chophépcậpnhậtmain, thayquyềnchỉPreviewtrướcđó, nhưngđặtcổngbắtbuộcdừngnếupushcóthểđổiProduction. ĐãxácminhVercelmainauto-build/promoteđangbật,nêndừngtrướcmerge/push; khôngtựđổiProductionsettingsđểvượtđiềukiện. Backuporiginmainlocalđãverify. Main:falsechỉlàđềxuấtchưaphêduyệt; sauđócầnnhánhtíchhợp/two-parenthistory/regressionthực. HistoricalValidationErrorvẫnundetermined; Task4chưađóng.

### Cho phép chặn main auto-deploy và đồng bộ
Userđãxácnhậnchophépmainfalse/tiếptụctíchhợp,pushmainkhiantoàn,khôngProd. Ápdụngguardởvercel.jsoncủachínhmergecommit,khôngđổiserviceconfig;giữhailịchsửvàkhôngforce. Giữpolicyđóchođếnkhiuserduyệtbậtlạiriêng. Sửanhỏimportexceptionvàcachefallbackđượckiểmregressiontrongintegration;khôngnhậnđólànguyênnhânValidationErrorlịchsử.

Đãthựchiệnđồngbộmain8c1d26c vàverifyGitHub2parent/config;Production9TdB69Nsda6d146khôngđổi. TừđâygiữmainGitauto-deploytắtchođếnkhiđượcduyệtriêng. KhôngđồngnhấtđồngbộcodevớipháthànhProductionhoặchoànthànhTask4.


### Phát hành Task 4.4 main — đã được xác nhận và thực hiện
Người dùng cho phép riêng Production SHA 3b2f704, tạo --prod --skip-domain, smoke rồi promote; quyền này thay thế giới hạn chỉ đồng bộ main trước đó. Đã phát hành dpl_6avJjUZdcAS95Rg2BsDRqUqutHrE và xác minh domain chính, giữ nguyên Production bindings/allowlist/schema/quota và main:false. Rollback chỉ đổi deployment về dpl_9TdB69NsBqWmKssEUQbNhG92jsVS, không phục hồi/xóa DB. Không coi phát hành là xác định nguyên nhân Historical ValidationError hoặc hoàn thành Task 4. Không mở rộng quyền hồ sơ/khởi tạo Guest thay thế để thử vượt hạn mức. Chi tiết và giới hạn LIVE trong docs/task44-production-release.md.

### Lưu GitHub sau phát hành — quyền đã xác nhận
Người dùng yêu cầu lưu dự án lên GitHub. Đã xác minh origin/main có commit mới hơn 88d8fd9; không ghi đè hoặc lùi main về bản 3b2f704 đã phát hành. Lưu ba tài liệu còn lại bằng nhánh docs/task44-production-release từ origin/main, không đụng các worktree phát triển dở, không merge hoặc deploy. Báo cáo phát hành ghi nhận thời điểm kiểm tra 3b2f704; không coi commit 88d8fd9 là đã deploy.
