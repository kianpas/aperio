DROP TABLE IF EXISTS schema.seat CASCADE;

INSERT INTO seats
  (name, seat_type, hourly_price, daily_price, monthly_price, capacity, floor, location, created_at, updated_at, register, active)
VALUES
  ('A-01', 'SINGLE', 2000, 10000, 99000, 1, '2F', 'Near Window', NOW(), NOW(), 'system', TRUE);


INSERT INTO menus (parent_id, name, description, url, active, type, sort_order, created_at, updated_at) VALUES (NULL, '예약하기', '예약 페이지', '/reservation', TRUE, 'MAIN_MENU', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO menus (parent_id, name, description, url, active, type, sort_order, created_at, updated_at) VALUES (NULL, '문의하기', '문의/연락처 페이지', '/contact', TRUE, 'MAIN_MENU', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO menus (parent_id, name, description, url, active, type, sort_order, created_at, updated_at) VALUES (NULL, 'FAQ', '자주 묻는 질문', '/faq', TRUE, 'MAIN_MENU', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);



INSERT INTO roles (code, name, description, active, created_at, updated_at)
VALUES
  ('ROLE_ADMIN', '관리자', '시스템 전체 관리 권한 보유자', true, NOW(), NOW()),
  ('ROLE_STAFF', '매니저', '일부 관리 기능 접근 가능', true, NOW(), NOW()),
  ('ROLE_USER', '일반 사용자', '일반적인 접근 권한만 보유', true, NOW(), NOW());

DROP TABLE public.users CASCADE;
DROP TABLE public.userrole  CASCADE;


INSERT INTO "faq" (category, category_order, question, answer, display_order, active, created_at, updated_at) VALUES
('서비스 이용', 1, '서비스 이용 방법은 어떻게 되나요?', '회원가입 후 로그인하시면 원하시는 서비스를 예약하고 이용하실 수 있습니다. 예약 페이지에서 원하는 좌석이나 회의실을 선택하고 결제를 진행하시면 됩니다.', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('서비스 이용', 1, '운영 시간은 어떻게 되나요?', '저희 Aperio 공유 오피스는 연중무휴 24시간 운영됩니다. 언제든지 편하신 시간에 방문하여 이용하실 수 있습니다.', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('서비스 이용', 1, '주차는 가능한가요?', '건물 내 지하주차장을 이용하실 수 있습니다. 시간당 요금이 부과되며, 월 정기권 회원은 무료 주차 혜택을 제공해 드립니다.', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- 예약 및 결제 카테고리 (category_order = 2)
('예약 및 결제', 2, '예약 취소는 어떻게 하나요?', '마이페이지의 ''예약 내역''에서 취소하고 싶은 예약을 찾아 ''예약 취소'' 버튼을 클릭하시면 됩니다. 취소 수수료는 이용 규정에 따라 달라질 수 있습니다.', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('예약 및 결제', 2, '결제 수단에는 어떤 것들이 있나요?', '신용카드, 체크카드, 그리고 간편 결제(카카오페이, 네이버페이)를 지원하고 있습니다. 월 정기권의 경우 자동 결제도 가능합니다.', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('예약 및 결제', 2, '환불 규정은 어떻게 되나요?', '이용 24시간 전 취소 시 100% 환불, 12시간 전 취소 시 50% 환불이 가능합니다. 그 이후 취소 시에는 환불이 불가능합니다.', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- 계정 관리 카테고리 (category_order = 3)
('계정 관리', 3, '비밀번호를 잊어버렸어요.', '로그인 페이지의 ''비밀번호 찾기'' 링크를 통해 가입하신 이메일로 비밀번호 재설정 링크를 받으실 수 있습니다.', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('계정 관리', 3, '회원 탈퇴는 어떻게 하나요?', '마이페이지 > 설정 > 회원 탈퇴에서 진행하실 수 있습니다. 탈퇴 시 모든 데이터는 삭제되며 복구가 불가능합니다.', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- 시설 및 편의사항 카테고리 (category_order = 4)
('시설 및 편의사항', 4, '인터넷은 어떻게 사용하나요?', '모든 공간에서 초고속 Wi-Fi를 무료로 이용하실 수 있습니다. 접속 정보는 현장에서 확인하실 수 있습니다.', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('시설 및 편의사항', 4, '프린터 사용이 가능한가요?', '공용 프린터를 이용하실 수 있습니다. 흑백 출력은 페이지당 100원, 컬러 출력은 페이지당 500원입니다.', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('시설 및 편의사항', 4, '회의실 예약 시 준비된 시설은 무엇인가요?', '모든 회의실에는 프로젝터/TV, 화이트보드, 화상회의 장비가 구비되어 있습니다. 추가로 필요한 장비는 프론트에 문의해 주세요.', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);